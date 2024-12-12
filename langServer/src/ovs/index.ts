// Vite 插件
import {createFilter, Plugin} from "vite"
import SubhutiLexer from '../../../subhuti/src/parser/SubhutiLexer.ts'
import {es6Tokens} from 'subhuti-ts/src/language/es2015/Es6Tokens.ts'
import SubhutiCst from "../../../subhuti/src/struct/SubhutiCst.ts";
import JsonUtil from "../../../subhuti/src/utils/JsonUtil.ts";
import Es6Parser from "slime-parser/src/language/es2015/Es6Parser.ts";
import SlimeCstToAstUtil from "slime-parser/src/language/SlimeLiteralAstUtil.ts";
import SlimeGenerator from "slime-generator/src/SlimeGenerator";

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

    const lexer = new SubhutiLexer(es6Tokens)
    const tokens = lexer.lexer(code)
    if (!tokens.length) return code
    const parser = new Es6Parser(tokens)

    let code1 = null
    let curCst = parser.Program()
    curCst = traverseClearTokens(curCst)
    // curCst = traverseClearLoc(curCst)
    // JsonUtil.log(7777)
    // curCst = traverseClearTokens(curCst)
    JsonUtil.log(curCst)
    const ast = SlimeCstToAstUtil.toProgram(curCst)
    JsonUtil.log(ast)
    const code11 = SlimeGenerator.generator(ast)
    console.log(code11.code)
    console.log(code11.mapping)

    return code11
    /*    return `
        // import OvsAPI from "@/ovs/OvsAPI.ts";\n
        ${code1.code}
        `*/
}

// const code = `let a = 'di
const code = `let a = 1
let b = 2
let c = 3
`
//
// let div1 = function() {
//     return OvsAPI.createVNode("div", [a, b])
// }()
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
