import Es6TokenConsumer, {Es6TokenName, es6TokensObj} from "./Es6Tokens.ts";
import Es6Parser from "./Es6Parser.ts";
import type {
    SlimeAssignmentExpression,
    SlimeBlockStatement,
    SlimeCallExpression,
    SlimeClassBody,
    SlimeClassDeclaration,
    SlimeClassMethod,
    SlimeComment,
    SlimeConditionalExpression,
    SlimeDeclaration,
    SlimeDirective,                                                                                                                                                                                                                                                                                                                                                                                                                       h
    SlimeExportDefaultDeclaration,
    SlimeExportNamedDeclaration,
    SlimeExpression,
    SlimeExpressionStatement,
    SlimeFunctionDeclaration,
    SlimeFunctionExpression,
    SlimeIdentifier,
    SlimeInterpreterDirective,
    SlimeLiteral,
    SlimeMemberExpression,
    SlimeModuleDeclaration,
    SlimeNode,
    SlimePattern,
    SlimeProgram,
    SlimeSourceLocation,
    SlimeStatement,
    SlimeStringLiteral,
    SlimeTSDeclareFunction,
    SlimeVariableDeclaration,
    SlimeVariableDeclarator,
    SlimeReturnStatement,
    SlimeArrayExpression,
    SlimeSpreadElement
} from "slime-ast/src/SlimeAstInterface.ts";
import SubhutiCst from "subhuti/src/struct/SubhutiCst.ts";


export const EsTreeAstType: {
    ExportDefaultDeclaration: 'ExportDefaultDeclaration',
    ExportNamedDeclaration: 'ExportNamedDeclaration'
} = {
    ExportDefaultDeclaration: 'ExportDefaultDeclaration',
    ExportNamedDeclaration: 'ExportNamedDeclaration',
}

export function checkCstName(cst: SubhutiCst, cstName: string) {
    if (cst.name !== cstName) {
        throwNewError(cst.name)
    }
    return cstName
}

export function throwNewError(errorMsg: string = 'syntax error') {
    throw new Error(errorMsg)
}

class CstToAstUtil {
    createIdentifierAst(cst: SubhutiCst): SlimeIdentifier {
        const astName = checkCstName(cst, Es6TokenConsumer.prototype.Identifier.name);
        const identifier = babeType.identifier(cst.value)
        identifier.loc = cst.loc
        return identifier
    }

    toProgram(cst: SubhutiCst): SlimeProgram {
        const astName = checkCstName(cst, Es6Parser.prototype.Program.name);
        const first = cst.children[0]
        let program: SlimeProgram
        if (first.name === Es6Parser.prototype.ModuleItemList.name) {
            const body = this.createModuleItemListAst(first)
            program = babeType.program(body, [], "module")
        } else if (first.name === Es6Parser.prototype.StatementList.name) {
            const body = this.createStatementListAst(first)
            program = babeType.program(body, [], "script")
        }
        program.loc = cst.loc
        return program
    }

    createModuleItemListAst(cst: SubhutiCst): Array<SlimeStatement> {
        //直接返回声明
        //                 this.Statement()
        //                 this.Declaration()
        const astName = checkCstName(cst, Es6Parser.prototype.ModuleItemList.name);
        const asts = cst.children.map(item => {
            if (item.name === Es6Parser.prototype.ExportDeclaration.name) {
                return this.createExportDeclarationAst(item)
            } else if (item.name === Es6Parser.prototype.ImportDeclaration.name) {
                // return this.createExportDeclarationAst(item)
                throw new Error('暂时不支持')
            } else if (item.name === Es6Parser.prototype.StatementListItem.name) {
                return this.createStatementListItemAst(item)
            }
        })
        return asts.flat()
    }

    createStatementListAst(cst: SubhutiCst): Array<SlimeStatement> {
        const astName = checkCstName(cst, Es6Parser.prototype.StatementList.name);
        const statements = cst.children.map(item => this.createStatementListItemAst(item)).flat()
        return statements
    }

    createStatementListItemAst(cst: SubhutiCst): Array<SlimeStatement> {
        const astName = checkCstName(cst, Es6Parser.prototype.StatementListItem.name);
        const statements = cst.children.map(item => this.createStatementAst(item)).flat()
        return statements
    }

    createStatementAst(cst: SubhutiCst): Array<SlimeStatement> {
        const astName = checkCstName(cst, Es6Parser.prototype.Statement.name);
        const statements: Statement[] = cst.children.map(item => this.createStatementDeclarationAst(item))
        return statements
    }

    createStatementDeclarationAst(cst: SubhutiCst) {
        if (cst.name === Es6Parser.prototype.VariableDeclaration.name) {
            return this.createVariableDeclarationAst(cst)
        } else if (cst.name === Es6Parser.prototype.ExpressionStatement.name) {
            return this.createExpressionStatementAst(cst)
        } else if (cst.name === Es6Parser.prototype.ReturnStatement.name) {
            return this.createReturnStatementAst(cst)
        }
    }


    createExportDeclarationAst(cst: SubhutiCst): SlimeExportDefaultDeclaration | SlimeExportNamedDeclaration {
        let astName = checkCstName(cst, Es6Parser.prototype.ExportDeclaration.name);
        if (cst.children.length > 2) {
            return this.createExportDefaultDeclarationAst(cst)
        } else {
            return this.createExportNamedDeclarationAst(cst)
        }
    }

    createDefaultExportDeclarationAst(cst: SubhutiCst): SlimeTSDeclareFunction | SlimeFunctionDeclaration | SlimeClassDeclaration | SlimeExpression {
        switch (cst.name) {
            case Es6Parser.prototype.ClassDeclaration.name:
                return this.createClassDeclarationAst(cst);
        }
    }

    createExportDefaultDeclarationAst(cst: SubhutiCst): SlimeExportDefaultDeclaration {
        return {
            type: EsTreeAstType.ExportDefaultDeclaration,
            declaration: this.createDefaultExportDeclarationAst(cst.children[2]),
            loc: cst.loc
        };
    }

    createExportNamedDeclarationAst(cst: SubhutiCst): SlimeExportNamedDeclaration {
        return {
            type: EsTreeAstType.ExportNamedDeclaration,
            declaration: this.createDeclarationAst(cst.children[1]),
            specifiers: [],
            loc: cst.loc
        };
    }


    createDeclarationAst(cst: SubhutiCst): SlimeDeclaration {
        switch (cst.name) {
            case Es6Parser.prototype.VariableDeclaration.name:
                return this.createVariableDeclarationAst(cst);
        }
    }


    createNodeAst(cst: SubhutiCst) {
        switch (cst.name) {
            case Es6Parser.prototype.VariableDeclaration.name:
                return this.createVariableDeclarationAst(cst);
            case Es6Parser.prototype.ExpressionStatement.name:
                return this.createExpressionStatementAst(cst);
        }
    }


    createVariableDeclarationAst(cst: SubhutiCst): SlimeVariableDeclaration {
        //直接返回声明
        //                 this.Statement()
        //                 this.Declaration()
        const astName = checkCstName(cst, Es6Parser.prototype.VariableDeclaration.name);
        const ast: VariableDeclaration = {
            type: astName as any,
            declarations: cst.children[1].children.map(item => this.createVariableDeclaratorAst(item)) as any[],
            kind: cst.children[0].children[0].value as any,
            loc: cst.loc
        }
        return ast
    }


    createClassDeclarationAst(cst: SubhutiCst): SlimeClassDeclaration {
        const astName = checkCstName(cst, Es6Parser.prototype.ClassDeclaration.name);
        const ast: ClassDeclaration = {
            type: astName as any,
            id: this.createIdentifierAst(cst.children[1].children[0]),
            body: this.createClassBodyAst(cst.children[2].children[1]),
            loc: cst.loc
        }
        return ast
    }

    createClassBodyItemAst(staticCst: SubhutiCst, cst: SubhutiCst): ClassMethod | SlimePropertyDefinition {
        if (cst.name === Es6Parser.prototype.MethodDefinition.name) {
            return this.createMethodDefinitionAst(staticCst, cst)
        } else if (cst.name === Es6Parser.prototype.PropertyDefinition.name) {
            // return this.createExportDeclarationAst(item)
        }
    }

    createClassBodyAst(cst: SubhutiCst): SlimeClassBody {
        const astName = checkCstName(cst, Es6Parser.prototype.ClassBody.name);
        //ClassBody.ClassElementList
        const body: Array<ClassMethod | SlimePropertyDefinition> = cst.children[0].children.map(item => {
                const astName = checkCstName(item, Es6Parser.prototype.ClassElement.name);
                if (item.children.length > 1) {
                    return this.createClassBodyItemAst(item.children[0], item.children[1])
                } else {
                    return this.createClassBodyItemAst(null, item.children[0])
                }
            }
        )
        const ast: ClassBody = {
            type: astName as any,
            body: body,
            loc: cst.loc
        }
        return ast
    }

    createMethodDefinitionAst(staticCst: SubhutiCst, cst: SubhutiCst): SlimeClassMethod {
        const astName = checkCstName(cst, Es6Parser.prototype.MethodDefinition.name);
        const ast: ClassMethod = {
            type: BabelAstType.ClassMethod,
            kind: 'method',
            static: true,
            computed: false,
            generator: false,
            async: false,
            params: this.createFormalParametersAst(cst.children[2]),
            key: this.createIdentifierAst(cst.children[0].children[0].children[0]),
            body: this.createBlockStatementAst(cst.children[5].children[0]),
            loc: cst.loc
        }
        return ast
    }

    createFunctionExpressionAst(cstParams: SubhutiCst, cst: SubhutiCst): SlimeFunctionExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.FunctionBody.name);
        const params = this.createFormalParametersAst(cstParams.children[1])
        const ast: FunctionExpression = {
            type: Es6Parser.prototype.FunctionExpression.name as any,
            id: null,
            params: params,
            body: this.createBlockStatementAst(cst.children[0]),
            generator: false,
            expression: false,
            async: false,
            loc: cst.loc
        } as any
        return ast
    }

    createFormalParametersAst(cst: SubhutiCst): Pattern[] {
        const astName = checkCstName(cst, Es6Parser.prototype.FormalParameters.name);
        if (!cst.children) {
            return []
        }
        // FormalParameterList.FormalsList
        const params = cst.children[0].children[0].children.filter(item => item.name === Es6Parser.prototype.FormalParameter.name).map(item => {
            return this.createIdentifierAst(item.children[0].children[0].children[0].children[0])
        })
        return params
    }


    createBlockStatementAst(cst: SubhutiCst): SlimeBlockStatement {
        const astName = checkCstName(cst, Es6Parser.prototype.StatementList.name);
        const statements: Array<Statement> = this.createStatementListAst(cst)
        const ast: BlockStatement = {
            type: Es6Parser.prototype.BlockStatement.name as any,
            body: statements,
            directives: [],
            loc: cst.loc
        }
        return ast
    }

    createReturnStatementAst(cst: SubhutiCst): SlimeReturnStatement {
        const astName = checkCstName(cst, Es6Parser.prototype.ReturnStatement.name);
        const ast: ReturnStatement = {
            type: astName as any,
            argument: this.createExpressionAst(cst.children[1]),
            loc: cst.loc
        } as any
        return ast
    }

    createExpressionStatementAst(cst: SubhutiCst): SlimeExpressionStatement {
        const astName = checkCstName(cst, Es6Parser.prototype.ExpressionStatement.name);
        const ast: ExpressionStatement = {
            type: astName as any,
            expression: this.createExpressionAst(cst.children[0]),
            loc: cst.loc
        } as any
        return ast
    }

    createCallExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.CallExpression.name);
        if (cst.children.length > 1) {
            const argumentsCst = cst.children[1]
            let argumentsAst: any[] = []

            if (argumentsCst.children.length > 2) {
                const ArgumentListCst = argumentsCst.children[1]
                const assignParams = ArgumentListCst.children.filter(item => item.name === Es6Parser.prototype.AssignmentExpression.name)
                argumentsAst = assignParams.map(item => this.createAssignmentExpressionAst(item)) as any[]
            }
            const callee = this.createMemberExpressionAst(cst.children[0])


            const ast: CallExpression = {
                type: astName as any,
                callee: callee,
                arguments: argumentsAst,
                optional: false,
                loc: cst.loc
            } as any
            return ast
        }
        return this.createExpressionAst(cst.children[0])
    }


    createMemberExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.MemberExpression.name);
        if (cst.children.length > 1) {
            const ast: MemberExpression = {
                type: astName as any,
                object: this.createIdentifierAst(cst.children[0].children[0].children[0]),
                property: this.createIdentifierAst(cst.children[2]),
                computed: false,
                optional: false,
                loc: cst.loc
            } as any
            return ast
        }
        return this.createExpressionAst(cst.children[0])
    }

    createVariableDeclaratorAst(cst: SubhutiCst): SlimeVariableDeclarator {
        const astName = checkCstName(cst, Es6Parser.prototype.VariableDeclarator.name);
        const id = this.createIdentifierAst(cst.children[0].children[0])
        let variableDeclarator: VariableDeclarator
        if (cst.children[1]) {
            const initCst = cst.children[1].children[1]
            const init = this.createAssignmentExpressionAst(initCst)
            variableDeclarator = babeType.variableDeclarator(id, init)
        } else {
            variableDeclarator = babeType.variableDeclarator(id)
        }
        variableDeclarator.loc = cst.loc
        return variableDeclarator
    }

    createExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = cst.name
        let left
        if (astName === Es6Parser.prototype.Expression.name) {
            left = this.createExpressionAst(cst.children[0])
        } else if (astName === Es6Parser.prototype.Statement.name) {
            left = this.createStatementAst(cst)
        } else if (astName === Es6Parser.prototype.AssignmentExpression.name) {
            left = this.createAssignmentExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.ConditionalExpression.name) {
            left = this.createConditionalExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.LogicalORExpression.name) {
            left = this.createLogicalORExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.LogicalANDExpression.name) {
            left = this.createLogicalANDExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.BitwiseORExpression.name) {
            left = this.createBitwiseORExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.BitwiseXORExpression.name) {
            left = this.createBitwiseXORExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.BitwiseANDExpression.name) {
            left = this.createBitwiseANDExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.EqualityExpression.name) {
            left = this.createEqualityExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.RelationalExpression.name) {
            left = this.createRelationalExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.ShiftExpression.name) {
            left = this.createShiftExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.AdditiveExpression.name) {
            left = this.createAdditiveExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.MultiplicativeExpression.name) {
            left = this.createMultiplicativeExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.UnaryExpression.name) {
            left = this.createUnaryExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.PostfixExpression.name) {
            left = this.createPostfixExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.LeftHandSideExpression.name) {
            left = this.createLeftHandSideExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.CallExpression.name) {
            left = this.createCallExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.NewExpression.name) {
            left = this.createNewExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.MemberExpression.name) {
            left = this.createMemberExpressionAst(cst)
        } else if (astName === Es6Parser.prototype.PrimaryExpression.name) {
            left = this.createPrimaryExpressionAst(cst)
        }
        return left
    }

    createLogicalORExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.LogicalORExpression.name);
        if (cst.children.length > 1) {

        }
        return this.createExpressionAst(cst.children[0])
    }

    createLogicalANDExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.LogicalANDExpression.name);
        if (cst.children.length > 1) {

        }
        return this.createExpressionAst(cst.children[0])
    }

    createBitwiseORExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.BitwiseORExpression.name);
        if (cst.children.length > 1) {

        }
        return this.createExpressionAst(cst.children[0])
    }

    createBitwiseXORExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.BitwiseXORExpression.name);
        if (cst.children.length > 1) {

        }
        return this.createExpressionAst(cst.children[0])
    }

    createBitwiseANDExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.BitwiseANDExpression.name);
        if (cst.children.length > 1) {

        }
        return this.createExpressionAst(cst.children[0])
    }

    createEqualityExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.EqualityExpression.name);
        if (cst.children.length > 1) {

        }
        return this.createExpressionAst(cst.children[0])
    }

    createRelationalExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.RelationalExpression.name);
        if (cst.children.length > 1) {

        }
        return this.createExpressionAst(cst.children[0])
    }

    createShiftExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.ShiftExpression.name);
        if (cst.children.length > 1) {

        }
        return this.createExpressionAst(cst.children[0])
    }

    createAdditiveExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.AdditiveExpression.name);
        if (cst.children.length > 1) {

        }
        return this.createExpressionAst(cst.children[0])
    }

    createMultiplicativeExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.MultiplicativeExpression.name);
        if (cst.children.length > 1) {

        }
        return this.createExpressionAst(cst.children[0])
    }

    createUnaryExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.UnaryExpression.name);
        if (cst.children.length > 1) {

        }
        return this.createExpressionAst(cst.children[0])
    }

    createPostfixExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.PostfixExpression.name);
        if (cst.children.length > 1) {

        }
        return this.createExpressionAst(cst.children[0])
    }

    createLeftHandSideExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.LeftHandSideExpression.name);
        if (cst.children.length > 1) {

        }
        return this.createExpressionAst(cst.children[0])
    }

    createNewExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.NewExpression.name);
        if (cst.children.length > 1) {

        }
        return this.createExpressionAst(cst.children[0])
    }

    createPrimaryExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.PrimaryExpression.name);
        const first = cst.children[0]
        if (first.name === Es6Parser.prototype.IdentifierReference.name) {
            return this.createIdentifierAst(first.children[0])
        } else if (first.name === Es6Parser.prototype.Literal.name) {
            return this.createLiteralAst(first)
        } else if (first.name === Es6Parser.prototype.ArrayLiteral.name) {
            return this.createArrayExpressionAst(first)
        } else if (first.name === Es6Parser.prototype.FunctionExpression.name) {
            return this.createFunctionExpressionAst(first.children[1], first.children[3])
        }
    }

    createArrayExpressionAst(cst: SubhutiCst): SlimeArrayExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.ArrayLiteral.name);
        const ast: ArrayExpression = {
            type: 'ArrayExpression',
            elements: this.createElementListAst(cst.children[1])
        }
        return ast
    }

    createElementListAst(cst: SubhutiCst): Array<null | SlimeExpression | SlimepreadElement> {
        const astName = checkCstName(cst, Es6Parser.prototype.ElementList.name);
        const ast: Array<null | SlimeExpression | SlimepreadElement> = cst.children.filter(item => item.name === Es6Parser.prototype.AssignmentExpression.name).map(item => this.createAssignmentExpressionAst(item))
        return ast
    }


    createLiteralAst(cst: SubhutiCst): SlimeLiteral {
        const astName = checkCstName(cst, Es6Parser.prototype.Literal.name);
        const firstChild = cst.children[0]
        const firstValue = firstChild.value
        let value
        if (firstChild.name === Es6TokenConsumer.prototype.NumericLiteral.name) {
            value = babeType.numericLiteral(Number(firstValue))
        } else if (firstChild.name === Es6TokenConsumer.prototype.TrueTok.name) {
            value = babeType.booleanLiteral(true)
        } else if (firstChild.name === Es6TokenConsumer.prototype.FalseTok.name) {
            value = babeType.booleanLiteral(false)
        } else {
            const trimmed = firstValue.replace(/^['"]|['"]$/g, '');
            value = babeType.stringLiteral(trimmed)
        }
        value.loc = firstChild.loc
        return value
    }


    createAssignmentExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.AssignmentExpression.name);
        let left
        let right
        if (cst.children.length === 1) {
            return this.createExpressionAst(cst.children[0])
        }
        const ast: AssignmentExpression = {
            type: astName as any,
            // operator: AssignmentOperator;
            left: left,
            right: right,
            loc: cst.loc
        } as any
        return ast
    }

    createConditionalExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, Es6Parser.prototype.ConditionalExpression.name);
        const firstChild = cst.children[0]
        let test = this.createExpressionAst(firstChild)
        let alternate
        let consequent
        if (cst.children.length === 1) {
            return this.createExpressionAst(cst.children[0])
        } else {
            alternate = this.createAssignmentExpressionAst(cst.children[1])
            consequent = this.createAssignmentExpressionAst(cst.children[2])
        }
        const ast: ConditionalExpression = {
            type: astName as any,
            test: test as any,
            alternate: alternate as any,
            consequent: consequent as any,
            loc: cst.loc
        } as any
        return ast
    }


    createAssignmentOperatorAst(cst: SubhutiCst): SlimeAssignmentOperator {
        const astName = checkCstName(cst, Es6Parser.prototype.AssignmentOperator.name);
        const ast: AssignmentExpression = cst.children[0].value as any
        return ast as any
    }
}

const SlimeCstToAstUtil = new CstToAstUtil()

export default SlimeCstToAstUtil