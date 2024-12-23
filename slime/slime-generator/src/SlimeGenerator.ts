import {
  type SlimeArrayExpression,
  type SlimeArrayPattern,
  type SlimeAssignmentPattern,
  type SlimeBaseNode,
  type SlimeBlockStatement,
  type SlimeCallExpression,
  type SlimeClassDeclaration,
  type SlimeDeclaration,
  type SlimeExportNamedDeclaration,
  type SlimeExpression,
  type SlimeExpressionStatement,
  type SlimeFunctionDeclaration,
  type SlimeFunctionExpression, type SlimeFunctionParams,
  type SlimeIdentifier,
  type SlimeMemberExpression,
  type SlimeModuleDeclaration,
  type SlimeNumericLiteral,
  type SlimeObjectExpression,
  type SlimeObjectPattern,
  type SlimePattern,
  type SlimePrivateIdentifier,
  type SlimeProgram,
  SlimeProgramSourceType,
  type SlimeProperty,
  type SlimeRestElement,
  type SlimeReturnStatement,
  type SlimeStatement,
  type SlimeStringLiteral,
  type SlimeVariableDeclaration,
  type SlimeVariableDeclarator
} from "slime-ast/src/SlimeAstInterface.ts";
import {SlimeAstType} from "slime-ast/src/SlimeAstType.ts";
import SlimeCodeMapping, {SlimeCodeLocation, type SlimeGeneratorResult} from "./SlimeCodeMapping.ts";
import type {SubhutiSourceLocation} from "subhuti/src/struct/SubhutiCst.ts";
import {es6TokenMapObj, Es6TokenName, es6TokensObj} from "slime-parser/src/language/es2015/Es6Tokens.ts";
import {es5TokensObj} from "slime-parser/src/language/es5/Es5Tokens.ts";
import {SubhutiCreateToken} from "subhuti/src/struct/SubhutiCreateToken.ts";

export default class SlimeGenerator {
  static mappings: SlimeCodeMapping[] = null
  static lastSourcePosition: SlimeCodeLocation = null
  static generatePosition: SlimeCodeLocation = null
  static sourceCodeIndex: number = null
  private static generateCode = ''
  private static generateLine = 0
  private static generateColumn = 0
  private static generateIndex = 0

  static generator(node: SlimeBaseNode): SlimeGeneratorResult {
    this.mappings = []
    this.lastSourcePosition = new SlimeCodeLocation()
    this.generatePosition = new SlimeCodeLocation()
    this.sourceCodeIndex = 0
    this.generateLine = 0
    this.generateColumn = 0
    this.generateIndex = 0
    this.generateCode = ''
    this.generatorSlimeAst(node)
    return {
      mapping: this.mappings,
      code: this.generateCode
    }
  }

  private static generatorSlimeAst(node: SlimeBaseNode) {
    if (node.type === SlimeAstType.Program) {
      return this.generatorProgram(node as SlimeProgram)
    }
  }

  private static generatorProgram(node: SlimeProgram) {
    if (node.sourceType === SlimeProgramSourceType.script) {
      const body = node.body as SlimeStatement []
      this.generatorStatements(body)
    } else if (node.sourceType === SlimeProgramSourceType.module) {
      const body = node.body as SlimeStatement []
      this.generatorModuleDeclarations(body)
    } else {
      throw new Error('未知的')
      // const body = node.body as SlimeModuleDeclaration []
      // return this.generatorModuleDeclaration(body)
    }
  }

  private static generatorModuleDeclarations(node: Array<SlimeStatement | SlimeModuleDeclaration>) {
    for (const nodeElement of node) {
      this.generatorModuleDeclaration(nodeElement)
    }
  }


  private static generatorModuleDeclaration(node: SlimeStatement | SlimeModuleDeclaration) {
    if (node.type === SlimeAstType.ExportNamedDeclaration) {
      this.generatorExportNamedDeclaration(node as SlimeExportNamedDeclaration)
    } else if (node.type === SlimeAstType.ExportDefaultDeclaration) {

    } else {
      this.generatorStatement(node as SlimeStatement)
    }
  }

  private static generatorExportNamedDeclaration(node: SlimeExportNamedDeclaration) {
    this.addCode(es6TokensObj.ExportTok)
    this.addCode(es6TokensObj.ExportTok)
    this.generatorDeclaration(node.declaration)
  }

  private static generatorFunctionDeclaration(node: SlimeFunctionDeclaration) {

  }

  private static generatorClassDeclaration(node: SlimeClassDeclaration) {

  }

  private static generatorDeclaration(node: SlimeDeclaration) {
    if (node.type === SlimeAstType.FunctionDeclaration) {
      this.generatorFunctionDeclaration(node as SlimeFunctionDeclaration)
    } else if (node.type === SlimeAstType.VariableDeclaration) {
      this.generatorVariableDeclaration(node as SlimeVariableDeclaration)
    } else if (node.type === SlimeAstType.ClassDeclaration) {
      this.generatorClassDeclaration(node as SlimeClassDeclaration)
    } else {
      throw new Error('不支持的类型')
    }
    this.addSemicolon()
    this.addNewLine()
  }


  private static generatorStatements(nodes: SlimeStatement[]) {
    console.log(nodes)
    nodes.forEach((node, index) => {
      // if (this.generateLine !== 0 || index !== 0) {
      //     this.addNewLine()
      // }
      this.generatorStatement(node)
    })
  }


  private static generatorStatement(node: SlimeStatement) {
    if (node.type === SlimeAstType.VariableDeclaration) {
      this.generatorVariableDeclaration(node as SlimeVariableDeclaration)
    } else if (node.type === SlimeAstType.ExpressionStatement) {
      this.generatorExpressionStatement(node as SlimeExpressionStatement)
    } else if (node.type === SlimeAstType.ReturnStatement) {
      this.generatorReturnStatement(node as SlimeReturnStatement)
    } else if (node.type === SlimeAstType.BlockStatement) {
      this.generatorBlockStatement(node as SlimeBlockStatement)
    } else {
      throw new Error('不支持的类型：' + node.type)
    }
    this.addSemicolon()
    this.addNewLine()
  }

  private static generatorExpressionStatement(node: SlimeExpressionStatement) {
    this.generatorExpression(node.expression)
  }

  private static generatorCallExpression(node: SlimeCallExpression) {
    if (node.callee.type === SlimeAstType.FunctionExpression) {
      this.addCode(es6TokensObj.LParen)
    }
    this.generatorExpression(node.callee as SlimeExpression)
    if (node.callee.type === SlimeAstType.FunctionExpression) {
      this.addCode(es6TokensObj.RParen)
    }
    this.addCodeAndMappings(es6TokensObj.LParen, node.callee.loc)
    node.arguments.forEach((argument, index) => {
      if (index !== 0) {
        this.addCode(es6TokensObj.Comma)
      }
      this.generatorExpression(argument as SlimeExpression)
    })
    this.addCodeAndMappings(es6TokensObj.RParen, node.callee.loc)
  }

  private static generatorFunctionExpression(node: SlimeFunctionExpression) {
    console.log(node)
    this.addCodeAndMappings(es6TokensObj.FunctionTok, node.loc)
    if (node.id) {
      this.addSpacing()
      this.generatorIdentifier(node.id)
    }
    this.generatorFunctionParams(node.params)
    this.generatorBlockStatement(node.body)
  }

  private static generatorFunctionParams(node: SlimeFunctionParams) {
    this.addCodeAndMappings(es6TokensObj.LParen, node.lParen.loc)
    if (node.params) {
      node.params.forEach((param, index) => {
        if (index !== 0) {
          this.addCode(es6TokensObj.Comma)
        }
        this.generatorIdentifier(param as SlimeIdentifier)
      })
    }
    this.addCodeAndMappings(es6TokensObj.RParen, node.rParen.loc)
  }

  private static generatorArrayExpression(node: SlimeArrayExpression) {
    for (const element of node.elements) {
      this.generatorExpression(element as SlimeExpression)
    }
  }

  private static generatorObjectExpression(node: SlimeObjectExpression) {
    this.addCode(es6TokensObj.LBrace)
    this.addNewLine()
    for (const element of node.properties) {
      this.generatorProperty(element as SlimeProperty)
    }
    this.addNewLine()
    this.addCode(es6TokensObj.RBrace)
  }

  private static generatorPrivateIdentifier(node: SlimePrivateIdentifier) {
    this.addCode({name: Es6TokenName.Identifier, value: node.name})
  }

  private static generatorProperty(node: SlimeProperty) {
    if (node.key.type === SlimeAstType.PrivateIdentifier) {
      this.generatorPrivateIdentifier(node.key)
    } else {
      this.generatorExpression(node.key as SlimeExpression)
    }
    this.addCode(es6TokensObj.Colon)
    const type = node.value.type as SlimeAstType
    if (this.patternTypes.includes(type)) {
      this.generatorPattern(node.value as SlimePattern)
    } else {
      this.generatorExpression(node.value as SlimeExpression)
    }
    this.addCode(es6TokensObj.Comma)
    this.addNewLine()
  }


  private static patternTypes = [
    SlimeAstType.Identifier,
    SlimeAstType.ObjectPattern,
    SlimeAstType.ArrayPattern,
    SlimeAstType.RestElement,
    SlimeAstType.AssignmentPattern,
    SlimeAstType.MemberExpression,
  ]


  private static generatorPattern(node: SlimePattern) {
    if (node.type === SlimeAstType.Identifier) {
      this.generatorIdentifier(node as SlimeIdentifier)

    } else if (node.type === SlimeAstType.ObjectPattern) {
      this.generatorObjectPattern(node as SlimeObjectPattern)

    } else if (node.type === SlimeAstType.ArrayPattern) {
      this.generatorArrayPattern(node as SlimeArrayPattern)

    } else if (node.type === SlimeAstType.RestElement) {
      this.generatorRestElement(node as SlimeRestElement)

    } else if (node.type === SlimeAstType.AssignmentPattern) {
      this.generatorAssignmentPattern(node as SlimeAssignmentPattern)

    } else if (node.type === SlimeAstType.MemberExpression) {
      this.generatorMemberExpression(node as SlimeMemberExpression)

    } else {
      throw new Error('不支持的类型：')
    }
  }


  private static generatorIdentifier(node: SlimeIdentifier) {
    const identifier = {name: Es6TokenName.Identifier, value: node.name}
    this.addCodeAndMappings(identifier, node.loc)
  }

  private static generatorObjectPattern(node: SlimeObjectPattern) {
    for (const property of node.properties) {
      if (property.type === SlimeAstType.Property) {
        this.generatorProperty(property)
      } else if (property.type === SlimeAstType.RestElement) {
        this.generatorRestElement(property)
      } else {
        throw new Error('不支持的类型：')
      }
    }
  }

  private static generatorArrayPattern(node: SlimeArrayPattern) {
    for (const element of node.elements) {
      this.generatorPattern(element)
    }
  }

  private static generatorRestElement(node: SlimeRestElement) {
    this.generatorPattern(node.argument)
  }

  private static generatorAssignmentPattern(node: SlimeAssignmentPattern) {
    this.generatorPattern(node.left)
    this.generatorExpression(node.right)
  }

  private static generatorBlockStatement(node: SlimeBlockStatement) {
    this.addCode(es6TokensObj.LBrace)
    this.addNewLine()
    this.generatorStatements(node.body)
    this.addCode(es6TokensObj.RBrace)
  }

  private static generatorReturnStatement(node: SlimeReturnStatement) {
    this.addCode(es6TokensObj.ReturnTok)
    this.addSpacing()
    this.generatorExpression(node.argument)
  }

  private static addSpacing() {
    this.addCode(es6TokensObj.Spacing)
  }

  private static generatorMemberExpression(node: SlimeMemberExpression) {
    this.generatorExpression(node.object as SlimeExpression)
    if (node.dot) {
      this.addCodeAndMappings(es6TokensObj.Dot, node.dot.loc)
    }
    if (node.property) {
      if (node.property.type === SlimeAstType.PrivateIdentifier) {
        this.generatorPrivateIdentifier(node.property)
      } else {
        this.generatorExpression(node.property)
      }
    }
  }

  private static generatorVariableDeclaration(node: SlimeVariableDeclaration) {
    this.addCodeAndMappings(es6TokenMapObj[node.kind.valueOf()], node.loc)
    this.addCodeSpacing()
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
    this.generatorPattern(node.id)
    this.addCodeSpacing()
    if (node.equal) {
      this.addCodeAndMappings(es6TokensObj.Eq, node.equal.loc)
      this.addCodeSpacing()
    }
    if (node.init) {
      this.generatorExpression(node.init)
    }
  }

  private static generatorExpression(node: SlimeExpression) {
    if (node.type === SlimeAstType.Identifier) {
      this.generatorIdentifier(node as SlimeIdentifier)
    } else if (node.type === SlimeAstType.NumericLiteral) {
      this.generatorNumberLiteral(node as SlimeNumericLiteral)
    } else if (node.type === SlimeAstType.MemberExpression) {
      this.generatorMemberExpression(node as SlimeMemberExpression)
    } else if (node.type === SlimeAstType.CallExpression) {
      this.generatorCallExpression(node as SlimeCallExpression)
    } else if (node.type === SlimeAstType.FunctionExpression) {
      this.generatorFunctionExpression(node as SlimeFunctionExpression)
    } else if (node.type === SlimeAstType.StringLiteral) {
      this.generatorStringLiteral(node as SlimeStringLiteral)
    } else if (node.type === SlimeAstType.ArrayExpression) {
      this.generatorArrayExpression(node as SlimeArrayExpression)
    } else if (node.type === SlimeAstType.ObjectExpression) {
      this.generatorObjectExpression(node)
    } else {
      throw new Error('不支持的类型：' + node.type)
    }
  }

  private static generatorNumberLiteral(node: SlimeNumericLiteral) {
    this.addCodeAndMappings({name: Es6TokenName.NumericLiteral, value: String(node.value)}, node.loc)
  }

  private static generatorStringLiteral(node: SlimeStringLiteral) {
    this.addCodeAndMappings({name: Es6TokenName.StringLiteral, value: node.value}, node.loc)
  }

  static cstLocationToSlimeLocation(cstLocation: SubhutiSourceLocation, sourceLength: number) {
    console.log( cstLocation)
    const sourcePosition: SlimeCodeLocation = {
      type: cstLocation.type,
      index: cstLocation.start.index,
      value: cstLocation.value,
      // length: sourceLength,
      length: cstLocation.end.index - cstLocation.start.index,
      line: cstLocation.start.line,
      column: cstLocation.start.column,
    }
    return sourcePosition
  }

  private static addCodeAndMappingsBySourcePosition(code: SubhutiCreateToken, sourcePosition: SlimeCodeLocation) {
    this.addMappings(sourcePosition, code)
    this.addCode(code)
  }

  private static addCodeAndMappings(code: SubhutiCreateToken, cstLocation: SubhutiSourceLocation) {
    const sourceLength: number = code.value.length
    this.addCodeAndMappingsBySourcePosition(code, this.cstLocationToSlimeLocation(cstLocation, sourceLength))
  }

  private static addCode(code: SubhutiCreateToken) {
    this.generateCode += code.value
    this.generateColumn += code.value.length
    this.generateIndex += code.value.length
  }

  private static addSemicolon() {
    // this.generateCode += ';'
    // this.generateIndex += 1
  }

  private static addNewLine() {
    this.generateCode += '\n'
    this.generateLine++
    this.generateColumn = 0
    this.generateIndex += 1
  }

  private static addCodeSpacing() {
    this.generateCode += ' '
    this.generateColumn++
    this.generateIndex++
  }


  private static addMappings(sourcePosition: SlimeCodeLocation, generateCode: SubhutiCreateToken) {
    let generate: SlimeCodeLocation = {
      index: this.generateIndex,
      type: generateCode.name,
      value: generateCode.value,
      length: generateCode.value.length,
      line: this.generateLine,
      column: this.generateColumn,
    }
    this.mappings.push({
      source: sourcePosition,
      generate: generate
    })
  }

  /*private static generatorModuleDeclaration(node: SlimeModuleDeclaration[]) {
      node.
  }*/
}
