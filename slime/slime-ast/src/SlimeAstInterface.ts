// 1. 使用 const enum 定义类型常量
import {BinaryExpression, LogicalExpression} from "@babel/types";
import * as ts from 'typescript'

const enum SlimeAstType {
    EqToken = 'EqToken',

    VariableDeclarator = 'VariableDeclarator',
    NumericLiteral = 'NumericLiteral',
    StringLiteral = 'StringLiteral',
    BooleanLiteral = 'BooleanLiteral',
    Initializer = 'Initializer'
}

interface BaseNode {
    type: SlimeAstType;
}

interface SlimeVariableDeclarator extends BaseNode {
    type: SlimeAstType.VariableDeclarator;
    init: SlimeLiteral
}

interface SlimeEqToken extends BaseNode {
    type: SlimeAstType.EqToken;
}

type SlimeLiteral = SlimeEqToken;


