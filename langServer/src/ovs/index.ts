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
import {traverse} from "@babel/types";

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
    console.log(code)
    const lexer = new SubhutiLexer(es6Tokens)
    const tokens = lexer.lexer(code)
    if (!tokens.length) return code
    const parser = new OvsParser(tokens)

    // console.log(tokens)
    let code1 = null
    let curCst = parser.Program()
    // JsonUtil.log(7777)
    curCst = traverseClearTokens(curCst)
    curCst = traverseClearLoc(curCst)
    // JsonUtil.log(curCst)
    console.log(111231)
    // JsonUtil.log(curCst)
    //cst转 estree ast
    const ast = ovsToAstUtil.createProgramAst(curCst)

    console.log(traverse)

    // 验证 AST 节点是否包含位置信息
    traverse(ast, {
        enter(path) {
            console.log(path.node.type)
            path.node.start = undefined
            path.node.end = undefined
            path.node.loc.start.index = undefined
            path.node.loc.end.index = undefined
            if (!path.node.loc) {
                console.error(`Node of type ${path.node.type} is missing loc information.`);
            }
        }
    });
    JsonUtil.log(ast)
    console.log(123123)
    console.log(56465)

    // 存储生成码 tokens
    const generatedTokens: any[] = [];

// 生成代码
    const genRes = generate(ast, {
        sourceMaps: true,             // 启用源码映射
        sourceFileName: 'source.js',  // 源文件名
        fileName: 'generated.js',     // 生成文件名
        tokens: true,                 // 启用 tokens
        retainLines: true,            // 保留行号
        compact: false,               // 不压缩代码
        comments: true,               // 保留注释
        onToken: (token) => {
            generatedTokens.push({
                type: token.type.label,
                value: token.value,
                start: token.start,
                end: token.end,
                loc: token.loc,
            });
        },
    });

    console.log(generatedTokens)
    console.log(genRes)
    console.log(genRes.map)
    console.log(genRes.rawMappings)
    code1 = genRes.code
    const sourcemap = genRes.sourcemap
    if (code1) {
        code1 = removeSemicolons(code1)
    }

    function removeSemicolons(code) {
        console.log(code)
        // 按行分割，处理每行，然后重新组合
        return code.replace(/;$/gm, '')
    }

    console.log(656555)
    console.log(code1)
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
    LogUtil.log('console code')
    LogUtil.log(code1)
    return `${code1}`
    /*    return `
        // import OvsAPI from "@/ovs/OvsAPI.ts";\n
        ${code1.code}
        `*/
}

const code = `let c1 = 123
let c2 = c1
let c3 = c2
let c4 = c3
let c5 = c4
let c6 = c5
let c7 = c6
let c8 = c7
let c9 = c8
let c10 = c9
let c11 = c10

Tes
`
// const code = `let a = div{
//             header = div{123},
//             true
//         }
// `
const res = vitePluginOvsTransform(code)


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
