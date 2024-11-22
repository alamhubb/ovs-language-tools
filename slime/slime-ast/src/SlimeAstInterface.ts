// 1. 使用 const enum 定义类型常量
import {BinaryExpression, type Literal, LogicalExpression, type VariableDeclarator} from "@babel/types";
import * as ts from 'typescript'


export enum SlimeAstType {
    VariableDeclarator = 'VariableDeclarator',
    NumericLiteral = 'NumberLiteral',
    StringLiteral = 'StringLiteral',
    BooleanLiteral = 'BooleanLiteral',
    NullLiteral = 'NullLiteral',
    CaretEqualsToken = 'CaretEqualsToken',
}


interface BaseNode {
    type: SlimeAstType;
}

interface SlimeVariableDeclarator extends VariableDeclarator {
    type: SlimeAstType.VariableDeclarator;
    init: SlimeLiteral
}

interface SlimeCaretEqualsToken extends BaseNode {
    type: SlimeAstType.CaretEqualsToken;
}

type SlimeLiteral = Literal | SlimeCaretEqualsToken

