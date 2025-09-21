// ovs-language-plugin.ts
import { CodeMapping, forEachEmbeddedCode, LanguagePlugin, VirtualCode } from '@volar/language-core';
import type { TypeScriptExtraServiceScript } from '@volar/typescript';
import ts from 'typescript';
import { URI } from 'vscode-uri';

export const ovsLanguagePlugin: LanguagePlugin<URI> = {
  getLanguageId(uri) {
    if (uri.path.endsWith('.ovs')) {
      return 'ovs';
    }
  },
  createVirtualCode(_uri, languageId, snapshot) {
    if (languageId === 'ovs') {
      // 把整个文件当作 TS 虚拟代码
      return new ovsVirtualCode(snapshot);
    }
  },

  typescript: {
    extraFileExtensions: [
      { extension: 'ovs', isMixedContent: true, scriptKind: ts.ScriptKind.TS }
    ],
    getServiceScript() {
      return undefined;
    },
    getExtraServiceScripts(fileName, root) {
      const scripts: TypeScriptExtraServiceScript[] = [];
      // 遍历嵌入代码，如果你以后扩展其他语言可以放这里
      for (const code of [...forEachEmbeddedCode(root)]) {
        if (code.languageId === 'ts') {
          scripts.push({
            fileName: fileName + '.' + code.id + '.ts',
            code,
            extension: '.ts',
            scriptKind: ts.ScriptKind.TS,
          });
        }
      }
      return scripts;
    },
  },
};

export class ovsVirtualCode implements VirtualCode {
  id = 'root';
  languageId = 'ovs';
  mappings: CodeMapping[];
  embeddedCodes: VirtualCode[] = [];

  constructor(public snapshot: ts.IScriptSnapshot) {
    const length = snapshot.getLength();

    // 完整映射
    this.mappings = [{
      sourceOffsets: [0],
      generatedOffsets: [0],
      lengths: [length],
      data: {
        completion: true,
        format: true,
        navigation: true,
        semantic: true,
        structure: true,
        verification: true,
      },
    }];

    // 嵌入 TS 代码，复用 TypeScript 服务
    this.embeddedCodes = [{
      id: 'ts',
      languageId: 'ts',
      snapshot,
      mappings: [{
        sourceOffsets: [0],
        generatedOffsets: [0],
        lengths: [length],
        data: {
          completion: true,
          format: true,
          navigation: true,
          semantic: true,
          structure: true,
          verification: true,
        },
      }],
      embeddedCodes: [],
    }];
  }
}
