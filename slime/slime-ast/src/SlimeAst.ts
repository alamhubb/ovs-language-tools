import {
  type SlimeArrayExpression,
  type SlimeBaseNode,
  type SlimeBlockStatement,
  type SlimeBooleanLiteral,
  type SlimeCallExpression,
  type SlimeEqualOperator,
  type SlimeFunctionExpression,
  type SlimeMemberExpression,
  type SlimeMethodDefinition,
  type SlimeObjectExpression,
  type SlimePrivateIdentifier,
  SlimeProgramSourceType,
  type SlimeProperty,
  type SlimeRestElement,
  type SlimeReturnStatement,
  type SlimeSimpleCallExpression,
  type SlimeSpreadElement,
  type SlimeSuper,
  SlimeVariableDeclarationKind,
  type SlimeDirective,
  type SlimeExpression,
  type SlimeIdentifier,
  type SlimeLiteral,
  type SlimeModuleDeclaration,
  type SlimeNumericLiteral,
  type SlimePattern,
  type SlimeProgram,
  type SlimeStatement,
  type SlimeStringLiteral,
  type SlimeVariableDeclaration,
  type SlimeVariableDeclarator,
  type SlimeDotOperator, type SlimeNullLiteral,
} from "./SlimeAstInterface.ts";

import {SlimeAstType} from "./SlimeAstType.ts";
import type {SubhutiSourceLocation} from "subhuti/src/struct/SubhutiCst.ts";

class SlimeAst {
  createProgram(body: Array<SlimeDirective | SlimeStatement | SlimeModuleDeclaration>, sourceType: SlimeProgramSourceType = SlimeProgramSourceType.script): SlimeProgram {
    return this.commonLocType({
      type: SlimeAstType.Program,
      sourceType: sourceType,
      body: body
    })
  }

  createDotOperator(loc?: SubhutiSourceLocation): SlimeDotOperator {
    return this.commonLocType({
      type: SlimeAstType.Dot,
      value: '.',
      loc: loc
    })
  }

  commonLocType<T extends SlimeBaseNode>(node: T): T {
    console.log(node)
    // if (node.loc) {
    //   node.loc.type = node.type
    // }
    return node
  }

  createMemberExpression(object: SlimeExpression | SlimeSuper, dot: SlimeDotOperator, property?: SlimeExpression | SlimePrivateIdentifier): SlimeMemberExpression {
    return this.commonLocType({
      type: SlimeAstType.MemberExpression,
      object: object,
      dot: dot,
      property: property,
      computed: false,
      optional: false,
      loc: object.loc
    })
  }

  createArrayExpression(elements?: Array<SlimeExpression | SlimeSpreadElement | null>): SlimeArrayExpression {
    return this.commonLocType({
      type: SlimeAstType.ArrayExpression,
      elements: elements,
    })
  }


  createPropertyAst(key: SlimeExpression | SlimePrivateIdentifier, value: SlimeExpression | SlimePattern): SlimeProperty {
    return this.commonLocType({
      type: SlimeAstType.Property,
      key: key,
      value: value,
      kind: "init",
      method: false,
      shorthand: false,
      computed: false,
    })
  }

  createObjectExpression(properties: Array<SlimeProperty> = []): SlimeObjectExpression {
    return this.commonLocType({
      type: SlimeAstType.ObjectExpression,
      properties: properties
    })
  }

  createCallExpression(callee: SlimeExpression | SlimeSuper, args: Array<SlimeExpression | SlimeSpreadElement>): SlimeSimpleCallExpression {
    return this.commonLocType({
      type: SlimeAstType.CallExpression,
      callee: callee,
      arguments: args,
      optional: false,
      loc: callee.loc
    })
  }

  createReturnStatement(argument?: SlimeExpression | null): SlimeReturnStatement {
    return this.commonLocType({
      type: SlimeAstType.ReturnStatement,
      argument: argument
    })
  }

  createBlockStatement(body: Array<SlimeStatement>, loc?: SubhutiSourceLocation): SlimeBlockStatement {

    return this.commonLocType({
      type: SlimeAstType.BlockStatement,
      body: body,
      loc: loc
    })
  }

  createFunctionExpression(body: SlimeBlockStatement, id?: SlimeIdentifier | null, params?: SlimePattern[], loc?: SubhutiSourceLocation): SlimeFunctionExpression {
    loc.type = SlimeAstType.FunctionExpression
    return this.commonLocType({
      type: SlimeAstType.FunctionExpression,
      params: params,
      id: id,
      body: body,
      loc: loc
    })
  }

  createVariableDeclaration(kind: SlimeVariableDeclarationKind, declarations: SlimeVariableDeclarator[]): SlimeVariableDeclaration {
    return this.commonLocType({
      type: SlimeAstType.VariableDeclaration,
      declarations: declarations,
      kind: kind
    })
  }

  createRestElement(argument: SlimePattern): SlimeRestElement {
    return this.commonLocType({
      type: SlimeAstType.RestElement,
      argument: argument
    })
  }

  createSpreadElement(argument: SlimeExpression): SlimeSpreadElement {
    return this.commonLocType({
      type: SlimeAstType.SpreadElement,
      argument: argument
    })
  }

  createEqualOperator(loc?: SubhutiSourceLocation): SlimeEqualOperator {
    return this.commonLocType({
      type: SlimeAstType.EqualOperator,
      value: '=',
      loc: loc
    })
  }

  createVariableDeclarator(id: SlimePattern, operator?: SlimeEqualOperator, init?: SlimeExpression): SlimeVariableDeclarator {
    return this.commonLocType({
      type: SlimeAstType.VariableDeclarator,
      id: id,
      equal: operator,
      init: init,
    })
  }

  createIdentifier(name: string, loc?: SubhutiSourceLocation): SlimeIdentifier {
    return this.commonLocType({
      type: SlimeAstType.Identifier,
      name: name,
      loc: loc
    })
  }

  createLiteral(value?: number | string): SlimeLiteral {
    let ast: SlimeLiteral
    if (value === undefined) {
      // ast = this.createNullLiteralToken()
    } else if (typeof value === "string") {
      ast = this.createStringLiteral(value)
    } else if (typeof value === "number") {
      ast = this.createNumericLiteral(value)
    }
    return ast
  }


  createNullLiteralToken(): SlimeNullLiteral {
    return this.commonLocType({
      type: SlimeAstType.NullLiteral,
      value: null
    })
  }


  createStringLiteral(value: string): SlimeStringLiteral {
    return this.commonLocType({
      type: SlimeAstType.StringLiteral,
      value: value.replace(/^['"]|['"]$/g, '')
    })
  }

  createNumericLiteral(value: number): SlimeNumericLiteral {
    return this.commonLocType({
      type: SlimeAstType.NumericLiteral,
      value: value
    })
  }

  createBooleanLiteral(value: boolean): SlimeBooleanLiteral {
    return this.commonLocType({
      type: SlimeAstType.BooleanLiteral,
      value: value
    })
  }

  createMethodDefinition(key: SlimeExpression | SlimePrivateIdentifier, value: SlimeFunctionExpression): SlimeMethodDefinition {
    return this.commonLocType({
      type: SlimeAstType.MethodDefinition,
      key: key,
      value: value,
      kind: "method",
      computed: false,
      static: false,
    })
  }
}

const SlimeAstUtil = new SlimeAst()
export default SlimeAstUtil
