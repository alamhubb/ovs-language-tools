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
  SlimeVariableDeclarationKind
} from "./SlimeAstInterface.ts";
import {
  type SlimeCaretEqualsToken,
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
  type SlimeVariableDeclarator
} from "./SlimeAstInterface.ts";

import {SlimeAstType} from "./SlimeAstType.ts";
import type {SubhutiSourceLocation} from "subhuti/src/struct/SubhutiCst.ts";

class SlimeAst {
  createProgram(body: Array<SlimeDirective | SlimeStatement | SlimeModuleDeclaration>, sourceType: SlimeProgramSourceType = SlimeProgramSourceType.script): SlimeProgram {
    return {
      type: SlimeAstType.Program,
      sourceType: sourceType,
      body: body
    }
  }

  createMemberExpression(object: SlimeExpression | SlimeSuper, property?: SlimeExpression | SlimePrivateIdentifier): SlimeMemberExpression {
    return {
      type: SlimeAstType.MemberExpression,
      object: object,
      property: property,
      computed: false,
      optional: false,
      loc: object.loc
    }
  }

  createArrayExpression(elements?: Array<SlimeExpression | SlimeSpreadElement | null>): SlimeArrayExpression {
    return {
      type: SlimeAstType.ArrayExpression,
      elements: elements,
    }
  }


  createPropertyAst(key: SlimeExpression | SlimePrivateIdentifier, value: SlimeExpression | SlimePattern): SlimeProperty {
    return {
      type: SlimeAstType.Property,
      key: key,
      value: value,
      kind: "init",
      method: false,
      shorthand: false,
      computed: false,
    }
  }

  createObjectExpression(properties: Array<SlimeProperty> = []): SlimeObjectExpression {
    return {
      type: SlimeAstType.ObjectExpression,
      properties: properties
    }
  }

  createCallExpression(callee: SlimeExpression | SlimeSuper, args: Array<SlimeExpression | SlimeSpreadElement>): SlimeSimpleCallExpression {
    return {
      type: SlimeAstType.CallExpression,
      callee: callee,
      arguments: args,
      optional: false,
      loc: callee.loc
    }
  }

  createReturnStatement(argument?: SlimeExpression | null): SlimeReturnStatement {
    return {
      type: SlimeAstType.ReturnStatement,
      argument: argument
    }
  }

  createBlockStatement(body: Array<SlimeStatement>, loc?: SubhutiSourceLocation): SlimeBlockStatement {

    return {
      type: SlimeAstType.BlockStatement,
      body: body,
      loc: loc
    }
  }

  createFunctionExpression(body: SlimeBlockStatement, id?: SlimeIdentifier | null, params?: SlimePattern[], loc?: SubhutiSourceLocation): SlimeFunctionExpression {
    return {
      type: SlimeAstType.FunctionExpression,
      params: params,
      id: id,
      body: body,
      loc: loc
    }
  }

  createVariableDeclaration(kind: SlimeVariableDeclarationKind, declarations: SlimeVariableDeclarator[]): SlimeVariableDeclaration {
    return {
      type: SlimeAstType.VariableDeclaration,
      declarations: declarations,
      kind: kind
    }
  }

  createRestElement(argument: SlimePattern): SlimeRestElement {
    return {
      type: SlimeAstType.RestElement,
      argument: argument
    }
  }

  createSpreadElement(argument: SlimeExpression): SlimeSpreadElement {
    return {
      type: SlimeAstType.SpreadElement,
      argument: argument
    }
  }

  createEqualOperator(loc?: SubhutiSourceLocation): SlimeEqualOperator {
    return {
      type: SlimeAstType.EqualOperator,
      value: '=',
      loc: loc
    }
  }

  createVariableDeclarator(id: SlimePattern, operator?: SlimeEqualOperator, init?: SlimeExpression): SlimeVariableDeclarator {
    return {
      type: SlimeAstType.VariableDeclarator,
      id: id,
      equal: operator,
      init: init,
    }
  }

  createIdentifier(name: string, loc?: SubhutiSourceLocation): SlimeIdentifier {
    return {
      type: SlimeAstType.Identifier,
      name: name,
      loc: loc
    }
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


  createNullLiteralToken(): SlimeCaretEqualsToken {
    return {
      type: SlimeAstType.NullLiteral
    }
  }


  createStringLiteral(value: string): SlimeStringLiteral {
    return {
      type: SlimeAstType.StringLiteral,
      value: value.replace(/^['"]|['"]$/g, '')
    }
  }

  createNumericLiteral(value: number): SlimeNumericLiteral {
    return {
      type: SlimeAstType.NumericLiteral,
      value: value
    }
  }

  createBooleanLiteral(value: boolean): SlimeBooleanLiteral {
    return {
      type: SlimeAstType.BooleanLiteral,
      value: value
    }
  }

  createMethodDefinition(key: SlimeExpression | SlimePrivateIdentifier, value: SlimeFunctionExpression): SlimeMethodDefinition {
    return {
      type: SlimeAstType.MethodDefinition,
      key: key,
      value: value,
      kind: "method",
      computed: false,
      static: false,
    }
  }
}

const SlimeAstUtil = new SlimeAst()
export default SlimeAstUtil
