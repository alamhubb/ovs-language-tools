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

// 自定义声明类型
export interface SlimeRenderDomViewDeclaration {
    type: "OvsRenderDomViewDeclaration";
    id: SlimeIdentifier;
    children: SlimeRenderDomViewDeclaration[];
    arguments: SlimeExpression[];
}

export interface SlimeLexicalBinding {
    type: "OvsLexicalBinding";
    id: SlimeIdentifier;
    init?: SlimeExpression | null | undefined;
}

export enum SlimeAstType {
    Program = 'Program',
    ExpressionStatement = 'ExpressionStatement',
    EmptyStatement = 'EmptyStatement',
    VariableDeclarator = 'VariableDeclarator',
    NumberLiteral = 'NumberLiteral',
    StringLiteral = 'StringLiteral',
    BooleanLiteral = 'BooleanLiteral',
    NullLiteral = 'NullLiteral',
    CaretEqualsToken = 'CaretEqualsToken',
}

export enum SlimeProgramSourceType {
    script = 'script',
    module = 'module'
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
    type: string
    loc?: SlimeSourceLocation | null | undefined;
}

export interface SlimeProgram extends SlimeBaseNode {
    type: SlimeAstType.Program;
    sourceType: SlimeProgramSourceType;
    body: Array<SlimeDirective | SlimeStatement | SlimeModuleDeclaration>;
}

export interface SlimeSourceLocation {
    source?: string | null | undefined;
    start: SlimePosition;
    end: SlimePosition;
}

export interface SlimePosition {
    line: number;
    column: number;
}

export interface SlimeDirective extends SlimeBaseNode {
    type: SlimeAstType.ExpressionStatement;
    expression: SlimeLiteral;
    directive: string;
}

export interface SlimeBaseFunction extends SlimeBaseNode {
    params: SlimePattern[];
    generator?: boolean | undefined;
    async?: boolean | undefined;
    body: SlimeBlockStatement | SlimeExpression;
}

export type SlimeFunction = SlimeFunctionDeclaration | SlimeFunctionExpression | SlimeArrowFunctionExpression;


export interface SlimeEmptyStatement extends SlimeBaseNode {
    type: "EmptyStatement";
}

export interface SlimeBlockStatement extends SlimeBaseNode {
    type: "BlockStatement";
    body: SlimeStatement[];
    innerComments?: Comment[] | undefined;
}

export interface SlimeStaticBlock extends SlimeBaseNode {
    type: "StaticBlock";
}

export interface SlimeExpressionStatement extends SlimeBaseNode {
    type: "ExpressionStatement";
    expression: SlimeExpression;
}

// Statement 相关接口继续
export interface SlimeIfStatement extends SlimeBaseNode {
    type: "IfStatement";
    test: SlimeExpression;
    consequent: SlimeStatement;
    alternate?: SlimeStatement | null | undefined;
}

export interface SlimeLabeledStatement extends SlimeBaseNode {
    type: "LabeledStatement";
    label: SlimeIdentifier;
    body: SlimeStatement;
}

export interface SlimeBreakStatement extends SlimeBaseNode {
    type: "BreakStatement";
    label?: SlimeIdentifier | null | undefined;
}

export interface SlimeContinueStatement extends SlimeBaseNode {
    type: "ContinueStatement";
    label?: SlimeIdentifier | null | undefined;
}

export interface SlimeWithStatement extends SlimeBaseNode {
    type: "WithStatement";
    object: SlimeExpression;
    body: SlimeStatement;
}

export interface SlimeSwitchStatement extends SlimeBaseNode {
    type: "SwitchStatement";
    discriminant: SlimeExpression;
    cases: SlimeSwitchCase[];
}

export interface SlimeReturnStatement extends SlimeBaseNode {
    type: "ReturnStatement";
    argument?: SlimeExpression | null | undefined;
}

export interface SlimeThrowStatement extends SlimeBaseNode {
    type: "ThrowStatement";
    argument: SlimeExpression;
}

export interface SlimeTryStatement extends SlimeBaseNode {
    type: "TryStatement";
    block: SlimeBlockStatement;
    handler?: SlimeCatchClause | null | undefined;
    finalizer?: SlimeBlockStatement | null | undefined;
}

export interface SlimeWhileStatement extends SlimeBaseNode {
    type: "WhileStatement";
    test: SlimeExpression;
    body: SlimeStatement;
}

export interface SlimeDoWhileStatement extends SlimeBaseNode {
    type: "DoWhileStatement";
    body: SlimeStatement;
    test: SlimeExpression;
}

export interface SlimeForStatement extends SlimeBaseNode {
    type: "ForStatement";
    init?: VariableDeclaration | Expression | null | undefined;
    test?: Expression | null | undefined;
    update?: Expression | null | undefined;
    body: Statement;
}

export type SlimeStatement =
    | SlimeExpressionStatement
    | SlimeBlockStatement
    | SlimeStaticBlock
    | SlimeEmptyStatement
    | SlimeDebuggerStatement
    | SlimeWithStatement
    | SlimeReturnStatement
    | SlimeLabeledStatement
    | SlimeBreakStatement
    | SlimeContinueStatement
    | SlimeIfStatement
    | SlimeSwitchStatement
    | SlimeThrowStatement
    | SlimeTryStatement
    | SlimeWhileStatement
    | SlimeDoWhileStatement
    | SlimeForStatement
    | SlimeForInStatement
    | SlimeForOfStatement
    | SlimeDeclaration;

export interface SlimeForInStatement extends SlimeBaseNode {
    type: "ForInStatement";
}

export interface SlimeDebuggerStatement extends SlimeBaseNode {
    type: "DebuggerStatement";
}

// Declaration 相关定义
export type SlimeDeclaration = SlimeFunctionDeclaration | SlimeVariableDeclaration | SlimeClassDeclaration;

export interface SlimeVariableDeclaration extends SlimeBaseNode {
    type: "VariableDeclaration";
    declarations: SlimeVariableDeclarator[];
    kind: "var" | "let" | "const";
}

export interface SlimeMaybeNamedFunctionDeclaration extends SlimeBaseNode {
    type: "FunctionDeclaration";
    id: SlimeIdentifier | null;
    body: SlimeBlockStatement;
}

export interface SlimeFunctionDeclaration extends SlimeBaseNode {
    id: SlimeIdentifier;
}

export interface SlimeVariableDeclarator extends SlimeBaseNode {
    type: "VariableDeclarator";
    id: SlimePattern;
    init?: SlimeExpression | null | undefined;
}

// Expression 相关定义
export interface SlimeExpressionMap extends SlimeBaseNode {
    ArrayExpression: SlimeArrayExpression;
    ArrowFunctionExpression: SlimeArrowFunctionExpression;
    AssignmentExpression: SlimeAssignmentExpression;
    AwaitExpression: SlimeAwaitExpression;
    BinaryExpression: SlimeBinaryExpression;
    CallExpression: SlimeCallExpression;
    ChainExpression: SlimeChainExpression;
    ClassExpression: SlimeClassExpression;
    ConditionalExpression: SlimeConditionalExpression;
    FunctionExpression: SlimeFunctionExpression;
    Identifier: SlimeIdentifier;
    ImportExpression: SlimeImportExpression;
    Literal: SlimeLiteral;
    LogicalExpression: SlimeLogicalExpression;
    MemberExpression: SlimeMemberExpression;
    MetaProperty: SlimeMetaProperty;
    NewExpression: SlimeNewExpression;
    ObjectExpression: SlimeObjectExpression;
    SequenceExpression: SlimeSequenceExpression;
    TaggedTemplateExpression: SlimeTaggedTemplateExpression;
    TemplateLiteral: SlimeTemplateLiteral;
    ThisExpression: SlimeThisExpression;
    UnaryExpression: SlimeUnaryExpression;
    UpdateExpression: SlimeUpdateExpression;
    YieldExpression: SlimeYieldExpression;
}

export type SlimeExpression = SlimeExpressionMap[keyof SlimeExpressionMap];

// Expression 相关接口继续
export type SlimeChainElement = SlimeSimpleCallExpression | SlimeMemberExpression;

export interface SlimeChainExpression extends SlimeBaseNode {
    type: "ChainExpression";
    expression: SlimeChainElement;
}

export interface SlimeThisExpression extends SlimeBaseNode {
    type: "ThisExpression";
}

export interface SlimeArrayExpression extends SlimeBaseNode {
    type: "ArrayExpression";
    elements: Array<SlimeExpression | SlimeSpreadElement | null>;
}

export interface SlimeObjectExpression extends SlimeBaseNode {
    type: "ObjectExpression";
    properties: Array<SlimeProperty | SlimeSpreadElement>;
}

export interface SlimePrivateIdentifier extends SlimeBaseNode {
    type: "PrivateIdentifier";
    name: string;
}

export interface SlimeProperty extends SlimeBaseNode {
    type: "Property";
    key: SlimeExpression | SlimePrivateIdentifier;
    value: SlimeExpression | SlimePattern;
    kind: "init" | "get" | "set";
    method: boolean;
    shorthand: boolean;
    computed: boolean;
}

export interface SlimePropertyDefinition extends SlimeBaseNode {
    type: "PropertyDefinition";
    key: SlimeExpression | SlimePrivateIdentifier;
    value?: SlimeExpression | null | undefined;
    computed: boolean;
    static: boolean;
}

export interface SlimeFunctionExpression extends SlimeBaseNode {
    type: "FunctionExpression";
    id?: SlimeIdentifier | null | undefined;
    body: SlimeBlockStatement;
}

export interface SlimeSequenceExpression extends SlimeBaseNode {
    type: "SequenceExpression";
    expressions: SlimeExpression[];
}

export interface SlimeUnaryExpression extends SlimeBaseNode {
    type: "UnaryExpression";
    operator: UnaryOperator;
    prefix: true;
    argument: SlimeExpression;
}

export interface SlimeBinaryExpression extends SlimeBaseNode {
    type: "BinaryExpression";
    operator: BinaryOperator;
    left: SlimeExpression | SlimePrivateIdentifier;
    right: SlimeExpression;
}

// Expression 相关接口继续
export interface SlimeAssignmentExpression extends SlimeBaseNode {
    type: "AssignmentExpression";
    operator: AssignmentOperator;
    left: SlimePattern | SlimeMemberExpression;
    right: SlimeExpression;
}

export interface SlimeUpdateExpression extends SlimeBaseNode {
    type: "UpdateExpression";
    operator: UpdateOperator;
    argument: SlimeExpression;
    prefix: boolean;
}

export interface SlimeLogicalExpression extends SlimeBaseNode {
    type: "LogicalExpression";
    operator: LogicalOperator;
    left: SlimeExpression;
    right: SlimeExpression;
}

export interface SlimeConditionalExpression extends SlimeBaseNode {
    type: "ConditionalExpression";
    test: SlimeExpression;
    alternate: SlimeExpression;
    consequent: SlimeExpression;
}

export interface SlimeBaseCallExpression extends SlimeBaseNode {
    callee: SlimeExpression | SlimeSuper;
    arguments: Array<SlimeExpression | SlimeSpreadElement>;
}

export type SlimeCallExpression = SlimeSimpleCallExpression | SlimeNewExpression;

export interface SlimeSimpleCallExpression extends SlimeBaseNode {
    type: "CallExpression";
    optional: boolean;
}

export interface SlimeNewExpression extends SlimeBaseNode {
    type: "NewExpression";
}


export interface SlimeMemberExpression extends SlimeBaseNode {
    type: "MemberExpression";
    object: SlimeExpression | SlimeSuper;
    property: SlimeExpression | SlimePrivateIdentifier;
    computed: boolean;
    optional: boolean;
}

// Pattern 相关定义
export type SlimePattern = Pattern & (
    | SlimeIdentifier
    | SlimeObjectPattern
    | SlimeArrayPattern
    | SlimeRestElement
    | SlimeAssignmentPattern
    | SlimeMemberExpression
    )

// 其他节点类型定义
export interface SlimeSwitchCase extends SlimeBaseNode {
    type: "SwitchCase";
    test?: SlimeExpression | null | undefined;
    consequent: SlimeStatement[];
}

export interface SlimeCatchClause extends SlimeBaseNode {
    type: "CatchClause";
    param: SlimePattern | null;
    body: SlimeBlockStatement;
}

export interface SlimeIdentifier extends SlimeBaseNode {
    type: "Identifier";
    name: string;
}

// Literal 相关定义
export type SlimeLiteral =
    SlimeNumberLiteral
    | SlimeStringLiteral
    | SlimeBooleanLiteral
    | SlimeNullLiteral
    | SlimeRegExpLiteral
    | SlimeBigIntLiteral
    | SimpleLiteral

export interface SlimeNumberLiteral extends SlimeBaseNode {
    type: SlimeAstType.NumberLiteral;
    value: number;
}

export interface SlimeStringLiteral extends SlimeBaseNode {
    type: SlimeAstType.StringLiteral;
    value: string;
}

export interface SlimeBooleanLiteral extends SlimeBaseNode {
    type: SlimeAstType.BooleanLiteral;
    value: boolean;
}

export interface SlimeNullLiteral extends SlimeBaseNode {
    type: SlimeAstType.NullLiteral;
    value: null;
}


export interface SlimeRegExpLiteral extends SlimeBaseNode {
    type: "Literal";
    value?: RegExp | null | undefined;
    regex: {
        pattern: string;
        flags: string;
    };
    raw?: string | undefined;
}

export interface SlimeBigIntLiteral extends SlimeBaseNode {
    type: "Literal";
    value?: bigint | null | undefined;
    bigint: string;
    raw?: string | undefined;
}

// ForOfStatement 和其他类型定义
export interface SlimeForOfStatement extends SlimeBaseNode {
    type: "ForOfStatement";
    await: boolean;
}

export interface SlimeSuper extends SlimeBaseNode {
    type: "Super";
}

export interface SlimeSpreadElement extends SlimeBaseNode {
    type: "SpreadElement";
    argument: SlimeExpression;
}

export interface SlimeArrowFunctionExpression extends SlimeBaseNode {
    type: "ArrowFunctionExpression";
    expression: boolean;
    body: SlimeBlockStatement | SlimeExpression;
}

export interface SlimeYieldExpression extends SlimeBaseNode {
    type: "YieldExpression";
    argument?: SlimeExpression | null | undefined;
    delegate: boolean;
}

// Template 相关定义
export interface SlimeTemplateLiteral extends SlimeBaseNode {
    type: "TemplateLiteral";
    quasis: SlimeTemplateElement[];
    expressions: SlimeExpression[];
}

export interface SlimeTaggedTemplateExpression extends SlimeBaseNode {
    type: "TaggedTemplateExpression";
    tag: SlimeExpression;
    quasi: SlimeTemplateLiteral;
}

export interface SlimeTemplateElement extends SlimeBaseNode {
    type: "TemplateElement";
    tail: boolean;
    value: {
        cooked?: string | null | undefined;
        raw: string;
    };
}

// Pattern 相关定义
export interface SlimeAssignmentProperty extends SlimeBaseNode {
    value: SlimePattern;
    kind: "init";
    method: false;
}

export interface SlimeObjectPattern extends SlimeBaseNode {
    type: "ObjectPattern";
    properties: Array<SlimeAssignmentProperty | SlimeRestElement>;
}

export interface SlimeArrayPattern extends SlimeBaseNode {
    type: "ArrayPattern";
    elements: Array<SlimePattern | null>;
}

export interface SlimeRestElement extends SlimeBaseNode {
    type: "RestElement";
    argument: SlimePattern;
}

export interface SlimeAssignmentPattern extends SlimeBaseNode {
    type: "AssignmentPattern";
    left: SlimePattern;
    right: SlimeExpression;
}

// Class 相关定义
export type SlimeClass = SlimeClassDeclaration | SlimeClassExpression;


export interface SlimeClassBody extends SlimeBaseNode {
    type: "ClassBody";
    body: Array<SlimeMethodDefinition | SlimePropertyDefinition | SlimeStaticBlock>;
}

// 你的自定义扩展
export interface SlimeMethodDefinition extends SlimeBaseNode {
    type: "MethodDefinition";
    key: Expression | PrivateIdentifier;
    value: SlimeFunctionExpression;
    kind: "constructor" | "method" | "get" | "set";
    computed: boolean;
    static: boolean;
}

export interface SlimeMaybeNamedClassDeclaration extends SlimeBaseNode {
    type: "ClassDeclaration";
    id: SlimeIdentifier | null;
}

export interface SlimeClassDeclaration extends SlimeBaseNode {
    class: BaseNode;
}

export interface SlimeClassExpression extends SlimeBaseNode {
    type: "ClassExpression";
    id?: SlimeIdentifier | null | undefined;
}

// Meta 和 Module 相关定义
export interface SlimeMetaProperty extends SlimeBaseNode {
    type: "MetaProperty";
    meta: SlimeIdentifier;
    property: SlimeIdentifier;
}

export type SlimeModuleDeclaration = ModuleDeclaration & (
    | SlimeImportDeclaration
    | SlimeExportNamedDeclaration
    | SlimeExportDefaultDeclaration
    | SlimeExportAllDeclaration
    );

export interface SlimeBaseModuleDeclaration extends SlimeBaseNode {
}

export type SlimeModuleSpecifier =
    | SlimeImportSpecifier
    | SlimeImportDefaultSpecifier
    | SlimeImportNamespaceSpecifier
    | SlimeExportSpecifier;

export interface SlimeBaseModuleSpecifier extends SlimeBaseNode {
    local: SlimeIdentifier;
}

export interface SlimeImportDeclaration extends SlimeBaseNode {
    type: "ImportDeclaration";
    specifiers: Array<SlimeImportSpecifier | SlimeImportDefaultSpecifier | SlimeImportNamespaceSpecifier>;
    source: SlimeLiteral;
}

export interface SlimeImportSpecifier extends SlimeBaseNode {
    type: "ImportSpecifier";
    imported: SlimeIdentifier | SlimeLiteral;
}

export interface SlimeImportExpression extends SlimeBaseNode {
    type: "ImportExpression";
    source: SlimeExpression;
}

export interface SlimeImportDefaultSpecifier extends SlimeBaseNode {
    type: "ImportDefaultSpecifier";
}

export interface SlimeImportNamespaceSpecifier extends SlimeBaseNode {
    type: "ImportNamespaceSpecifier";
}

// Export 相关定义
export interface SlimeExportNamedDeclaration extends SlimeBaseNode {
    type: "ExportNamedDeclaration";
    declaration?: SlimeDeclaration | null | undefined;
    specifiers: SlimeExportSpecifier[];
    source?: SlimeLiteral | null | undefined;
}

export interface SlimeExportSpecifier extends Omit<SlimeBaseModuleSpecifier, "local"> {
    type: "ExportSpecifier";
    local: SlimeIdentifier | SlimeLiteral;
    exported: SlimeIdentifier | SlimeLiteral;
}

export interface SlimeExportDefaultDeclaration extends SlimeBaseModuleDeclaration {
    type: "ExportDefaultDeclaration";
    declaration: SlimeMaybeNamedFunctionDeclaration | SlimeMaybeNamedClassDeclaration | SlimeExpression;
    export: BaseNode;
    default: BaseNode;
}

export interface SlimeExportAllDeclaration extends SlimeBaseNode {
    type: "ExportAllDeclaration";
    exported: SlimeIdentifier | SlimeLiteral | null;
    source: SlimeLiteral;
}

export interface SlimeAwaitExpression extends SlimeBaseNode {
    type: "AwaitExpression";
    argument: SlimeExpression;
}
