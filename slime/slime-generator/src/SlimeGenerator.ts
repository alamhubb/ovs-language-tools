import {
  SlimeBaseNode, SlimeCaretEqualsToken, type SlimeExpression, SlimeIdentifier,
  type SlimeModuleDeclaration, type SlimePattern,
  SlimeProgram,
  SlimeProgramSourceType,
  type SlimeStatement, SlimeVariableDeclaration, type SlimeVariableDeclarator
} from "slime-ast/src/SlimeAstInterface";
import {SlimeAstType} from "slime-ast/src/SlimeAstType";
import SlimeCodeMapping, {SlimeCodePosition} from "./SlimeCodeMapping";
import JsonUtil from "subhuti/src/utils/JsonUtil";
import type {SubhutiSourceLocation} from "subhuti/src/struct/SubhutiCst";

export function checkAstName(astName: string, cst: SlimeBaseNode) {
  if (cst.type !== astName) {
    console.log(cst)
    throw new Error('syntax error' + cst.type)
  }
}

export default class SlimeGenerator {
  static mappings: SlimeCodeMapping[] = null
  static lastSourcePosition: SlimeCodePosition = null
  static generatePosition: SlimeCodePosition = null
  static sourceCodeIndex: number = null
  private static generateCode = ''
  private static generateLine = 0
  private static generateColumn = 0

  static generator(node: SlimeBaseNode) {
    this.mappings = []
    this.lastSourcePosition = new SlimeCodePosition()
    this.generatePosition = new SlimeCodePosition()
    this.sourceCodeIndex = 0
    this.generateLine = 0
    this.generateColumn = 0
    this.generatorSlimeAst(node)
    return {
      mappings: this.mappings,
      code: this.generateCode
    }
  }

  private static generatorSlimeAst(node: SlimeBaseNode) {
    if (node.type === SlimeAstType.Program) {
      return this.generatorProgram(node as SlimeProgram)
    }
  }

  private static generatorProgram(node: SlimeProgram) {
    checkAstName(SlimeAstType.Program, node)
    if (node.sourceType === SlimeProgramSourceType.script) {
      const body = node.body as SlimeStatement []
      return this.generatorStatements(body)
    } else {
      // const body = node.body as SlimeModuleDeclaration []
      // return this.generatorModuleDeclaration(body)
    }
  }

  private static generatorStatements(nodes: SlimeStatement[]) {
    for (const node of nodes) {
      this.generatorStatement(node)
    }
  }


  private static generatorStatement(node: SlimeStatement) {
    if (node.type === SlimeAstType.VariableDeclaration) {
      this.generatorVariableDeclaration(node as SlimeVariableDeclaration)
    }
  }

  private static generatorVariableDeclaration(node: SlimeVariableDeclaration) {
    checkAstName(SlimeAstType.VariableDeclaration, node)

    this.addCodeAndMappings(node.kind.toString(), node.loc)

    for (const declaration of node.declarations) {
      this.generatorVariableDeclarator(declaration)
    }
  }


  private static generatorVariableDeclarator(node: SlimeVariableDeclarator) {
    checkAstName(SlimeAstType.VariableDeclarator, node)
    this.generatorPattern(node.id)
    if (node.init) {
      this.generatorExpression(node.init)
    }
  }

  private static generatorExpression(node: SlimeExpression) {
    if (node.type === SlimeAstType.CaretEqualsToken) {
      this.generatorCaretEqualsToken(node)
    }
  }

  private static generatorCaretEqualsToken(node: SlimeCaretEqualsToken) {
    checkAstName(SlimeAstType.CaretEqualsToken, node)
    JsonUtil.log(node)
    this.addCodeAndMappings('=', node.loc)
  }


  private static addCodeAndMappings(code: string, sourcePosition: SubhutiSourceLocation, sourceLength: number = code.length) {
    this.addMappings(sourcePosition, sourceLength, code.length)
    this.addCode(code)
    this.addCodeSpacing()
  }

  private static addCode(code: string) {
    this.generateCode += code
    this.generateColumn += code.length
  }

  private static codeNewLine() {
    this.generateLine++
    this.generateColumn = 0
  }

  private static addCodeSpacing() {
    this.generateCode += ' '
    this.generateColumn++
  }


  private static addMappings(sourcePosition: SubhutiSourceLocation, sourceLength: number, generateLength: number) {
    let source: SlimeCodePosition = {
      line: sourcePosition.start.line,
      column: sourcePosition.start.column,
      length: sourceLength,
    }
    let generate: SlimeCodePosition = {
      line: this.generateLine,
      column: this.generateColumn,
      length: generateLength,
    }
    this.mappings.push({
      source: source,
      generate: generate
    })
  }

  private static generatorPattern(node: SlimePattern) {
    if (node.type === SlimeAstType.Identifier) {
      this.generatorIdentifier(node)
    }
  }

  private static generatorIdentifier(node: SlimeIdentifier) {
    checkAstName(SlimeAstType.Identifier, node)
    this.addCodeAndMappings(node.name, node.loc)
  }

  /*private static generatorModuleDeclaration(node: SlimeModuleDeclaration[]) {
      node.
  }*/
}
