import * as babeType from "@babel/types";
import {SlimeAstType, type SlimeCaretEqualsToken, type SlimeLiteral} from "./SlimeAstInterface.ts";

export const SlimeAst = {
    createCaretEqualsToken(): SlimeCaretEqualsToken {
        return {
            type: SlimeAstType.CaretEqualsToken
        }
    },

    createLiteral(value?: number | string): SlimeLiteral {
        let ast: SlimeLiteral
        if (value === undefined) {
            ast = SlimeAst.createCaretEqualsToken()
        }
        if (typeof value === "string") {
            ast = babeType.stringLiteral(value)
        } else if (typeof value === "number") {
            ast = babeType.numericLiteral(value)
        }
        return ast
    }
}
