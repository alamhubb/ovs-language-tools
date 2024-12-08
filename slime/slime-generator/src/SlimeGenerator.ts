import {
    SlimeBaseNode, SlimeCaretEqualsToken, type SlimeExpression, SlimeIdentifier,
    type SlimeModuleDeclaration, type SlimePattern,
    SlimeProgram,
    SlimeProgramSourceType,
    type SlimeStatement, SlimeVariableDeclaration, type SlimeVariableDeclarator
} from "slime-ast/src/SlimeAstInterface";
import {SlimeAstType} from "slime-ast/src/SlimeAstType";

export function checkAstName(astName: string, cst: SlimeBaseNode) {
    if (cst.type !== astName) {
        console.log(cst)
        throw new Error('syntax error' + cst.type)
    }
}

export default class SlimeGenerator {
    static generator(node: SlimeBaseNode) {
        return this.generatorSlimeAst(node)
    }

    static generatorSlimeAst(node: SlimeBaseNode) {
        if (node.type === SlimeAstType.Program) {
            this.generatorProgram(node as SlimeProgram)
        }
    }

    static generatorProgram(node: SlimeProgram) {
        checkAstName(SlimeAstType.Program, node)
        if (node.sourceType === SlimeProgramSourceType.script) {
            const body = node.body as SlimeStatement []
            return this.generatorStatements(body)
        } else {
            // const body = node.body as SlimeModuleDeclaration []
            // return this.generatorModuleDeclaration(body)
        }
    }

    static generatorStatements(nodes: SlimeStatement[]) {
        let code = ''
        for (const node of nodes) {
            code += this.generatorStatement(node)
        }
    }


    static generatorStatement(node: SlimeStatement) {
        if (node.type === SlimeAstType.VariableDeclaration) {
            return this.generatorVariableDeclaration(node as SlimeVariableDeclaration)
        }
    }

    static generatorVariableDeclaration(node: SlimeVariableDeclaration) {
        checkAstName(SlimeAstType.VariableDeclaration, node)
        for (const declaration of node.declarations) {
            this.generatorVariableDeclarator(declaration)
        }
    }

    static generatorVariableDeclarator(node: SlimeVariableDeclarator) {
        checkAstName(SlimeAstType.VariableDeclarator, node)
        let code = ''
        this.generatorPattern(node.id)
        if (node.init) {
            this.generatorExpression(node.init)
        }
    }

    static generatorExpression(node: SlimeExpression) {
        if (node.type === SlimeAstType.CaretEqualsToken) {
            return this.generatorCaretEqualsToken(node)
        }
    }

    static generatorCaretEqualsToken(node: SlimeCaretEqualsToken) {
        checkAstName(SlimeAstType.CaretEqualsToken, node)
        return '='
    }

    static generatorPattern(node: SlimePattern) {
        if (node.type === SlimeAstType.Identifier) {
            return this.generatorIdentifier(node)
        }
    }

    static generatorIdentifier(node: SlimeIdentifier) {
        checkAstName(SlimeAstType.Identifier, node)
        return node.name
    }

    /*static generatorModuleDeclaration(node: SlimeModuleDeclaration[]) {
        node.
    }*/
}