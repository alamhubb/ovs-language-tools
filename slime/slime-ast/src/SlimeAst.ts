
import {
    AssignmentExpression,
    BlockStatement,
    CallExpression,
    ClassBody,
    ClassDeclaration, ClassMethod,
    Comment,
    ConditionalExpression,
    Declaration,
    Directive,
    ExportDefaultDeclaration, ExportNamedDeclaration,
    Expression,
    ExpressionStatement, FunctionDeclaration,
    FunctionExpression,
    Identifier, InterpreterDirective,
    Literal,
    MemberExpression,
    ModuleDeclaration,
    NumericLiteral,
    Node,
    Pattern,
    Program,
    File,
    SourceLocation,
    Statement, StringLiteral, TSDeclareFunction,
    VariableDeclaration,
    VariableDeclarator,
} from "@babel/types";

export class SlimeAstType {
    NumericLiteral: 'NumericLiteral' = 'NumericLiteral'
    stringLiteral: 'stringLiteral'
    booleanLiteral: 'booleanLiteral'
}

const SlimeAst: SlimeAstType = new SlimeAstType()

interface VariableDeclarator extends BaseNode {
    type: "VariableDeclarator";
    id: LVal;
    init?: Expression | null;
    definite?: boolean | null;
}



const number:NumericLiteral =

export default SlimeAst
