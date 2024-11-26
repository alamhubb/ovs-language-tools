export enum SlimeAstType {
    Program = 'Program',
    VariableDeclarator = 'VariableDeclarator',
    NumberLiteral = 'NumberLiteral',
    StringLiteral = 'StringLiteral',
    BooleanLiteral = 'BooleanLiteral',
    NullLiteral = 'NullLiteral',
    CaretEqualsToken = 'CaretEqualsToken',
}

export interface SlimePosition {
    /** >= 1 */
    line: number;
    /** >= 0 */
    column: number;
}

export interface SlimeSourceLocation {
    start: SlimePosition;
    end: SlimePosition;
}

export interface SlimeBaseNode {
    type: string;
    loc?: SlimeSourceLocation | null | undefined;
}


export type SlimeLiteral = SlimeNumberLiteral | SlimeStringLiteral


export interface SlimeNumberLiteral extends SlimeBaseNode {
    type: SlimeAstType.NumberLiteral;
    value: number;
}

export interface SlimeStringLiteral extends SlimeBaseNode {
    type: SlimeAstType.StringLiteral;
    value: string;
}

export interface SlimeCaretEqualsToken extends SlimeBaseNode {
    type: SlimeAstType.CaretEqualsToken;
}

