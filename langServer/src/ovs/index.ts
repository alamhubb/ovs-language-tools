// Vite 插件
import {createFilter, Plugin} from "vite"
import SubhutiLexer from '../../../subhuti/src/parser/SubhutiLexer.ts'
import {es6Tokens} from 'subhuti-ts/src/language/es2015/Es6Tokens.ts'
import SubhutiCst from "../../../subhuti/src/struct/SubhutiCst.ts";
import JsonUtil from "../../../subhuti/src/utils/JsonUtil.ts";
import Es6Parser from "slime-parser/src/language/es2015/Es6Parser.ts";
import SlimeCstToAstUtil from "slime-parser/src/language/SlimeCstToAstUtil.ts";
import SlimeGenerator from "slime-generator/src/SlimeGenerator.ts";
import SlimeCodeMapping, {SlimeGeneratorResult} from "slime-generator/src/SlimeCodeMapping";
import OvsParser from "./parser/OvsParser.ts";
import OvsCstToSlimeAstUtil from "./factory/OvsCstToSlimeAstUtil.ts";

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


export interface SourceMapSourceGenerateIndexLength {
  source: number[]
  generate: number[]
  length: number[]
  generateLength: number[]
}

export function vitePluginOvsTransform(code: string): SlimeGeneratorResult {

  const lexer = new SubhutiLexer(es6Tokens)
  const tokens = lexer.lexer(code)

  if (!tokens.length) return {
    code: code,
    mapping: []
  }
  const parser = new OvsParser(tokens)

  let curCst = parser.Program()
  curCst = traverseClearTokens(curCst)
  // curCst = traverseClearLoc(curCst)
  // JsonUtil.log(7777)
  // curCst = traverseClearTokens(curCst)
  JsonUtil.log(curCst)
  const ast = OvsCstToSlimeAstUtil.toProgram(curCst)
  JsonUtil.log(666)
  JsonUtil.log(ast)
  const code11 = SlimeGenerator.generator(ast)
  // console.log(computedIndex(code11.mapping))

  return code11
  /*    return `
      // import OvsAPI from "@/ovs/OvsAPI.ts";\n
      ${code1.code}
      `*/
}

// const code = `let a = 'di
const code = `div {123}
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

console.log(res)

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
