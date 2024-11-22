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


export interface BaseNode {
    type: SlimeAstType;
}

export interface SlimeVariableDeclarator extends VariableDeclarator {
    type: SlimeAstType.VariableDeclarator;
    init: SlimeLiteral
}

export interface SlimeCaretEqualsToken extends BaseNode {
    type: SlimeAstType.CaretEqualsToken;
}

export type SlimeLiteral = Literal | SlimeCaretEqualsToken

