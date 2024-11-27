import {CodeMapping, forEachEmbeddedCode, LanguagePlugin, VirtualCode} from '@volar/language-core';
import type {TypeScriptExtraServiceScript} from '@volar/typescript';
import ts from 'typescript';
import {URI} from 'vscode-uri';
import * as console from "node:console";
import {LogUtil} from "./logutil.js";
import {vitePluginOvsTransform} from "./ovs";

export const ovsLanguagePlugin: LanguagePlugin<URI> = {
    getLanguageId(uri) {
        if (uri.path.endsWith('.ovs')) {
            return 'ovs';
        }
    },
    createVirtualCode(_uri, languageId, snapshot) {
        if (languageId === 'ovs') {
            return new OvsVirtualCode(snapshot);
        }
    },
    typescript: {
        extraFileExtensions: [{extension: 'ovs', isMixedContent: true, scriptKind: 7 satisfies ts.ScriptKind.Deferred}],
        getServiceScript() {
            return undefined;
        },
        getExtraServiceScripts(fileName, root) {
            const scripts: TypeScriptExtraServiceScript[] = [];
            //得到所有的虚拟代码片段
            const ary = [...forEachEmbeddedCode(root)]
            // console.log(ary.length)
            // LogUtil.log(ary.length)
            // LogUtil.log(root.embeddedCodes)
            for (const code of ary) {
                // LogUtil.log('code')
                // LogUtil.log(code)
                // LogUtil.log(code.languageId)
                if (code.languageId === 'qqqts') {
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


interface BabelMapping {
    generated: { line: number; column: number };
    original: { line: number; column: number };
    source: string;
    name?: string;
}

interface SegmentInfo {
    offset: number;
    length: number;
}

interface EnhancedMapping {
    generated: SegmentInfo;
    original: SegmentInfo;
}

export class MappingConverter {
    private sourceLineStarts: number[];
    private generatedLineStarts: number[];

    constructor(sourceCode: string, generatedCode: string) {
        this.sourceLineStarts = this.computeLineStarts(sourceCode);
        this.generatedLineStarts = this.computeLineStarts(generatedCode);
    }

    private computeLineStarts(code: string): number[] {
        const starts = [0];
        let pos = 0;
        while ((pos = code.indexOf('\n', pos)) !== -1) {
            starts.push(pos + 1);
            pos++;
        }
        return starts;
    }

    private positionToOffset(position: { line: number; column: number }, lineStarts: number[]): number {
        const lineIndex = position.line - 1;
        return lineStarts[lineIndex] + position.column;
    }

    /**
     * 计算两个位置之间的长度
     */
    private calculateLength(
        current: { line: number; column: number },
        next: { line: number; column: number } | undefined,
        lineStarts: number[]
    ): number {
        if (!next) {
            return 1; // 如果是最后一个位置，默认长度为1
        }

        if (current.line === next.line) {
            // 同一行，直接计算列差
            return next.column - current.column;
        } else {
            // 跨行，计算到行尾的距离
            const currentLineLength = (lineStarts[current.line] || 0) -
                (lineStarts[current.line - 1] + current.column);
            return currentLineLength;
        }
    }

    convertMappings(mappings: BabelMapping[]): EnhancedMapping[] {
        return mappings.map((mapping, index) => {
            const nextMapping = mappings[index + 1];

            // 计算生成代码的信息
            const generatedOffset = this.positionToOffset(
                mapping.generated,
                this.generatedLineStarts
            );
            const generatedLength = this.calculateLength(
                mapping.generated,
                nextMapping?.generated,
                this.generatedLineStarts
            );

            // 计算源代码的信息
            const originalOffset = this.positionToOffset(
                mapping.original,
                this.sourceLineStarts
            );
            const originalLength = this.calculateLength(
                mapping.original,
                nextMapping?.original,
                this.sourceLineStarts
            );

            return {
                generated: {
                    offset: generatedOffset,
                    length: generatedLength
                },
                original: {
                    offset: originalOffset,
                    length: originalLength
                }
            };
        });
    }
}

export class OvsVirtualCode implements VirtualCode {
    id = 'root';
    languageId = 'qqovs';
    mappings: CodeMapping[];
    embeddedCodes: VirtualCode[] = [];

    constructor(public snapshot: ts.IScriptSnapshot) {
        this.mappings = [{
            sourceOffsets: [0],
            generatedOffsets: [0],
            lengths: [snapshot.getLength()],
            data: {
                completion: true,
                format: true,
                navigation: true,
                semantic: true,
                structure: true,
                verification: true,
            },
        }];
        const styleText = snapshot.getText(0, snapshot.getLength());
        let newCode = styleText
        LogUtil.log('styleTextstyleTextstyleTextstyleText')
        let mapping = []
        try {
            LogUtil.log('3333')
            const res = vitePluginOvsTransform(styleText)
            newCode = res.code
            mapping = res.mapping
        } catch (e: Error) {
            LogUtil.log('styleErrrrrrrr')
            LogUtil.log(styleText)
            LogUtil.log(e.message)
        }
        const getOffsets = new MappingConverter(styleText, newCode)
        const offsets = getOffsets.convertMappings(mapping)
        LogUtil.log('last offset offfff')
        LogUtil.log(offsets[offsets.length - 1].original.offset)
        LogUtil.log(offsets[offsets.length - 1].generated.offset)
        //将ovscode转为js代码，传给ts
        /*this.embeddedCodes = [{
            id: 'ts',
            languageId: 'qqqts',
            snapshot: {
                getText: (start, end) => styleText.substring(start, end),
                getLength: () => styleText.length,
                getChangeRange: () => undefined,
            },
            mappings: []
        }];*/

        this.embeddedCodes = [{
            id: 'ts1',
            languageId: 'qqqts',
            snapshot: {
                getText: (start, end) => newCode.substring(start, end),
                getLength: () => newCode.length,
                getChangeRange: () => undefined,
            },
            // sourceOffsets: number[];
            // generatedOffsets: number[];
            // lengths: number[];
            // generatedLengths?: number[];
            // data: Data;
            mappings: [{
                // sourceOffsets: offsets.map(item => item.original.offset),
                // generatedOffsets: offsets.map(item => item.generated.offset),
                // lengths: offsets.map(item => item.original.length),
                sourceOffsets: [0],
                generatedOffsets: [0],
                lengths: [newCode.length],
                data: {
                    completion: true,
                    format: true,
                    navigation: true,
                    semantic: true,
                    structure: true,
                    verification: true
                },
            }],
            embeddedCodes: [],
        }];
    }
}

