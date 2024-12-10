import {
    SlimeBaseNode, SlimeCaretEqualsToken, type SlimeExpression, SlimeIdentifier,
    type SlimeModuleDeclaration, type SlimePattern,
    SlimeProgram,
    SlimeProgramSourceType,
    type SlimeStatement, SlimeVariableDeclaration, type SlimeVariableDeclarator
} from "slime-ast/src/SlimeAstInterface";
import {SlimeAstType} from "slime-ast/src/SlimeAstType";
import SlimeCodeMapping, {SlimeCodePosition} from "./SlimeCodeMapping";

export function checkAstName(astName: string, cst: SlimeBaseNode) {
    if (cst.type !== astName) {
        console.log(cst)
        throw new Error('syntax error' + cst.type)
    }
}

export default class SlimeGenerator {
    static mapping: SlimeCodeMapping = null
    static generatePosition: SlimeCodePosition = null

    static generator(node: SlimeBaseNode) {
        this.mapping = new SlimeCodeMapping()
        this.generatePosition = new SlimeCodePosition()
        return this.generatorSlimeAst(node)
    }

    private static generatorSlimeAst(node: SlimeBaseNode) {
        if (node.type === SlimeAstType.Program) {
            return this.generatorProgram(node as SlimeProgram)
        }
    }

    private static generatorProgram(node: SlimeProgram) {
        checkAstName(SlimeAstType.Program, node)
        if (node.sourceType === SlimeProgramSourceType.script) {
            const body = node.body as SlimeStatement []
            return this.generatorStatements(body)
        } else {
            // const body = node.body as SlimeModuleDeclaration []
            // return this.generatorModuleDeclaration(body)
        }
    }

    private static generatorStatements(nodes: SlimeStatement[]) {
        let code = ''
        for (const node of nodes) {
            code += this.generatorStatement(node)
        }
        return code
    }


    private static generatorStatement(node: SlimeStatement) {
        if (node.type === SlimeAstType.VariableDeclaration) {
            return this.generatorVariableDeclaration(node as SlimeVariableDeclaration)
        }
    }

    private static generatorVariableDeclaration(node: SlimeVariableDeclaration) {
        checkAstName(SlimeAstType.VariableDeclaration, node)

        let code = node.kind.toString()
        for (const declaration of node.declarations) {
            code += this.generatorVariableDeclarator(declaration)
        }
        return code
    }

    private static generatorVariableDeclarator(node: SlimeVariableDeclarator) {
        checkAstName(SlimeAstType.VariableDeclarator, node)
        let code = ''
        code += this.generatorPattern(node.id)
        if (node.init) {
            code += this.generatorExpression(node.init)
        }
        return code
    }

    private static generatorExpression(node: SlimeExpression) {
        if (node.type === SlimeAstType.CaretEqualsToken) {
            return this.generatorCaretEqualsToken(node)
        }
    }

    private static generatorCaretEqualsToken(node: SlimeCaretEqualsToken) {
        checkAstName(SlimeAstType.CaretEqualsToken, node)
        return '='
    }

    private static generatorPattern(node: SlimePattern) {
        if (node.type === SlimeAstType.Identifier) {
            return this.generatorIdentifier(node)
        }
    }

    private static generatorIdentifier(node: SlimeIdentifier) {
        checkAstName(SlimeAstType.Identifier, node)
        return node.name
    }

    /*private static generatorModuleDeclaration(node: SlimeModuleDeclaration[]) {
        node.
    }*/
}
