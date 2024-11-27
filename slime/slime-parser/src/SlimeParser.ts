import SubhutiLexer from 'subhuti/src/parser/SubhutiLexer.ts'
import SubhutiCst from "subhuti/src/struct/SubhutiCst.ts";
import JsonUtil from "subhuti/src/utils/JsonUtil.ts";
import {es6Tokens} from "./language/es2015/Es6Tokens.ts";
import Es6Parser from "./language/es2015/Es6Parser.ts";


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
    // JsonUtil.log(7777)
    curCst = traverseClearTokens(curCst)
    JsonUtil.log(curCst)
}

const code = `let a = 1`


const res = vitePluginOvsTransform(code)
