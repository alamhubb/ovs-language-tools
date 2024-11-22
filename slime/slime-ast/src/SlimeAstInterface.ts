// 1. 使用 const enum 定义类型常量
import {BinaryExpression, LogicalExpression} from "@babel/types";
import * as ts from 'typescript'
import {SlimeSyntaxType} from "slime-syntax/src/SlimeSyntaxType.ts";
import {SlimeTokenType} from "slime-token/src/SlimeTokenType.ts";

interface BaseNode {
    type: SlimeTokenType|SlimeSyntaxType;
}

interface SlimeVariableDeclarator extends BaseNode {
    type: SlimeSyntaxType.VariableDeclarator;
    init: SlimeLiteral
}


type SlimeLiteral = SlimeTokenType.EqToken;

