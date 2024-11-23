// 1. 使用 const enum 定义类型常量
import {
    ArrayExpression,
    ArrowFunctionExpression,
    AssignmentExpression,
    AwaitExpression,
    BigIntLiteral,
    BinaryExpression,
    BindExpression,
    BooleanLiteral,
    CallExpression,
    ClassExpression,
    ConditionalExpression,
    DecimalLiteral,
    DoExpression,
    FunctionExpression,
    Identifier,
    Import,
    ImportExpression,
    JSXElement,
    JSXFragment,
    type Literal,
    LogicalExpression,
    MemberExpression,
    MetaProperty,
    ModuleExpression,
    NewExpression,
    NullLiteral,
    NumericLiteral,
    ObjectExpression,
    OptionalCallExpression,
    OptionalMemberExpression,
    ParenthesizedExpression,
    PipelineBareFunction,
    PipelinePrimaryTopicReference,
    PipelineTopicExpression,
    RecordExpression,
    RegExpLiteral,
    SequenceExpression,
    StringLiteral,
    Super,
    TaggedTemplateExpression,
    TemplateLiteral,
    ThisExpression,
    TopicReference,
    TSAsExpression,
    TSInstantiationExpression,
    TSNonNullExpression,
    TSSatisfiesExpression,
    TSTypeAssertion,
    TupleExpression,
    TypeCastExpression,
    UnaryExpression,
    UpdateExpression,
    type VariableDeclarator,
    YieldExpression
} from "@babel/types";
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



type Expression =
    ArrayExpression
    | AssignmentExpression
    | BinaryExpression
    | CallExpression
    | ConditionalExpression
    | FunctionExpression
    | Identifier
    | StringLiteral
    | NumericLiteral
    | NullLiteral
    | BooleanLiteral
    | RegExpLiteral
    | LogicalExpression
    | MemberExpression
    | NewExpression
    | ObjectExpression
    | SequenceExpression
    | ParenthesizedExpression
    | ThisExpression
    | UnaryExpression
    | UpdateExpression
    | ArrowFunctionExpression
    | ClassExpression
    | ImportExpression
    | MetaProperty
    | Super
    | TaggedTemplateExpression
    | TemplateLiteral
    | YieldExpression
    | AwaitExpression
    | Import
    | BigIntLiteral
    | OptionalMemberExpression
    | OptionalCallExpression
    | TypeCastExpression
    | JSXElement
    | JSXFragment
    | BindExpression
    | DoExpression
    | RecordExpression
    | TupleExpression
    | DecimalLiteral
    | ModuleExpression
    | TopicReference
    | PipelineTopicExpression
    | PipelineBareFunction
    | PipelinePrimaryTopicReference
    | TSInstantiationExpression
    | TSAsExpression
    | TSSatisfiesExpression
    | TSTypeAssertion
    | TSNonNullExpression;
