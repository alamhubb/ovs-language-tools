import {
  SlimeBaseNode, SlimeCaretEqualsToken, type SlimeExpression, SlimeIdentifier,
  type SlimeModuleDeclaration, SlimeNumberLiteral, type SlimePattern,
  SlimeProgram,
  SlimeProgramSourceType,
  type SlimeStatement, SlimeVariableDeclaration, type SlimeVariableDeclarator
} from "slime-ast/src/SlimeAstInterface";
import {SlimeAstType} from "slime-ast/src/SlimeAstType";
import SlimeCodeMapping, {SlimeCodeLocation} from "./SlimeCodeMapping";
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
  static lastSourcePosition: SlimeCodeLocation = null
  static generatePosition: SlimeCodeLocation = null
  static sourceCodeIndex: number = null
  private static generateCode = ''
  private static generateLine = 0
  private static generateColumn = 0

  static generator(node: SlimeBaseNode) {
    this.mappings = []
    this.lastSourcePosition = new SlimeCodeLocation()
    this.generatePosition = new SlimeCodeLocation()
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

  static get lastMapping() {
    if (this.mappings.length) {
      return this.mappings[this.mappings.length - 1]
    }
    return null
  }


  private static generatorVariableDeclarator(node: SlimeVariableDeclarator) {
    checkAstName(SlimeAstType.VariableDeclarator, node)
    this.generatorPattern(node.id)
    if (node.init) {
      if (node.init.type === SlimeAstType.CaretEqualsToken) {
        this.addCodeAndMappings('=', node.init.loc)
      } else {
        //+空格和自己的位置
        let preEqColumn = this.lastMapping.source.column + this.lastMapping.source.length
        let spaceNum = 5
        while (spaceNum > -1) {
          const eqColumn = preEqColumn + spaceNum
          if (eqColumn < node.init.loc.start.column) {
            this.addCodeAndMappingsBySourcePosition('=', {
              line: node.init.loc.start.line,
              //减去一个才是起始位置
              column: eqColumn,
              length: 1,
            })
            break
          }
          spaceNum--
          console.log(eqColumn)
          console.log(node.init.loc.start.column)
        }
        this.generatorExpression(node.init)
      }
    }
  }

  private static generatorExpression(node: SlimeExpression) {
    if (node.type === SlimeAstType.NumberLiteral) {
      this.generatorNumberLiteral(node)
    }
  }

  private static generatorNumberLiteral(node: SlimeNumberLiteral) {
    checkAstName(SlimeAstType.NumberLiteral, node)
    this.addCodeAndMappings(node.value.toString(), node.loc)
  }


  private static generatorCaretEqualsToken(node: SlimeCaretEqualsToken) {
    checkAstName(SlimeAstType.CaretEqualsToken, node)

  }

  static cstLocationToSlimeLocation(cstLocation: SubhutiSourceLocation, sourceLength?: number) {
    const sourcePosition: SlimeCodeLocation = {
      line: cstLocation.start.line,
      column: cstLocation.start.column,
      length: sourceLength || cstLocation.end.column - cstLocation.start.column
    }
    return sourcePosition
  }

  private static addCodeAndMappingsBySourcePosition(code: string, sourcePosition: SlimeCodeLocation) {
    this.addMappings(sourcePosition, code.length)
    this.addCode(code)
    this.addCodeSpacing()
  }

  private static addCodeAndMappings(code: string, cstLocation: SubhutiSourceLocation, sourceLength: number = code.length) {
    this.addCodeAndMappingsBySourcePosition(code, this.cstLocationToSlimeLocation(cstLocation, sourceLength))
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


  private static addMappings(sourcePosition: SlimeCodeLocation, generateLength: number) {
    let generate: SlimeCodeLocation = {
      line: this.generateLine,
      column: this.generateColumn,
      length: generateLength,
    }
    this.mappings.push({
      source: sourcePosition,
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
