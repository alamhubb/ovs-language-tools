import type * as vscode from '@volar/language-service';
import type {TextDocument} from 'vscode-languageserver-textdocument';
import {safeCall} from '../shared';
import type {SharedContext} from './types';
import type {URI} from 'vscode-uri';
import {LogUtil} from "../../../logutil";

export function register(ts: typeof import('typescript'), ctx: SharedContext) {
    LogUtil.log('chufale semanticTokens.register register')
    return (uri: URI, document: TextDocument, range: vscode.Range, legend: vscode.SemanticTokensLegend) => {

        LogUtil.log('chufale semanticTokens.register( ctx: Share6666')
        LogUtil.log(legend)
        const fileName = ctx.uriToFileName(uri);

        LogUtil.log('range：' + range)
        LogUtil.log(range)
        LogUtil.log('document.offsetAt(range.start)：' + document.offsetAt(range.start))
        LogUtil.log('document.getText().length：' + document.getText().length)

        const start = range ? document.offsetAt(range.start) : 0;
        LogUtil.log(' (document.offsetAt(range.end) - start))：' + (document.offsetAt(range.end) - start))
        const length = range ? (document.offsetAt(range.end) - start) : document.getText().length;

        if (ctx.project.typescript?.languageServiceHost.getCancellationToken?.().isCancellationRequested()) {
            return;
        }
        LogUtil.log('fileName：' + fileName)
        LogUtil.log('start：' + start)
        LogUtil.log('length：' + length)
        const response = safeCall(() => ctx.languageService.getEncodedSemanticClassifications(fileName, {
            start,
            length
        }, ts.SemanticClassificationFormat.TwentyTwenty));
        if (!response) {
            return;
        }

        let tokenModifiersTable: number[] = [];
        tokenModifiersTable[TokenModifier.async] = 1 << legend.tokenModifiers.indexOf('async');
        tokenModifiersTable[TokenModifier.declaration] = 1 << legend.tokenModifiers.indexOf('declaration');
        tokenModifiersTable[TokenModifier.readonly] = 1 << legend.tokenModifiers.indexOf('readonly');
        tokenModifiersTable[TokenModifier.static] = 1 << legend.tokenModifiers.indexOf('static');
        tokenModifiersTable[TokenModifier.local] = 1 << legend.tokenModifiers.indexOf('local');
        tokenModifiersTable[TokenModifier.defaultLibrary] = 1 << legend.tokenModifiers.indexOf('defaultLibrary');
        tokenModifiersTable = tokenModifiersTable.map(mod => Math.max(mod, 0));

        const end = start + length;
        const tokenSpan = response.spans;
        LogUtil.log('ts tokenspan----')
        LogUtil.log(tokenSpan)

        const tokens: [number, number, number, number, number][] = [];
        let i = 0;
        while (i < tokenSpan.length) {
            const offset = tokenSpan[i++];
            if (offset >= end) {
                break;
            }
            const length = tokenSpan[i++];
            const tsClassification = tokenSpan[i++];

            //7
            const tokenType = getTokenTypeFromClassification(tsClassification);
            if (tokenType === undefined) {
                continue;
            }
            // we can use the document's range conversion methods because the result is at the same version as the document
            const startPos = document.positionAt(offset);
            const endPos = document.positionAt(offset + length);
            const serverToken = tsTokenTypeToServerTokenType(tokenType);
            if (serverToken === undefined) {
                continue;
            }


            const tokenModifiers = getTokenModifierFromClassification(tsClassification);



            const serverTokenModifiers = tsTokenModifierToServerTokenModifier(tokenModifiers);

            LogUtil.log('tsTokenModifierToServerTokenModifier(tokenModifiers)')
            LogUtil.log('tsClassification:'+tsClassification)
            LogUtil.log('tokenType:'+tokenType)
            LogUtil.log('serverToken:'+serverToken)
            LogUtil.log('tokenModifiers:'+tokenModifiers)
            LogUtil.log('serverTokenModifiers:'+serverTokenModifiers)

            for (let line = startPos.line; line <= endPos.line; line++) {
                const startCharacter = (line === startPos.line ? startPos.character : 0);
                const endCharacter = (line === endPos.line ? endPos.character : docLineLength(document, line));
                tokens.push([line, startCharacter, endCharacter - startCharacter, serverToken, serverTokenModifiers]);
            }
        }
        LogUtil.log(tokens)
        return tokens;

        function tsTokenTypeToServerTokenType(tokenType: number) {
            return legend.tokenTypes.indexOf(tokenTypes[tokenType]);
        }

        function tsTokenModifierToServerTokenModifier(input: number) {
            let m = 0;
            let i = 0;
            while (input) {
                if (input & 1) {
                    m |= tokenModifiersTable[i];
                }
                input = input >> 1;
                i++;
            }
            return m;
        }
    };
}

function docLineLength(document: TextDocument, line: number) {
    const currentLineOffset = document.offsetAt({line, character: 0});
    const nextLineOffset = document.offsetAt({line: line + 1, character: 0});
    return nextLineOffset - currentLineOffset;
}

// typescript encodes type and modifiers in the classification:
// TSClassification = (TokenType + 1) << 8 + TokenModifier

enum TokenType {
    class = 0,
    enum = 1,
    interface = 2,
    namespace = 3,
    typeParameter = 4,
    type = 5,
    parameter = 6,
    variable = 7,
    enumMember = 8,
    property = 9,
    function = 10,
    method = 11,
    _ = 12
}

console.log(TokenType.class)

enum TokenModifier {
    declaration = 0,
    static = 1,
    async = 2,
    readonly = 3,
    defaultLibrary = 4,
    local = 5,
    _ = 6
}

enum TokenEncodingConsts {
    typeOffset = 8,
    modifierMask = 255
}

function getTokenTypeFromClassification(tsClassification: number): number | undefined {
    if (tsClassification > TokenEncodingConsts.modifierMask) {
        const res = (tsClassification >> TokenEncodingConsts.typeOffset) - 1
        LogUtil.log('tsClassification > TokenEncodingConsts.modifierMask:' + res)
        return res;
    }
    return undefined;
}

function getTokenModifierFromClassification(tsClassification: number) {
    return tsClassification & TokenEncodingConsts.modifierMask;
}

const tokenTypes: string[] = [];
tokenTypes[TokenType.class] = 'class';
tokenTypes[TokenType.enum] = 'enum';
tokenTypes[TokenType.interface] = 'interface';
tokenTypes[TokenType.namespace] = 'namespace';
tokenTypes[TokenType.typeParameter] = 'typeParameter';
tokenTypes[TokenType.type] = 'type';
tokenTypes[TokenType.parameter] = 'parameter';
tokenTypes[TokenType.variable] = 'variable';
tokenTypes[TokenType.enumMember] = 'enumMember';
tokenTypes[TokenType.property] = 'property';
tokenTypes[TokenType.function] = 'function';
tokenTypes[TokenType.method] = 'method';

const tokenModifiers: string[] = [];
tokenModifiers[TokenModifier.async] = 'async';
tokenModifiers[TokenModifier.declaration] = 'declaration';
tokenModifiers[TokenModifier.readonly] = 'readonly';
tokenModifiers[TokenModifier.static] = 'static';
tokenModifiers[TokenModifier.local] = 'local';
tokenModifiers[TokenModifier.defaultLibrary] = 'defaultLibrary';

export enum ClassificationType {
    comment = 1,
    identifier = 2,
    keyword = 3,
    numericLiteral = 4,
    operator = 5,
    stringLiteral = 6,
    regularExpressionLiteral = 7,
    whiteSpace = 8,
    text = 9,
    punctuation = 10,
    className = 11,
    enumName = 12,
    interfaceName = 13,
    moduleName = 14,
    typeParameterName = 15,
    typeAliasName = 16,
    parameterName = 17,
    docCommentTagName = 18,
    jsxOpenTagName = 19,
    jsxCloseTagName = 20,
    jsxSelfClosingTagName = 21,
    jsxAttribute = 22,
    jsxText = 23,
    jsxAttributeStringLiteralValue = 24,
    bigintLiteral = 25,
}

// mapping for the original ClassificationType from TypeScript (only used when plugin is not available)
const tokenTypeMap: number[] = [];


export const ExperimentalProtocol = {
    ClassificationType: ClassificationType
}

tokenTypeMap[ExperimentalProtocol.ClassificationType.className] = TokenType.class;
tokenTypeMap[ExperimentalProtocol.ClassificationType.enumName] = TokenType.enum;
tokenTypeMap[ExperimentalProtocol.ClassificationType.interfaceName] = TokenType.interface;
tokenTypeMap[ExperimentalProtocol.ClassificationType.moduleName] = TokenType.namespace;
tokenTypeMap[ExperimentalProtocol.ClassificationType.typeParameterName] = TokenType.typeParameter;
tokenTypeMap[ExperimentalProtocol.ClassificationType.typeAliasName] = TokenType.type;
tokenTypeMap[ExperimentalProtocol.ClassificationType.parameterName] = TokenType.parameter;


