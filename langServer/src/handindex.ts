import * as ts from "typescript";
import {createLanguageServiceHost, createSys, resolveFileLanguageId, TypeScriptProjectHost} from "@volar/typescript";
import {createLanguage, Language, LanguagePlugin} from "@volar/language-core";
import {createLanguageService, createUriMap, FileType, ProjectContext, ProviderResult} from "@volar/language-service";
import {asFileName} from "@volar/kit/lib/utils.ts";
import {URI} from "vscode-uri";
import {
  createConnection, createLanguageServiceEnvironment,
  createServer,
  getWorkspaceFolder,
  isFileInDir,
  type LanguageServer, type LanguageServerProject, sortTSConfigs
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

let languageService: ts.LanguageService;
const connection = createConnection();
const server = createServer(connection);


//这是在getlangservice里面的功能，根据uri
//server是一个，project是一个，但是langservice是不同的

tsconfig = tsconfig.replace(/\\/g, '/');
const tsconfigUri = uriConverter.asUri(tsconfig);
const workspaceFolder = getWorkspaceFolder(tsconfigUri, server.workspaceFolders);
const serviceEnv = createLanguageServiceEnvironment(server, [workspaceFolder]);
const sys = createSys(ts.sys, serviceEnv, getCurrentDirectory, uriConverter);


async function getLanguageService(uri) {
  const tsconfig = await findMatchTSConfig(server, uri);
  if (tsconfig) {
    const project = await getOrCreateConfiguredProject(server, tsconfig);
    return project.languageService;
  }
  const workspaceFolder = getWorkspaceFolder(uri, server.workspaceFolders);
  const project = await getOrCreateInferredProject(server, uri, workspaceFolder);
  return project.languageService;
}


let server: LanguageServer;
let uriConverter: ReturnType<typeof createUriConverter>;

const configProjects = createUriMap<Promise<TypeScriptProjectLS>>();
const inferredProjects = createUriMap<Promise<TypeScriptProjectLS>>();
const rootTsConfigs = new Set<string>();
const searchedDirs = new Set<string>();

const projectObj = {
  setup(_server) {
    uriConverter = createUriConverter(_server.workspaceFolders.all);
    server = _server;
    server.fileWatcher.onDidChangeWatchedFiles(({changes}) => {
      const tsConfigChanges = changes.filter(change => rootTsConfigNames.includes(change.uri.substring(change.uri.lastIndexOf('/') + 1)));

      for (const change of tsConfigChanges) {
        const changeUri = URI.parse(change.uri);
        const changeFileName = uriConverter.asFileName(changeUri);
        if (change.type === vscode.FileChangeType.Created) {
          rootTsConfigs.add(changeFileName);
        } else if ((change.type === vscode.FileChangeType.Changed || change.type === vscode.FileChangeType.Deleted) && configProjects.has(changeUri)) {
          if (change.type === vscode.FileChangeType.Deleted) {
            rootTsConfigs.delete(changeFileName);
          }
          const project = configProjects.get(changeUri);
          configProjects.delete(changeUri);
          project?.then(project => project.dispose());
        }
      }

      server.languageFeatures.requestRefresh(!!tsConfigChanges.length);
    });
  },
  async getLanguageService(uri) {
    const tsconfig = await findMatchTSConfig(server, uri);
    if (tsconfig) {
      const project = await getOrCreateConfiguredProject(server, tsconfig);
      return project.languageService;
    }
    const workspaceFolder = getWorkspaceFolder(uri, server.workspaceFolders);
    const project = await getOrCreateInferredProject(server, uri, workspaceFolder);
    return project.languageService;
  },
  async getExistingLanguageServices() {
    const projects = await Promise.all([
      ...configProjects.values() ?? [],
      ...inferredProjects.values() ?? [],
    ]);
    return projects.map(project => project.languageService);
  },
  reload() {
    for (const project of [
      ...configProjects.values() ?? [],
      ...inferredProjects.values() ?? [],
    ]) {
      project.then(p => p.dispose());
    }
    configProjects.clear();
    inferredProjects.clear();
  },
};

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

function getOrCreateConfiguredProject(server: LanguageServer, tsconfig: string) {
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

async function getOrCreateInferredProject(server: LanguageServer, uri: URI, workspaceFolder: URI) {

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

const languagePlugins = [
  ovsLanguagePlugin
];

const uriConverter = createUriConverter(server.workspaceFolders.all);

function createUriConverter(rootFolders: URI[]) {
  const encodeds = new Map<string, URI>();
  const isFileScheme = rootFolders.every(folder => folder.scheme === 'file');

  return {
    asFileName,
    asUri,
  };

  function asFileName(parsed: URI) {
    if (rootFolders.every(folder => folder.scheme === parsed.scheme && folder.authority === parsed.authority)) {
      if (isFileScheme) {
        return parsed.fsPath.replace(/\\/g, '/');
      } else {
        return parsed.path;
      }
    }
    const encoded = encodeURIComponent(`${parsed.scheme}://${parsed.authority}`);
    encodeds.set(encoded, parsed);
    return `/${encoded}${parsed.path}`;
  }

  function asUri(fileName: string) {
    for (const [encoded, uri] of encodeds) {
      const prefix = `/${encoded}`;
      if (fileName === prefix) {
        return URI.from({
          scheme: uri.scheme,
          authority: uri.authority,
        });
      }
      if (uri.authority) {
        if (fileName.startsWith(prefix + '/')) {
          return URI.from({
            scheme: uri.scheme,
            authority: uri.authority,
            path: fileName.substring(prefix.length),
          });
        }
      } else {
        if (fileName.startsWith(prefix)) {
          return URI.from({
            scheme: uri.scheme,
            authority: uri.authority,
            path: fileName.substring(prefix.length),
          });
        }
      }
    }
    if (!isFileScheme) {
      for (const folder of rootFolders) {
        return URI.parse(`${folder.scheme}://${folder.authority}${fileName}`);
      }
    }
    return URI.file(fileName);
  }
}


const project: ProjectContext = {
  typescript: {
    configFileName: typeof tsconfig === 'string' ? tsconfig : undefined,
    sys,
    uriConverter,
    ...createLanguageServiceHost(
      ts,
      sys,
      language,
      s => uriConverter.asUri(s),
      projectHost
    ),
  },
};

const fsFileSnapshots = createUriMap<[number | undefined, ts.IScriptSnapshot | undefined]>();
const language = createLanguage<URI>(
  [
    {getLanguageId: uri => server.documents.get(uri)?.languageId},
    ...languagePlugins,
    {getLanguageId: uri => resolveFileLanguageId(uri.path)},
  ],
  createUriMap(sys.useCaseSensitiveFileNames),
  (uri, includeFsFiles) => {
    const syncedDocument = server.documents.get(uri);

    let snapshot: ts.IScriptSnapshot | undefined;

    if (syncedDocument) {
      snapshot = syncedDocument.getSnapshot();
    } else if (includeFsFiles) {
      const cache = fsFileSnapshots.get(uri);
      const fileName = uriConverter.asFileName(uri);
      const modifiedTime = sys.getModifiedTime?.(fileName)?.valueOf();
      if (!cache || cache[0] !== modifiedTime) {
        if (sys.fileExists(fileName)) {
          const text = sys.readFile(fileName);
          const snapshot = text !== undefined ? ts.ScriptSnapshot.fromString(text) : undefined;
          fsFileSnapshots.set(uri, [modifiedTime, snapshot]);
        } else {
          fsFileSnapshots.set(uri, [modifiedTime, undefined]);
        }
      }
      snapshot = fsFileSnapshots.get(uri)?.[1];
    }

    if (snapshot) {
      language.scripts.set(uri, snapshot);
    } else {
      language.scripts.delete(uri);
    }
  }
);

const rootTsConfigNames = ['tsconfig.json', 'jsconfig.json'];
const searchedDirs = new Set<string>();
const rootTsConfigs = new Set<string>();
const configProjects = createUriMap<Promise<TypeScriptProjectLS>>();

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


const tsconfig = await findMatchTSConfig(server, uri);
const tsconfigUri = uriConverter.asUri(tsconfig);
const getCurrentDirectory = () => uriConverter.asFileName(workspaceFolder);
const workspaceFolder = getWorkspaceFolder(tsconfigUri, server.workspaceFolders);
const sys = createSys(ts.sys, serviceEnv, getCurrentDirectory, uriConverter);

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

connection.languages.semanticTokens.on(params => {
  const uri = URI.parse(params.textDocument.uri);
  const builder = new SemanticTokensBuilder()
  const build = builder.build()
  return build
})