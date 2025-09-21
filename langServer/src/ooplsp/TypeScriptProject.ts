import * as ts from "typescript";
import * as path from "path-browserify";
import {
  createUriConverter,
  getWorkspaceFolder,
  isFileInDir,
  sortTSConfigs
} from "@volar/language-server/lib/project/typescriptProject.ts";
import {
  Language,
  LanguagePlugin,
  LanguageServer,
  type LanguageServerProject, type LanguageServicePlugin,
  ProjectContext,
  ProviderResult
} from "@volar/language-server";
import {URI} from "vscode-uri";
import {createUriMap, FileType, type InitializeParams} from "@volar/language-service";
import {
  createTypeScriptLS,
  ProjectExposeContext,
  TypeScriptProjectLS
} from "@volar/language-server/lib/project/typescriptProjectLs.ts";
import FindMatchTsConfigUtil from "./FindMatchTsConfigUtil.ts";
import {createLanguageServiceEnvironment} from "@volar/language-server/lib/project/simpleProject.ts";
import {getInferredCompilerOptions} from "@volar/language-server/lib/project/inferredCompilerOptions.ts";
import {createServer} from "@volar/language-server/node.ts";

export default class TypeScriptProject {
  static tsLocalized: ts.MapLike<string>
  static server: ReturnType<typeof createServer>
  static initializeParams: InitializeParams;
  static languageServicePlugins: LanguageServicePlugin[]
  static rootTsConfigNames = ['tsconfig.json', 'jsconfig.json'];
  static uriConverter: ReturnType<typeof createUriConverter>
  static configProjects = createUriMap<Promise<TypeScriptProjectLS>>();
  static inferredProjects = createUriMap<Promise<TypeScriptProjectLS>>();
  static rootTsConfigs = new Set<string>();
  static searchedDirs = new Set<string>();
  static create: (projectContext: ProjectExposeContext) => ProviderResult<{
    languagePlugins: LanguagePlugin<URI>[];
    setup?(options: {
      language: Language;
      project: ProjectContext;
    }): void;
  }>;

  static initTypeScriptProject(
    server: ReturnType<typeof createServer>,
    tsLocalized: ts.MapLike<string> | undefined,
    initializeParams: InitializeParams,
    languageServicePlugins: LanguageServicePlugin[],
    create?: (projectContext: ProjectExposeContext) => ProviderResult<{
      languagePlugins: LanguagePlugin<URI>[];
      setup?(options: {
        language: Language;
        project: ProjectContext;
      }): void;
    }>
  ): LanguageServerProject {
    this.tsLocalized = tsLocalized
    this.server = server
    this.initializeParams = initializeParams
    this.languageServicePlugins = languageServicePlugins
    this.create = create
    this.uriConverter = createUriConverter(server.workspaceFolders.all);
    return null
  }

  static async getLanguageService(uri) {
    const tsconfig = await FindMatchTsConfigUtil.findMatchTSConfig(this.server, uri);
    if (tsconfig) {
      const project = await TypeScriptProject.getOrCreateConfiguredProject(this.server, tsconfig);
      return project.languageService;
    }
    const workspaceFolder = getWorkspaceFolder(uri, this.server.workspaceFolders);
    const project = await TypeScriptProject.getOrCreateInferredProject(this.server, uri, workspaceFolder);
    return project.languageService;
  }

  static getOrCreateConfiguredProject(server: LanguageServer, tsconfig: string) {
    tsconfig = tsconfig.replace(/\\/g, '/');
    const tsconfigUri = TypeScriptProject.uriConverter.asUri(tsconfig);
    let projectPromise = TypeScriptProject.configProjects.get(tsconfigUri);
    if (!projectPromise) {
      const workspaceFolder = getWorkspaceFolder(tsconfigUri, server.workspaceFolders);
      const serviceEnv = createLanguageServiceEnvironment(server, [workspaceFolder]);
      projectPromise = createTypeScriptLS(
        ts,
        TypeScriptProject.tsLocalized,
        tsconfig,
        server,
        serviceEnv,
        workspaceFolder,
        TypeScriptProject.uriConverter,
        TypeScriptProject.create
      );
      TypeScriptProject.configProjects.set(tsconfigUri, projectPromise);
    }
    return projectPromise;
  }

  private static async getOrCreateInferredProject(server: LanguageServer, uri: URI, workspaceFolder: URI) {

    if (!TypeScriptProject.inferredProjects.has(workspaceFolder)) {
      TypeScriptProject.inferredProjects.set(workspaceFolder, (async () => {
        const inferOptions = await getInferredCompilerOptions(server);
        const serviceEnv = createLanguageServiceEnvironment(server, [workspaceFolder]);
        return createTypeScriptLS(
          ts,
          TypeScriptProject.tsLocalized,
          inferOptions,
          server,
          serviceEnv,
          workspaceFolder,
          TypeScriptProject.uriConverter,
          TypeScriptProject.create
        );
      })());
    }

    const project = await TypeScriptProject.inferredProjects.get(workspaceFolder)!;

    project.tryAddFile(TypeScriptProject.uriConverter.asFileName(uri));

    return project;
  }


}