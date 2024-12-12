import type {SlimeEqualOperator} from "./SlimeAstInterface.ts";

export enum SlimeAstType {
    Program = 'Program',
    MethodDefinition = 'MethodDefinition',
    ExpressionStatement = 'ExpressionStatement',
    EmptyStatement = 'EmptyStatement',
    VariableDeclaration = 'VariableDeclaration',
    Identifier = 'Identifier',
    ObjectPattern = 'ObjectPattern',
    ArrayPattern = 'ArrayPattern',
    RestElement = 'RestElement',
    AssignmentPattern = 'AssignmentPattern',
    MemberExpression = 'MemberExpression',
    VariableDeclarator = 'VariableDeclarator',
    NumberLiteral = 'NumberLiteral',
    StringLiteral = 'StringLiteral',
    BooleanLiteral = 'BooleanLiteral',
    NullLiteral = 'NullLiteral',
    EqualOperator = 'EqualOperator',
}
