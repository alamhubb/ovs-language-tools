import {
    type SlimeArrayExpression,
    type SlimeBaseNode, type SlimeBlockStatement,
    type SlimeBooleanLiteral,
    type SlimeCallExpression,
    type SlimeEqualOperator, type SlimeFunctionExpression,
    type SlimeMemberExpression,
    type SlimePrivateIdentifier,
    SlimeProgramSourceType, type SlimeReturnStatement, type SlimeSimpleCallExpression,
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
    type SlimeNumberLiteral,
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

    createMemberExpression(object: SlimeExpression | SlimeSuper, property: SlimeExpression | SlimeIdentifier): SlimeMemberExpression {
        return {
            type: SlimeAstType.MemberExpression,
            object: object,
            property: property,
            computed: false,
            optional: false,
        }
    }

    createArrayExpression(elements?: Array<SlimeExpression | SlimeSpreadElement | null>): SlimeArrayExpression {
        return {
            type: SlimeAstType.ArrayExpression,
            elements: elements,
        }
    }

    createCallExpression(callee: SlimeExpression | SlimeSuper, args: Array<SlimeExpression | SlimeSpreadElement>): SlimeSimpleCallExpression {
        return {
            type: SlimeAstType.CallExpression,
            callee: callee,
            arguments: args,
            optional: false
        }
    }

    createReturnStatement(argument?: SlimeExpression | null): SlimeReturnStatement {
        return {
            type: SlimeAstType.ReturnStatement,
            argument: argument
        }
    }

    createBlockStatement(body: Array<SlimeStatement>): SlimeBlockStatement {
        return {
            type: SlimeAstType.BlockStatement,
            body: body
        }
    }

    createFunctionExpression(body: SlimeBlockStatement, id?: SlimeIdentifier | null): SlimeFunctionExpression {
        return {
            type: SlimeAstType.FunctionExpression,
            id: id,
            body: body
        }
    }

    createVariableDeclaration(kind: SlimeVariableDeclarationKind, declarations: SlimeVariableDeclarator[]): SlimeVariableDeclaration {
        return {
            type: SlimeAstType.VariableDeclaration,
            declarations: declarations,
            kind: kind
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
            operator: operator,
            init: init,
        }
    }

    createIdentifier(name: string): SlimeIdentifier {
        return {
            type: SlimeAstType.Identifier,
            name: name
        }
    }

    createLiteral(value?: number | string): SlimeLiteral {
        let ast: SlimeLiteral
        if (value === undefined) {
            ast = this.createNullLiteralToken()
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
            value: value
        }
    }

    createNumericLiteral(value: number): SlimeNumberLiteral {
        return {
            type: SlimeAstType.NumberLiteral,
            value: value
        }
    }

    createBooleanLiteral(value: boolean): SlimeBooleanLiteral {
        return {
            type: SlimeAstType.BooleanLiteral,
            value: value
        }
    }
}

const SlimeAstUtil = new SlimeAst()
export default SlimeAstUtil
