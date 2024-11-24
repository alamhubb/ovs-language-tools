import type {SlimeLiteral} from "slime-ast/src/SlimeAstInterface.ts";

export default class SlimeAstUtil {



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