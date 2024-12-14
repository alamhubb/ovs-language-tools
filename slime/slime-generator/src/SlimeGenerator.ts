import {
    SlimeArrayExpression,
    SlimeBaseNode,
    SlimeBlockStatement,
    SlimeCallExpression,
    type SlimeExpression,
    SlimeExpressionStatement,
    SlimeFunctionExpression,
    SlimeIdentifier,
    SlimeMemberExpression,
    SlimeNumberLiteral,
    type SlimePattern,
    SlimeProgram,
    SlimeProgramSourceType,
    SlimeReturnStatement,
    type SlimeStatement, SlimeStringLiteral,
    SlimeVariableDeclaration,
    type SlimeVariableDeclarator
} from "slime-ast/src/SlimeAstInterface";
import {SlimeAstType} from "slime-ast/src/SlimeAstType";
import SlimeCodeMapping, {SlimeCodeLocation, SlimeGeneratorResult} from "./SlimeCodeMapping";
import type {SubhutiSourceLocation} from "subhuti/src/struct/SubhutiCst";
import {Identifier, ReturnStatement} from "typescript";
import JsonUtil from "subhuti/src/utils/JsonUtil";

export function checkAstName(astName: string, cst: SlimeBaseNode) {
    if (cst.type !== astName) {
        console.log(cst)
        throw new Error('syntax error' + cst.type)
    }
}

export default class SlimeGenerator {
    static mappings: SlimeCodeMapping[] = null
    static lastSourcePosition: SlimeCodeLocation = null
    static generatePosition: SlimeCodeLocation = null
    static sourceCodeIndex: number = null
    private static generateCode = ''
    private static generateLine = 0
    private static generateColumn = 0
    private static generateIndex = 0

    static generator(node: SlimeBaseNode): SlimeGeneratorResult {
        this.mappings = []
        this.lastSourcePosition = new SlimeCodeLocation()
        this.generatePosition = new SlimeCodeLocation()
        this.sourceCodeIndex = 0
        this.generateLine = 0
        this.generateColumn = 0
        this.generateIndex = 0
        this.generateCode = ''
        this.generatorSlimeAst(node)
        return {
            mapping: this.mappings,
            code: this.generateCode
        }
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
        nodes.forEach((node, index) => {
            // if (this.generateLine !== 0 || index !== 0) {
            //     this.addNewLine()
            // }
            this.generatorStatement(node)
            this.addSemicolon()
        })
    }


    private static generatorStatement(node: SlimeStatement) {
        if (node.type === SlimeAstType.VariableDeclaration) {
            this.generatorVariableDeclaration(node as SlimeVariableDeclaration)
        } else if (node.type === SlimeAstType.ExpressionStatement) {
            this.generatorExpressionStatement(node as SlimeExpressionStatement)
        } else if (node.type === SlimeAstType.ReturnStatement) {
            this.generatorReturnStatement(node as SlimeReturnStatement)
        } else if (node.type === SlimeAstType.BlockStatement) {
            this.generatorBlockStatement(node as SlimeBlockStatement)
        } else {
            throw new Error('不支持的类型：' + node.type)
        }
    }

    private static generatorExpressionStatement(node: SlimeExpressionStatement) {
        this.generatorExpression(node.expression)
    }

    private static generatorCallExpression(node: SlimeCallExpression) {
        if (node.callee.type === SlimeAstType.FunctionExpression){
            this.addCode('(')
        }
        this.generatorExpression(node.callee)
        if (node.callee.type === SlimeAstType.FunctionExpression){
            this.addCode(')')
        }
        this.addCodeAndMappings('(', node.callee.loc)
        node.arguments.forEach((argument, index) => {
            if (index !== 0) {
                this.addCode(',')
            }
            this.generatorExpression(argument)
        })
        this.addCodeAndMappings(')', node.callee.loc)
    }

    private static generatorFunctionExpression(node: SlimeFunctionExpression) {
        this.addCode('function ')
        if (node.id) {
            this.generatorIdentifier(node.id)
        }
        this.addCode('(')
        if (node.params) {
            node.params.forEach((param, index) => {
                if (index !== 0) {
                    this.addCode(',')
                }
                this.generatorIdentifier(param as SlimeIdentifier)
            })
        }
        this.addCode(')')
        this.generatorBlockStatement(node.body)

    }

    private static generatorArrayExpression(node: SlimeArrayExpression) {
        for (const element of node.elements) {
            this.generatorExpression(element)
        }
    }

    private static generatorBlockStatement(node: SlimeBlockStatement) {
        this.addCode('{')
        this.addNewLine()
        this.generatorStatements(node.body)
        this.addNewLine()
        this.addCode('}')
    }

    private static generatorReturnStatement(node: SlimeReturnStatement) {
        this.generatorExpression(node.argument)
    }

    private static generatorMemberExpression(node: SlimeMemberExpression) {
        this.generatorExpression(node.object)
        this.addCodeAndMappings('.', node.loc)
        this.generatorExpression(node.property)
    }

    private static generatorVariableDeclaration(node: SlimeVariableDeclaration) {
        checkAstName(SlimeAstType.VariableDeclaration, node)

        this.addCodeAndMappings(node.kind.toString(), node.loc)
        this.addCodeSpacing()
        for (const declaration of node.declarations) {
            this.generatorVariableDeclarator(declaration)
        }
    }

    static get lastMapping() {
        if (this.mappings.length) {
            return this.mappings[this.mappings.length - 1]
        }
        return null
    }


    private static generatorVariableDeclarator(node: SlimeVariableDeclarator) {
        checkAstName(SlimeAstType.VariableDeclarator, node)
        this.generatorPattern(node.id)
        this.addCodeSpacing()
        if (node.operator) {
            this.addCodeAndMappings(node.operator.value, node.operator.loc)
            this.addCodeSpacing()
        }
        if (node.init) {
            this.generatorExpression(node.init)
        }
    }

    private static generatorExpression(node: SlimeExpression) {
        if (node.type === SlimeAstType.Identifier) {
            this.generatorIdentifier(node as SlimeIdentifier)
        } else if (node.type === SlimeAstType.NumberLiteral) {
            this.generatorNumberLiteral(node as SlimeNumberLiteral)
        } else if (node.type === SlimeAstType.MemberExpression) {
            this.generatorMemberExpression(node as SlimeMemberExpression)
        } else if (node.type === SlimeAstType.CallExpression) {
            this.generatorCallExpression(node as SlimeCallExpression)
        } else if (node.type === SlimeAstType.FunctionExpression) {
            this.generatorFunctionExpression(node as SlimeFunctionExpression)
        } else if (node.type === SlimeAstType.StringLiteral) {
            this.generatorStringLiteral(node as SlimeStringLiteral)
        } else if (node.type === SlimeAstType.ArrayExpression) {
            this.generatorArrayExpression(node as SlimeArrayExpression)
        } else {
            throw new Error('不支持的类型：' + node.type)
        }
    }

    private static generatorNumberLiteral(node: SlimeNumberLiteral) {
        checkAstName(SlimeAstType.NumberLiteral, node)
        this.addCodeAndMappings(node.value.toString(), node.loc)
    }

    private static generatorStringLiteral(node: SlimeStringLiteral) {
        checkAstName(SlimeAstType.StringLiteral, node)
        this.addCodeAndMappings(node.value, node.loc)
    }

    static cstLocationToSlimeLocation(cstLocation: SubhutiSourceLocation, sourceLength?: number) {
        const sourcePosition: SlimeCodeLocation = {
            line: cstLocation.start.line,
            column: cstLocation.start.column,
            index: cstLocation.index,
            length: sourceLength || cstLocation.end.column - cstLocation.start.column
        }
        return sourcePosition
    }

    private static addCodeAndMappingsBySourcePosition(code: string, sourcePosition: SlimeCodeLocation) {
        this.addMappings(sourcePosition, code.length)
        this.addCode(code)
    }

    private static addCodeAndMappings(code: string, cstLocation: SubhutiSourceLocation, sourceLength: number = code.length) {
        this.addCodeAndMappingsBySourcePosition(code, this.cstLocationToSlimeLocation(cstLocation, sourceLength))
    }

    private static addCode(code: string) {
        this.generateCode += code
        this.generateColumn += code.length
        this.generateIndex += code.length
    }

    private static addSemicolon() {
        // this.generateCode += ';'
        // this.generateIndex += 1
    }

    private static addNewLine() {
        this.generateCode += '\n'
        this.generateLine++
        this.generateColumn = 0
        this.generateIndex += 1
    }

    private static addCodeSpacing() {
        this.generateCode += ' '
        this.generateColumn++
        this.generateIndex++
    }


    private static addMappings(sourcePosition: SlimeCodeLocation, generateLength: number) {
        let generate: SlimeCodeLocation = {
            line: this.generateLine,
            column: this.generateColumn,
            index: this.generateIndex,
            length: generateLength,
        }
        this.mappings.push({
            source: sourcePosition,
            generate: generate
        })
    }

    private static generatorPattern(node: SlimePattern) {
        if (node.type === SlimeAstType.Identifier) {
            this.generatorIdentifier(node)
        }
    }

    private static generatorIdentifier(node: SlimeIdentifier) {
        checkAstName(SlimeAstType.Identifier, node)
        JsonUtil.log(111)
        JsonUtil.log(node)
        this.addCodeAndMappings(node.name, node.loc)
    }

    /*private static generatorModuleDeclaration(node: SlimeModuleDeclaration[]) {
        node.
    }*/
}
