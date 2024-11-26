import type {
    SlimeCaretEqualsToken, SlimeLiteral,
    SlimeNumberLiteral, SlimeStringLiteral
} from "./SlimeAstInterface.ts";
import {SlimeAstType} from "./SlimeAstInterface.ts";

class SlimeAst {
    createCaretEqualsToken(): SlimeCaretEqualsToken {
        return {
            type: SlimeAstType.CaretEqualsToken
        }
    }

    createLiteral(value?: number | string): SlimeLiteral {
        let ast: SlimeLiteral
         if (typeof value === "string") {
            ast = this.createStringLiteral(value)
        } else if (typeof value === "number") {
            ast = this.createNumberLiteral(value)
        }
        return ast
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