import {SlimeCstToAst} from "slime-parser/src/language/SlimeCstToAstUtil.ts";
import SubhutiCst from "subhuti/src/struct/SubhutiCst.ts";
import type {SlimeExpression} from "slime-ast/src/SlimeAstInterface.ts";
import Es6Parser from "slime-parser/src/language/es2015/Es6Parser.ts";
import SubhutiLexer from "subhuti/src/parser/SubhutiLexer.ts";
import {es6Tokens} from "subhuti-ts/src/language/es2015/Es6Tokens.ts";
import OvsParser from "../parser/OvsParser.ts";
import type {CallExpression, ClassDeclaration, ExportDefaultDeclaration, Expression, Program} from "@babel/types";
import {checkCstName} from "subhuti-ts/src/language/es2015/Es6CstToEstreeAstUtil.ts";
import JsonUtil from "subhuti/src/utils/JsonUtil.ts";
import {OvsAstLexicalBinding, OvsAstRenderDomViewDeclaration} from "../interface/OvsInterface";
import BabelEstreeAstUtil from "./BabelEstreeAstUtil.ts";

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

  createOvsRenderDomViewDeclarationAst(cst: SubhutiCst): CallExpression {
    const astName = checkCstName(cst, OvsParser.prototype.OvsRenderDomViewDeclaration.name);
    JsonUtil.log(cst)
    let children = []
    if (cst.children.length > 1) {
      children = cst.children[2].children.filter(item => item.name === OvsParser.prototype.OvsRenderDomViewDeclarator.name).map(item => this.createOvsRenderDomViewDeclaratorAst(item)) as any[]
    }
    const ast: OvsAstRenderDomViewDeclaration = {
      type: astName as any,
      id: this.createIdentifierAst(cst.children[0]) as any,
      // children: cst.children[2].children.filter(item => item.name === OvsParser.prototype.OvsRenderDomViewDeclarator.name),
      children: children
      // children: this.createAssignmentExpressionAst(cst.children[2])
    } as any

    const res = BabelEstreeAstUtil.createOvsRenderDomViewDeclarationEstreeAst(ast)
    // left = this.ovsRenderDomViewDeclarationAstToEstreeAst(left)
    return res
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
