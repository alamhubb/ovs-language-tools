import SubhutiLexer from "subhuti/src/parser/SubhutiLexer.ts";
import {es6Tokens} from "./language/es2015/Es6Tokens.ts";
import Es6Parser from "./language/es2015/Es6Parser.ts";
import {es6CstToEstreeAstUtil} from "./language/es2015/Es6CstToEstreeAstUtil.ts";
import JsonUtil from "./utils/JsonUtil.ts";


export function test(code) {
    const lexer = new SubhutiLexer(es6Tokens)
    const tokens = lexer.lexer(code)
    const parser = new Es6Parser(tokens)

    let code1 = null
    let curCst = parser.Program()
    // curCst = traverseClearTokens(curCst)
    // JsonUtil.log(curCst)
    console.log(111231)
    // JsonUtil.log(curCst)
    //cst转 estree ast
    const ast = es6CstToEstreeAstUtil.createProgramAst(curCst)
    JsonUtil.log(ast)
    // console.log(456465)
    //ast to client ast
    // TokenProvider.visitNode(ast)
    // JsonUtil.log(TokenProvider.tokens)


    // code1 = parser.exec()
    // console.log(code1)
    // const mapping = new OvsMappingParser()
    // mapping.openMappingMode(curCst)
    // code1 = mapping.exec(curCst)
    // console.log(code1)
    return `
    import OvsAPI from "@/ovs/OvsAPI.ts";\n
    ${code1}
    `
}

const code = `export default class Testa {
    static print11(abc) {
        console.log(true)
    }
}
`
test(code)
