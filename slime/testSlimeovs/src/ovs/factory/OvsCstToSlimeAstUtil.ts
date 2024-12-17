import {SlimeCstToAst} from "slime-parser/src/language/SlimeCstToAstUtil.ts";
import SubhutiCst from "subhuti/src/struct/SubhutiCst.ts";
import type {SlimeCallExpression, SlimeExpression, SlimeStatement} from "slime-ast/src/SlimeAstInterface.ts";
import OvsParser from "../parser/OvsParser.ts";
import JsonUtil from "subhuti/src/utils/JsonUtil.ts";
import {OvsAstLexicalBinding, OvsAstRenderDomViewDeclaration} from "../interface/OvsInterface";
import SlimeAstUtil from "slime-ast/src/SlimeAst.ts";

export function checkCstName(cst: SubhutiCst, cstName: string) {
    if (cst.name !== cstName) {
        console.log(cst)
        throwNewError(cst.name)
    }
    return cstName
}

export function throwNewError(errorMsg: string = 'syntax error') {
    throw new Error(errorMsg)
}

export class OvsCstToSlimeAst extends SlimeCstToAst {
    createExpressionAst(cst: SubhutiCst): SlimeExpression {
        const astName = cst.name
        let left
        if (astName === OvsParser.prototype.OvsRenderDomViewDeclaration.name) {
            left = this.createOvsRenderDomViewDeclarationAst(cst)
        } else {
            left = super.createExpressionAst(cst)
        }
        return left
    }

    createOvsRenderDomViewDeclarationAst(cst: SubhutiCst): SlimeCallExpression {
        const astName = checkCstName(cst, OvsParser.prototype.OvsRenderDomViewDeclaration.name);
        JsonUtil.log(cst)
        let children = []
        if (cst.children.length > 1) {
            children = cst.children[2].children.filter(item => item.name === OvsParser.prototype.OvsRenderDomViewDeclarator.name).map(item => this.createOvsRenderDomViewDeclaratorAst(item)) as any[]
        }

        const id = this.createIdentifierAst(cst.children[0])
        id.loc = cst.children[0].loc

        const ast: OvsAstRenderDomViewDeclaration = {
            type: astName as any,
            id: id,
            // children: cst.children[2].children.filter(item => item.name === OvsParser.prototype.OvsRenderDomViewDeclarator.name),
            children: children,
            loc: cst.loc
            // children: this.createAssignmentExpressionAst(cst.children[2])
        } as any

        JsonUtil.log(33333)
        JsonUtil.log(ast)
        const res = this.createOvsRenderDomViewDeclarationEstreeAst(ast)
        // left = this.ovsRenderDomViewDeclarationAstToEstreeAst(left)
        return res
    }

    createOvsRenderDomViewDeclarationEstreeAst(ast: OvsAstRenderDomViewDeclaration): SlimeCallExpression {
        const body = this.createOvsAPICreateVNode(ast)
        const viewIIFE = this.createIIFE(body)
        return viewIIFE
    }

    createIIFE(body: Array<SlimeStatement>): SlimeCallExpression {
        const blockStatement = SlimeAstUtil.createBlockStatement(body)
        const functionExpression = SlimeAstUtil.createFunctionExpression(blockStatement)
        const callExpression = SlimeAstUtil.createCallExpression(functionExpression, [])
        return callExpression
    }

    createOvsAPICreateVNode(ast: OvsAstRenderDomViewDeclaration): SlimeStatement[] {
        const memberExpressionObject = SlimeAstUtil.createIdentifier('OvsAPI')
        memberExpressionObject.loc = ast.id.loc

        const memberExpressionProperty = SlimeAstUtil.createIdentifier('createVNode')
        memberExpressionProperty.loc = ast.id.loc

        const memberExpression = SlimeAstUtil.createMemberExpression(memberExpressionObject, memberExpressionProperty)
        memberExpression.loc = ast.id.loc

        const OvsAPICreateVNodeFirstParamsViewName = SlimeAstUtil.createStringLiteral(ast.id.name)
        OvsAPICreateVNodeFirstParamsViewName.loc = ast.id.loc

        const OvsAPICreateVNodeSecondParamsChildren = SlimeAstUtil.createArrayExpression(ast.children)

        const callExpression = SlimeAstUtil.createCallExpression(memberExpression, [OvsAPICreateVNodeFirstParamsViewName, OvsAPICreateVNodeSecondParamsChildren])
        const ReturnStatement = SlimeAstUtil.createReturnStatement(callExpression)

        ReturnStatement.loc = ast.loc
        return [ReturnStatement]
    }

    createOvsRenderDomViewDeclaratorAst(cst: SubhutiCst): SlimeExpression {
        const astName = checkCstName(cst, OvsParser.prototype.OvsRenderDomViewDeclarator.name);
        const firstChild = cst.children[0]
        if (firstChild.name === OvsParser.prototype.OvsLexicalBinding.name) {
            const ast: OvsAstLexicalBinding = {
                type: OvsParser.prototype.OvsLexicalBinding.name as any,
                id: this.createIdentifierAst(firstChild.children[0].children[0]) as any,
                init: this.createAssignmentExpressionAst(firstChild.children[1].children[1]) as any,
            }
            return ast as any
        } else {
            return this.createAssignmentExpressionAst(firstChild)
        }
    }
}

const OvsCstToSlimeAstUtil = new OvsCstToSlimeAst()
export default OvsCstToSlimeAstUtil
