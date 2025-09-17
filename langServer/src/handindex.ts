import * as ts from "typescript";
import {createLanguageServiceHost, createSys, resolveFileLanguageId, TypeScriptProjectHost} from "@volar/typescript";
import {createLanguage, Language, LanguagePlugin} from "@volar/language-core";
import {createLanguageService, createUriMap, FileType, ProjectContext, ProviderResult} from "@volar/language-service";
import {asFileName} from "@volar/kit/lib/utils.ts";
import {URI} from "vscode-uri";
import {
  createConnection, createLanguageServiceEnvironment,
  createServer, createTypeScriptProject, createUriConverter,
  getWorkspaceFolder,
  isFileInDir,
  type LanguageServer, type LanguageServerProject, loadTsdkByPath, sortTSConfigs
} from "@volar/language-server/node.ts";
import {ovsLanguagePlugin} from "./languagePlugin.ts";
import * as path from "path-browserify";
import {
  createTypeScriptLS,
  ProjectExposeContext,
  TypeScriptProjectLS
} from "@volar/language-server/lib/project/typescriptProjectLs.ts";
import {SemanticTokensBuilder} from "vscode-languageserver/node";
import {getInferredCompilerOptions} from "@volar/language-server/lib/project/inferredCompilerOptions.ts";
import * as vscode from "vscode-languageserver";
import {createTypeScriptServices} from "./typescript";
import {LogUtil} from "./logutil.ts";

function getLocalTsdkPath() {
  let tsdkPath = "C:\\Users\\qinky\\AppData\\Roaming\\npm\\node_modules\\typescript\\lib";
  // let tsdkPath = "C:\\Users\\qinkaiyuan\\AppData\\Roaming\\npm\\node_modules\\typescript\\lib";
  return tsdkPath.replace(/\\/g, '/');
}

const tsdkPath = getLocalTsdkPath();

const connection = createConnection();
const server = createServer(connection);

const uriConverter = createUriConverter(server.workspaceFolders.all);

const configProjects = createUriMap<Promise<TypeScriptProjectLS>>();
const inferredProjects = createUriMap<Promise<TypeScriptProjectLS>>();
const rootTsConfigs = new Set<string>();
const searchedDirs = new Set<string>();

const languagePlugins = [ovsLanguagePlugin]

const create = () => ({
  languagePlugins: languagePlugins,?>""

})

const rootTsConfigNames = ['tsconfig.json', 'jsconfig.json'];
let uri = 'testuri'

function createTypeScriptProject(tsLocalized: ts.MapLike<string> | undefined) {
  async function getLanguageService(uri) {
    const tsconfig = await findMatchTSConfig(server, uri);
    if (tsconfig) {
      const project = await getOrCreateConfiguredProject(server, tsconfig, tsLocalized);
      return project.languageService;
    }
    const workspaceFolder = getWorkspaceFolder(uri, server.workspaceFolders);
    const project = await getOrCreateInferredProject(server, uri, workspaceFolder, tsLocalized);
    return project.languageService;
  }
}


async function findMatchTSConfig(server: LanguageServer, uri: URI) {

  const fileName = uriConverter.asFileName(uri);

  let dir = path.dirname(fileName);

  while (true) {
    if (searchedDirs.has(dir)) {
      break;
    }
    searchedDirs.add(dir);
    for (const tsConfigName of rootTsConfigNames) {
      const tsconfigPath = path.join(dir, tsConfigName);
      if ((await server.fileSystem.stat?.(uriConverter.asUri(tsconfigPath)))?.type === FileType.File) {
        rootTsConfigs.add(tsconfigPath);
      }
    }
    dir = path.dirname(dir);
  }

  await prepareClosestootCommandLine();

  return await findDirectIncludeTsconfig() ?? await findIndirectReferenceTsconfig();

  async function prepareClosestootCommandLine() {

    let matches: string[] = [];

    for (const rootTsConfig of rootTsConfigs) {
      if (isFileInDir(fileName, path.dirname(rootTsConfig))) {
        matches.push(rootTsConfig);
      }
    }

    matches = matches.sort((a, b) => sortTSConfigs(fileName, a, b));

    if (matches.length) {
      await getCommandLine(matches[0]);
    }
  }

  function findIndirectReferenceTsconfig() {
    return findTSConfig(async tsconfig => {
      const tsconfigUri = uriConverter.asUri(tsconfig);
      const project = await configProjects.get(tsconfigUri);
      const languageService: ts.LanguageService | undefined = project?.languageService.context.inject('typescript/languageService');
      return !!languageService?.getProgram()?.getSourceFile(fileName);
    });
  }

  function findDirectIncludeTsconfig() {
    return findTSConfig(async tsconfig => {
      const map = createUriMap<boolean>();
      const commandLine = await getCommandLine(tsconfig);
      for (const fileName of commandLine?.fileNames ?? []) {
        const uri = uriConverter.asUri(fileName);
        map.set(uri, true);
      }
      return map.has(uri);
    });
  }

  async function findTSConfig(match: (tsconfig: string) => Promise<boolean> | boolean) {

    const checked = new Set<string>();

    for (const rootTsConfig of [...rootTsConfigs].sort((a, b) => sortTSConfigs(fileName, a, b))) {
      const tsconfigUri = uriConverter.asUri(rootTsConfig);
      const project = await configProjects.get(tsconfigUri);
      if (project) {

        let chains = await getReferencesChains(project.getCommandLine(), rootTsConfig, []);

        // This is to be consistent with tsserver behavior
        chains = chains.reverse();

        for (const chain of chains) {
          for (let i = chain.length - 1; i >= 0; i--) {
            const tsconfig = chain[i];

            if (checked.has(tsconfig)) {
              continue;
            }
            checked.add(tsconfig);

            if (await match(tsconfig)) {
              return tsconfig;
            }
          }
        }
      }
    }
  }

  async function getReferencesChains(commandLine: ts.ParsedCommandLine, tsConfig: string, before: string[]) {

    if (commandLine.projectReferences?.length) {

      const newChains: string[][] = [];

      for (const projectReference of commandLine.projectReferences) {

        let tsConfigPath = projectReference.path.replace(/\\/g, '/');

        // fix https://github.com/johnsoncodehk/volar/issues/712
        if ((await server.fileSystem.stat?.(uriConverter.asUri(tsConfigPath)))?.type === FileType.File) {
          const newTsConfigPath = path.join(tsConfigPath, 'tsconfig.json');
          const newJsConfigPath = path.join(tsConfigPath, 'jsconfig.json');
          if ((await server.fileSystem.stat?.(uriConverter.asUri(newTsConfigPath)))?.type === FileType.File) {
            tsConfigPath = newTsConfigPath;
          } else if ((await server.fileSystem.stat?.(uriConverter.asUri(newJsConfigPath)))?.type === FileType.File) {
            tsConfigPath = newJsConfigPath;
          }
        }

        const beforeIndex = before.indexOf(tsConfigPath); // cycle
        if (beforeIndex >= 0) {
          newChains.push(before.slice(0, Math.max(beforeIndex, 1)));
        } else {
          const referenceCommandLine = await getCommandLine(tsConfigPath);
          if (referenceCommandLine) {
            for (const chain of await getReferencesChains(referenceCommandLine, tsConfigPath, [...before, tsConfig])) {
              newChains.push(chain);
            }
          }
        }
      }

      return newChains;
    } else {
      return [[...before, tsConfig]];
    }
  }

  async function getCommandLine(tsConfig: string) {
    const project = await getOrCreateConfiguredProject(server, tsConfig);
    return project?.getCommandLine();
  }
}

function getOrCreateConfiguredProject(server: LanguageServer, tsconfig: string, tsLocalized: ts.MapLike<string>) {
  tsconfig = tsconfig.replace(/\\/g, '/');
  const tsconfigUri = uriConverter.asUri(tsconfig);
  let projectPromise = configProjects.get(tsconfigUri);
  if (!projectPromise) {
    const workspaceFolder = getWorkspaceFolder(tsconfigUri, server.workspaceFolders);
    const serviceEnv = createLanguageServiceEnvironment(server, [workspaceFolder]);
    projectPromise = createTypeScriptLS(
      ts,
      tsLocalized,
      tsconfig,
      server,
      serviceEnv,
      workspaceFolder,
      uriConverter,
      create
    );
    configProjects.set(tsconfigUri, projectPromise);
  }
  return projectPromise;
}

async function getOrCreateInferredProject(server: LanguageServer, uri: URI, workspaceFolder: URI, tsLocalized: ts.MapLike<string>) {

  if (!inferredProjects.has(workspaceFolder)) {
    inferredProjects.set(workspaceFolder, (async () => {
      const inferOptions = await getInferredCompilerOptions(server);
      const serviceEnv = createLanguageServiceEnvironment(server, [workspaceFolder]);
      return createTypeScriptLS(
        ts,
        tsLocalized,
        inferOptions,
        server,
        serviceEnv,
        workspaceFolder,
        uriConverter,
        create
      );
    })());
  }

  const project = await inferredProjects.get(workspaceFolder)!;

  project.tryAddFile(uriConverter.asFileName(uri));

  return project;
}

connection.onInitialize(params => {
  LogUtil.log('params')
  try {
    const tsdk = loadTsdkByPath(tsdkPath, params.locale);
    const tsLocalized = tsdk.diagnosticMessages
    const tsProject = createTypeScriptProject(tsdk.typescript,tsLocalized)

    const getCurrentDirectory = () => uriConverter.asFileName(workspaceFolder);
    const projectHost: TypeScriptProjectHost = {
      getCurrentDirectory,
      getProjectVersion() {
        return projectVersion.toString();
      },
      getScriptFileNames() {
        return commandLine.fileNames;
      },
      getCompilationSettings() {
        return commandLine.options;
      },
      getLocalizedDiagnosticMessages: tsLocalized ? () => tsLocalized : undefined,
      getProjectReferences() {
        return commandLine.projectReferences;
      },
    };

    const createLanguageServiceHostAll = createLanguageServiceHost(
      ts,
      sys,
      language,
      s => uriConverter.asUri(s),
      projectHost
    )


    const languageServicePlugins = [...createTypeScriptServices(tsdk.typescript)]
    return server.initialize(
      params,
      tsProject,
      [
        ...languageServicePlugins
      ],
    )
  } catch (e) {
    LogUtil.log(7777)
    LogUtil.log(e.message)
  }
});



//这是在getlangservice里面的功能，根据uri
//server是一个，project是一个，但是langservice是不同的



connection.languages.semanticTokens.on(params => {
  const uri = URI.parse(params.textDocument.uri);
  const builder = new SemanticTokensBuilder()
  const build = builder.build()
  return build
})