// Vite 插件
import {createFilter, type Plugin} from "vite"
import SubhutiLexer from 'subhuti/src/parser/SubhutiLexer.ts'
import SubhutiCst from "subhuti/src/struct/SubhutiCst.ts";
import SlimeGenerator from "slime-generator/src/SlimeGenerator.ts";
import {es6Tokens} from "slime-parser/src/language/es2015/Es6Tokens.ts";
import OvsParser from "./parser/OvsParser.ts";
import OvsCstToSlimeAstUtil from "./factory/OvsCstToSlimeAstUtil.ts";
import JsonUtil from "subhuti/src/utils/JsonUtil.ts";
import type {SlimeGeneratorResult} from "slime-generator/src/SlimeCodeMapping.ts";
import Es6Parser from "slime-parser/src/language/es2015/Es6Parser.ts";
import SlimeCstToAstUtil, {SlimeCstToAst} from "slime-parser/src/language/SlimeCstToAstUtil.ts";


export function traverseClearTokens(currentNode: SubhutiCst) {
  if (!currentNode || !currentNode.children || !currentNode.children.length)
    return currentNode
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
  const ast = OvsCstToSlimeAstUtil.toProgram(curCst)
  const result = SlimeGenerator.generator(ast, tokens)
  return result
}

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
      const res = vitePluginOvsTransform(code)

      const resCode = `${res.code}`
      // const resCode = `import OvsAPI from 'ovsjs/src/OvsAPI'\n${res.code}`

      console.log(resCode)
      return resCode
    }
  }
}
