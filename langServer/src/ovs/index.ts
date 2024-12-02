// Vite 插件
import {createFilter, Plugin} from "vite"
import SubhutiLexer from '../../../subhuti/src/parser/SubhutiLexer.ts'
import {es6Tokens} from 'subhuti-ts/src/language/es2015/Es6Tokens.ts'
import SubhutiCst from "../../../subhuti/src/struct/SubhutiCst.ts";
import JsonUtil from "../../../subhuti/src/utils/JsonUtil.ts";
import OvsParser from "./parser/OvsParser.ts";
import {ovsToAstUtil} from "./factory/Es6CstToOvsAstUtil.ts";
import {TokenProvider} from "../IntellijTokenUtil.ts";
import OvsAPI from "./OvsAPI.ts";
import generate from "@babel/generator";
import {LogUtil} from "../logutil.ts";
import traverse from '@babel/traverse';
import {MappingConverter} from "../languagePlugin.ts";
import * as recast from "recast";


export function traverseClearTokens(currentNode: SubhutiCst) {
    if (!currentNode || !currentNode.children || !currentNode.children.length)
        return
    // 将当前节点添加到 Map 中
    // 递归遍历子节点
    if (currentNode.children && currentNode.children.length > 0) {
        currentNode.children.forEach(child => traverseClearTokens(child))
    }
    currentNode.tokens = undefined
    return currentNode
}

export function traverseClearLoc(currentNode: SubhutiCst) {
    currentNode.loc = undefined
    if (!currentNode || !currentNode.children || !currentNode.children.length)
        return
    // 将当前节点添加到 Map 中
    // 递归遍历子节点
    if (currentNode.children && currentNode.children.length > 0) {
        currentNode.children.forEach(child => traverseClearLoc(child))
    }
    currentNode.loc = undefined
    return currentNode
}

export function vitePluginOvsTransform(code) {
    LogUtil.log('44444')
    const lexer = new SubhutiLexer(es6Tokens)
    const tokens = lexer.lexer(code)
    JsonUtil.log(tokens)
    if (!tokens.length) return code
    const parser = new OvsParser(tokens)

    let code1 = ''
    let curCst = parser.Program()
    // JsonUtil.log(7777)
    JsonUtil.log(56565656)
    curCst = traverseClearTokens(curCst)
    curCst = traverseClearLoc(curCst)
    console.log(123123)
    JsonUtil.log(curCst)
    // JsonUtil.log(curCst)
    //cst转 estree ast
    const ast = ovsToAstUtil.createFileAst(curCst)

    JsonUtil.log(ast)
    let genRes = null
    // 验证 AST 节点是否包含位置信息
    /*traverse(ast, {
        enter(path) {
            path.node.start = undefined
            path.node.end = undefined
            if (!path.node.loc) {
                throw Error(`Node of type ${path.node.type} is missing loc information.`);
            }
            path.node.loc.start.index = undefined
            path.node.loc.end.index = undefined
        }
    });*/
    try {

        const output = recast.print(ast).code;
        LogUtil.log(output)
        // LogUtil.log(ast)
        LogUtil.log('6666')

// 生成代码
        genRes = generate(ast, {
            sourceMaps: true,             // 启用源码映射
            sourceFileName: 'source.js',  // 源文件名
            fileName: 'generated.js',     // 生成文件名
            retainLines: true,            // 保留行号
            compact: false,               // 不压缩代码
            comments: true,
        });

        code1 = genRes.code

        if (code1) {
            code1 = removeSemicolons(code1)
        }
    } catch (e) {
        LogUtil.log('styleErrrrrrrr3333')
        LogUtil.log(e.message)
    }

    function removeSemicolons(code) {
        // 按行分割，处理每行，然后重新组合
        return code.replace(/;$/gm, '')
    }

    //ast to client ast
    // TokenProvider.visitNode(ast)
    // JsonUtil.log(TokenProvider.tokens)
    // OvsAPI.createVNode('div', 123)

    // code1 = parser.exec()
    // console.log(code1)
    // const mapping = new OvsMappingParser()
    // mapping.openMappingMode(curCst)
    // code1 = mapping.exec(curCst)
    // console.log(code1)
    console.log(code1)
    console.log(66666)
    console.log(genRes)
    console.log(genRes?.rawMappings)
    return {
        code: code1,
        mapping: genRes?.rawMappings
    }
    /*    return `
        // import OvsAPI from "@/ovs/OvsAPI.ts";\n
        ${code1.code}
        `*/
}

// const code = `let a = 'di
const code = `let a = 1;
let b = 2;
let c = 3;

let div1 = function() {
    return OvsAPI.createVNode("div", [a, b]);
}();
`

// const code = `let a = div{
//             header = div{123},
//             true
//         }
// `
const res = vitePluginOvsTransform(code)
// const getOffsets = new MappingConverter(code, res.code)
// const offsets = getOffsets.convertMappings(res.mapping)
// LogUtil.log('last offset offfff')
// LogUtil.log(offsets[offsets.length - 1].original.offset)
// LogUtil.log(offsets[offsets.length - 1].generated.offset)

// const getOffsets = new MappingConverter(code, res.code)
// const offsets = getOffsets.convertMappings(res.mapping)

// LogUtil.log(offsets)


export default function vitePluginOvs(): Plugin {
    const filter = createFilter(
        /\.ovs$/,
        null,
    )
    // @ts-ignore
    return {
        enforce: 'pre',
        transform(code, id) {
            if (!filter(id)) {
                return
            }
            code = vitePluginOvsTransform(code)

            return code
        }
    }
}
