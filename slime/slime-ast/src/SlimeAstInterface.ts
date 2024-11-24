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
    VariableDeclarator = 'VariableDeclarator',
    NumericLiteral = 'NumberLiteral',
    StringLiteral = 'StringLiteral',
    BooleanLiteral = 'BooleanLiteral',
    NullLiteral = 'NullLiteral',
    CaretEqualsToken = 'CaretEqualsToken',
}

export enum SlimeProgramSourceType {
    script = 'script',
    module = 'module'
}

export interface SlimeProgram extends Program {
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

export interface SlimeDirective extends Directive {
    type: "ExpressionStatement";
    expression: SlimeLiteral;
    directive: string;
}

export interface SlimeBaseFunction extends BaseFunction {
    params: SlimePattern[];
    generator?: boolean | undefined;
    async?: boolean | undefined;
    body: SlimeBlockStatement | SlimeExpression;
}

export type SlimeFunction = SlimeFunctionDeclaration | SlimeFunctionExpression | SlimeArrowFunctionExpression;


export interface SlimeEmptyStatement extends EmptyStatement {
    type: "EmptyStatement";
}

export interface SlimeBlockStatement extends BlockStatement {
    type: "BlockStatement";
    body: SlimeStatement[];
    innerComments?: Comment[] | undefined;
}

export interface SlimeStaticBlock extends StaticBlock {
    type: "StaticBlock";
}

export interface SlimeExpressionStatement extends ExpressionStatement {
    type: "ExpressionStatement";
    expression: SlimeExpression;
}

// Statement 相关接口继续
export interface SlimeIfStatement extends IfStatement {
    type: "IfStatement";
    test: SlimeExpression;
    consequent: SlimeStatement;
    alternate?: SlimeStatement | null | undefined;
}

export interface SlimeLabeledStatement extends LabeledStatement {
    type: "LabeledStatement";
    label: SlimeIdentifier;
    body: SlimeStatement;
}

export interface SlimeBreakStatement extends BreakStatement {
    type: "BreakStatement";
    label?: SlimeIdentifier | null | undefined;
}

export interface SlimeContinueStatement extends ContinueStatement {
    type: "ContinueStatement";
    label?: SlimeIdentifier | null | undefined;
}

export interface SlimeWithStatement extends WithStatement {
    type: "WithStatement";
    object: SlimeExpression;
    body: SlimeStatement;
}

export interface SlimeSwitchStatement extends SwitchStatement {
    type: "SwitchStatement";
    discriminant: SlimeExpression;
    cases: SlimeSwitchCase[];
}

export interface SlimeReturnStatement extends ReturnStatement {
    type: "ReturnStatement";
    argument?: SlimeExpression | null | undefined;
}

export interface SlimeThrowStatement extends ThrowStatement {
    type: "ThrowStatement";
    argument: SlimeExpression;
}

export interface SlimeTryStatement extends TryStatement {
    type: "TryStatement";
    block: SlimeBlockStatement;
    handler?: SlimeCatchClause | null | undefined;
    finalizer?: SlimeBlockStatement | null | undefined;
}

export interface SlimeWhileStatement extends WhileStatement {
    type: "WhileStatement";
    test: SlimeExpression;
    body: SlimeStatement;
}

export interface SlimeDoWhileStatement extends DoWhileStatement {
    type: "DoWhileStatement";
    body: SlimeStatement;
    test: SlimeExpression;
}

export interface SlimeForStatement extends ForStatement {
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

export interface SlimeForInStatement extends ForInStatement {
    type: "ForInStatement";
}

export interface SlimeDebuggerStatement extends DebuggerStatement {
    type: "DebuggerStatement";
}

// Declaration 相关定义
export type SlimeDeclaration = SlimeFunctionDeclaration | SlimeVariableDeclaration | SlimeClassDeclaration;

export interface SlimeVariableDeclaration extends VariableDeclaration {
    type: "VariableDeclaration";
    declarations: SlimeVariableDeclarator[];
    kind: "var" | "let" | "const";
}

export interface SlimeMaybeNamedFunctionDeclaration extends MaybeNamedFunctionDeclaration {
    type: "FunctionDeclaration";
    id: SlimeIdentifier | null;
    body: SlimeBlockStatement;
}

export interface SlimeFunctionDeclaration extends FunctionDeclaration {
    id: SlimeIdentifier;
}

export interface SlimeVariableDeclarator extends VariableDeclarator {
    type: "VariableDeclarator";
    id: SlimePattern;
    init?: SlimeExpression | null | undefined;
}

// Expression 相关定义
export interface SlimeExpressionMap extends ExpressionMap {
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

export interface SlimeChainExpression extends ChainExpression {
    type: "ChainExpression";
    expression: SlimeChainElement;
}

export interface SlimeThisExpression extends ThisExpression {
    type: "ThisExpression";
}

export interface SlimeArrayExpression extends ArrayExpression {
    type: "ArrayExpression";
    elements: Array<SlimeExpression | SlimeSpreadElement | null>;
}

export interface SlimeObjectExpression extends ObjectExpression {
    type: "ObjectExpression";
    properties: Array<SlimeProperty | SlimeSpreadElement>;
}

export interface SlimePrivateIdentifier extends PrivateIdentifier {
    type: "PrivateIdentifier";
    name: string;
}

export interface SlimeProperty extends Property {
    type: "Property";
    key: SlimeExpression | SlimePrivateIdentifier;
    value: SlimeExpression | SlimePattern;
    kind: "init" | "get" | "set";
    method: boolean;
    shorthand: boolean;
    computed: boolean;
}

export interface SlimePropertyDefinition extends PropertyDefinition {
    type: "PropertyDefinition";
    key: SlimeExpression | SlimePrivateIdentifier;
    value?: SlimeExpression | null | undefined;
    computed: boolean;
    static: boolean;
}

export interface SlimeFunctionExpression extends SlimeBaseFunction {
    type: "FunctionExpression";
    id?: SlimeIdentifier | null | undefined;
    body: SlimeBlockStatement;
}

export interface SlimeSequenceExpression extends SequenceExpression {
    type: "SequenceExpression";
    expressions: SlimeExpression[];
}

export interface SlimeUnaryExpression extends UnaryExpression {
    type: "UnaryExpression";
    operator: UnaryOperator;
    prefix: true;
    argument: SlimeExpression;
}

export interface SlimeBinaryExpression extends BinaryExpression {
    type: "BinaryExpression";
    operator: BinaryOperator;
    left: SlimeExpression | SlimePrivateIdentifier;
    right: SlimeExpression;
}

// Expression 相关接口继续
export interface SlimeAssignmentExpression extends AssignmentExpression {
    type: "AssignmentExpression";
    operator: AssignmentOperator;
    left: SlimePattern | SlimeMemberExpression;
    right: SlimeExpression;
}

export interface SlimeUpdateExpression extends UpdateExpression {
    type: "UpdateExpression";
    operator: UpdateOperator;
    argument: SlimeExpression;
    prefix: boolean;
}

export interface SlimeLogicalExpression extends LogicalExpression {
    type: "LogicalExpression";
    operator: LogicalOperator;
    left: SlimeExpression;
    right: SlimeExpression;
}

export interface SlimeConditionalExpression extends ConditionalExpression {
    type: "ConditionalExpression";
    test: SlimeExpression;
    alternate: SlimeExpression;
    consequent: SlimeExpression;
}

export interface SlimeBaseCallExpression extends BaseCallExpression {
    callee: SlimeExpression | SlimeSuper;
    arguments: Array<SlimeExpression | SlimeSpreadElement>;
}

export type SlimeCallExpression = SlimeSimpleCallExpression | SlimeNewExpression;

export interface SlimeSimpleCallExpression extends SimpleCallExpression {
    type: "CallExpression";
    optional: boolean;
}

export interface SlimeNewExpression extends NewExpression {
    type: "NewExpression";
}


export interface SlimeMemberExpression extends MemberExpression {
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
export interface SlimeSwitchCase extends SwitchCase {
    type: "SwitchCase";
    test?: SlimeExpression | null | undefined;
    consequent: SlimeStatement[];
}

export interface SlimeCatchClause extends CatchClause {
    type: "CatchClause";
    param: SlimePattern | null;
    body: SlimeBlockStatement;
}

export interface SlimeIdentifier extends Identifier {
    type: "Identifier";
    name: string;
}

// Literal 相关定义
export type SlimeLiteral = SlimeSimpleLiteral | SlimeRegExpLiteral | SlimeBigIntLiteral;

export interface SlimeSimpleLiteral extends SimpleLiteral {
    type: "Literal";
    value: string | boolean | number | null;
    raw?: string | undefined;
}


export interface SlimeRegExpLiteral extends RegExpLiteral {
    type: "Literal";
    value?: RegExp | null | undefined;
    regex: {
        pattern: string;
        flags: string;
    };
    raw?: string | undefined;
}

export interface SlimeBigIntLiteral extends BigIntLiteral {
    type: "Literal";
    value?: bigint | null | undefined;
    bigint: string;
    raw?: string | undefined;
}

// ForOfStatement 和其他类型定义
export interface SlimeForOfStatement extends ForOfStatement {
    type: "ForOfStatement";
    await: boolean;
}

export interface SlimeSuper extends Super {
    type: "Super";
}

export interface SlimeSpreadElement extends SpreadElement {
    type: "SpreadElement";
    argument: SlimeExpression;
}

export interface SlimeArrowFunctionExpression extends ArrowFunctionExpression {
    type: "ArrowFunctionExpression";
    expression: boolean;
    body: SlimeBlockStatement | SlimeExpression;
}

export interface SlimeYieldExpression extends YieldExpression {
    type: "YieldExpression";
    argument?: SlimeExpression | null | undefined;
    delegate: boolean;
}

// Template 相关定义
export interface SlimeTemplateLiteral extends TemplateLiteral {
    type: "TemplateLiteral";
    quasis: SlimeTemplateElement[];
    expressions: SlimeExpression[];
}

export interface SlimeTaggedTemplateExpression extends TaggedTemplateExpression {
    type: "TaggedTemplateExpression";
    tag: SlimeExpression;
    quasi: SlimeTemplateLiteral;
}

export interface SlimeTemplateElement extends TemplateElement {
    type: "TemplateElement";
    tail: boolean;
    value: {
        cooked?: string | null | undefined;
        raw: string;
    };
}

// Pattern 相关定义
export interface SlimeAssignmentProperty extends AssignmentProperty {
    value: SlimePattern;
    kind: "init";
    method: false;
}

export interface SlimeObjectPattern extends ObjectPattern {
    type: "ObjectPattern";
    properties: Array<SlimeAssignmentProperty | SlimeRestElement>;
}

export interface SlimeArrayPattern extends ArrayPattern {
    type: "ArrayPattern";
    elements: Array<SlimePattern | null>;
}

export interface SlimeRestElement extends RestElement {
    type: "RestElement";
    argument: SlimePattern;
}

export interface SlimeAssignmentPattern extends AssignmentPattern {
    type: "AssignmentPattern";
    left: SlimePattern;
    right: SlimeExpression;
}

// Class 相关定义
export type SlimeClass = SlimeClassDeclaration | SlimeClassExpression;


export interface SlimeClassBody extends ClassBody {
    type: "ClassBody";
    body: Array<SlimeMethodDefinition | SlimePropertyDefinition | SlimeStaticBlock>;
}

// 你的自定义扩展
export interface SlimeMethodDefinition extends MethodDefinition {
    type: "MethodDefinition";
    key: Expression | PrivateIdentifier;
    value: SlimeFunctionExpression;
    kind: "constructor" | "method" | "get" | "set";
    computed: boolean;
    static: boolean;
}

export interface SlimeMaybeNamedClassDeclaration extends MaybeNamedClassDeclaration {
    type: "ClassDeclaration";
    id: SlimeIdentifier | null;
}

export interface SlimeClassDeclaration extends ClassDeclaration {
    class: BaseNode;
}

export interface SlimeClassExpression extends ClassExpression {
    type: "ClassExpression";
    id?: SlimeIdentifier | null | undefined;
}

// Meta 和 Module 相关定义
export interface SlimeMetaProperty extends MetaProperty {
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

export interface SlimeBaseModuleDeclaration extends BaseModuleDeclaration {
}

export type SlimeModuleSpecifier =
    | SlimeImportSpecifier
    | SlimeImportDefaultSpecifier
    | SlimeImportNamespaceSpecifier
    | SlimeExportSpecifier;

export interface SlimeBaseModuleSpecifier extends BaseModuleSpecifier {
    local: SlimeIdentifier;
}

export interface SlimeImportDeclaration extends BaseModuleDeclaration {
    type: "ImportDeclaration";
    specifiers: Array<SlimeImportSpecifier | SlimeImportDefaultSpecifier | SlimeImportNamespaceSpecifier>;
    source: SlimeLiteral;
}

export interface SlimeImportSpecifier extends SlimeBaseModuleSpecifier {
    type: "ImportSpecifier";
    imported: SlimeIdentifier | SlimeLiteral;
}

export interface SlimeImportExpression extends ImportExpression {
    type: "ImportExpression";
    source: SlimeExpression;
}

export interface SlimeImportDefaultSpecifier extends SlimeBaseModuleSpecifier {
    type: "ImportDefaultSpecifier";
}

export interface SlimeImportNamespaceSpecifier extends SlimeBaseModuleSpecifier {
    type: "ImportNamespaceSpecifier";
}

// Export 相关定义
export interface SlimeExportNamedDeclaration extends BaseModuleDeclaration {
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

export interface SlimeExportDefaultDeclaration extends ExportDefaultDeclaration, SlimeBaseModuleDeclaration {
    type: "ExportDefaultDeclaration";
    declaration: SlimeMaybeNamedFunctionDeclaration | SlimeMaybeNamedClassDeclaration | SlimeExpression;
    export: BaseNode;
    default: BaseNode;
}

export interface SlimeExportAllDeclaration extends BaseModuleDeclaration {
    type: "ExportAllDeclaration";
    exported: SlimeIdentifier | SlimeLiteral | null;
    source: SlimeLiteral;
}

export interface SlimeAwaitExpression extends AwaitExpression {
    type: "AwaitExpression";
    argument: SlimeExpression;
}
