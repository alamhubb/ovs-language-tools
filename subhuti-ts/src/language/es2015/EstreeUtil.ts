import type SubhutiCst from "subhuti/src/struct/SubhutiCst.ts";
import {Identifier, SourceLocation} from "estree";
import Es6TokenConsumer from "./Es6Tokens.ts";
import {checkCstName} from "./Es6CstToEstreeAstUtil.ts";

export default class EstreeUtil {
    static createIdentifierAst(name: string, loc: SourceLocation): Identifier {
        const ast: Identifier = {
            type: 'Identifier',
            name: name,
            loc: loc
        }
        return ast
    }
}
