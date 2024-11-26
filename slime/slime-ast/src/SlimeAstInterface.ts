import type {
    ArrayExpression, ArrayPattern, ArrowFunctionExpression,
    AssignmentExpression, AssignmentOperator, AssignmentPattern, AssignmentProperty,
    AwaitExpression,
    BaseCallExpression,
    BaseFunction,
    BaseModuleDeclaration,
    BaseModuleSpecifier,
    PropertyDefinition,
    BaseNode,
    BigIntLiteral,
    BinaryExpression, BinaryOperator,
    BlockStatement, BreakStatement, CatchClause,
    ChainExpression,
    ClassBody,
    ClassDeclaration, ClassExpression,
    Comment,
    ConditionalExpression, ContinueStatement, DebuggerStatement,
    Directive, DoWhileStatement, EmptyStatement,
    ExportDefaultDeclaration,
    Expression,
    ExpressionMap, ExpressionStatement, ForInStatement, ForOfStatement, ForStatement, FunctionDeclaration,
    Identifier, IfStatement, ImportExpression, LabeledStatement,
    LogicalExpression, LogicalOperator,
    MaybeNamedClassDeclaration,
    MaybeNamedFunctionDeclaration,
    MemberExpression,
    MetaProperty,
    MethodDefinition,
    ModuleDeclaration, NewExpression, ObjectExpression, ObjectPattern,
    Pattern, PrivateIdentifier,
    Program,
    Property, RegExpLiteral, RestElement, ReturnStatement,
    SequenceExpression, SimpleCallExpression, SimpleLiteral,
    SpreadElement,
    Statement, StaticBlock, Super, SwitchCase, SwitchStatement,
    TaggedTemplateExpression, TemplateElement,
    TemplateLiteral,
    ThisExpression, ThrowStatement, TryStatement,
    UnaryExpression, UnaryOperator,
    UpdateExpression, UpdateOperator, VariableDeclarator, WhileStatement, WithStatement,
    YieldExpression, VariableDeclaration
} from "estree";

export enum SlimeAstType {
    Program = 'Program',
    VariableDeclarator = 'VariableDeclarator',
    NumberLiteral = 'NumberLiteral',
    StringLiteral = 'StringLiteral',
    BooleanLiteral = 'BooleanLiteral',
    NullLiteral = 'NullLiteral',
    CaretEqualsToken = 'CaretEqualsToken',
}

export interface SlimeNumberLiteral extends BaseNode {
    type: SlimeAstType.NumberLiteral;
    value: number;
}
