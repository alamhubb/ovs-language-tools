import {
    type SlimeCaretEqualsToken,
    type SlimeDirective, type SlimeExpression, type SlimeIdentifier,
    type SlimeLiteral,
    type SlimeModuleDeclaration,
    type SlimeNumberLiteral, type SlimePattern,
    type SlimeProgram,
    SlimeProgramSourceType,
    type SlimeStatement,
    type SlimeStringLiteral,
    type SlimeVariableDeclaration, SlimeVariableDeclarationKind, type SlimeVariableDeclarator
} from "./SlimeAstInterface.ts";
import {SlimeAstType} from "./SlimeAstInterface.ts";
import * as babelType from "@babel/types";

class SlimeAst {
    createProgram(body: Array<SlimeDirective | SlimeStatement | SlimeModuleDeclaration>, sourceType: SlimeProgramSourceType = SlimeProgramSourceType.script): SlimeProgram {
        return {
            type: SlimeAstType.Program,
            sourceType: sourceType,
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

    createVariableDeclarator(id: SlimePattern, init?: SlimeExpression): SlimeVariableDeclarator {
        return {
            type: SlimeAstType.VariableDeclarator,
            id: id,
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
            ast = this.createCaretEqualsToken()
        } else if (typeof value === "string") {
            ast = this.createStringLiteral(value)
        } else if (typeof value === "number") {
            ast = this.createNumberLiteral(value)
        }
        return ast
    }


    createCaretEqualsToken(): SlimeCaretEqualsToken {
        return {
            type: SlimeAstType.CaretEqualsToken
        }
    }


    createStringLiteral(value: string): SlimeStringLiteral {
        return {
            type: SlimeAstType.StringLiteral,
            value: value
        }
    }

    createNumberLiteral(value: number): SlimeNumberLiteral {
        return {
            type: SlimeAstType.NumberLiteral,
            value: value
        }
    }
}

export default new SlimeAst()