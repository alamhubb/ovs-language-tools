import type {SlimeFunctionParams, SlimeLParen, SlimeRParen, SlimeVariableDeclaration} from "./SlimeAstInterface.ts";

export enum SlimeAstType {
    Program = 'Program',
    ImportDeclaration = 'ImportDeclaration',
    ImportSpecifier = 'ImportSpecifier',
    ImportNamespaceSpecifier = 'ImportNamespaceSpecifier',
    ImportDefaultSpecifier = 'ImportDefaultSpecifier',
    FunctionParams = 'FunctionParams',
    ExportNamedDeclaration = 'ExportNamedDeclaration',
    FunctionDeclaration = 'FunctionDeclaration',
    ClassDeclaration = 'ClassDeclaration',
    ObjectExpression = 'ObjectExpression',
    Property = 'Property',
    ArgumentList = 'ArgumentList',
    ExportDefaultDeclaration = 'ExportDefaultDeclaration',
    ExportAllDeclaration = 'ExportAllDeclaration',
    MethodDefinition = 'MethodDefinition',
    ExpressionStatement = 'ExpressionStatement',
    EmptyStatement = 'EmptyStatement',
    VariableDeclaration = 'VariableDeclaration',
    SpreadElement = 'SpreadElement',
    Identifier = 'Identifier',
    PrivateIdentifier = 'PrivateIdentifier',
    ObjectPattern = 'ObjectPattern',
    ArrayPattern = 'ArrayPattern',
    RestElement = 'RestElement',
    AssignmentPattern = 'AssignmentPattern',
    MemberExpression = 'MemberExpression',
    ArrayExpression = 'ArrayExpression',
    CallExpression = 'CallExpression',
    ReturnStatement = 'ReturnStatement',
    BlockStatement = 'BlockStatement',
    FunctionExpression = 'FunctionExpression',
    VariableDeclarator = 'VariableDeclarator',
    NumericLiteral = 'NumericLiteral',
    StringLiteral = 'StringLiteral',
    BooleanLiteral = 'BooleanLiteral',
    NullLiteral = 'NullLiteral',
    EqualOperator = 'EqualOperator',
    VariableDeclarationKind = 'VariableDeclarationKind',
    From = 'From',
    Export = 'Export',
    Dot = 'Dot',
    LParen = 'LParen',
    RParen = 'RParen',
    LBrace = 'LBrace',
    RBrace = 'RBrace',
}
