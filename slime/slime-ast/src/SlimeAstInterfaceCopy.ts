// This definition file follows a somewhat unusual format. ESTree allows
// runtime type checks based on the `type` parameter. In order to explain this
// to typescript we want to use discriminated union types:
// https://github.com/Microsoft/TypeScript/pull/9163
//
// For ESTree this is a bit tricky because the high level interfaces like
// Node or Function are pulling double duty. We want to pass common fields down
// to the interfaces that extend them (like Identifier or
// ArrowFunctionExpression), but you can't extend a type union or enforce
// common fields on them. So we've split the high level interfaces into two
// types, a base type which passes down inherited fields, and a type union of
// all types which extend the base type. Only the type union is exported, and
// the union is how other types refer to the collection of inheriting types.
//
// This makes the definitions file here somewhat more difficult to maintain,
// but it has the notable advantage of making ESTree much easier to use as
// an end user.


export interface SlimeBaseNodeWithoutComments {
    // Every leaf interface Slimethat extends SlimeBaseNode must specify a type property.
    // The type property should be a string literal. For example, Identifier
    // has: Slime`type: "Identifier"`
    type: string;
    loc?: SlimeSourceLocation | null | undefined;
    range?: [number, number] | undefined;
}

export interface SlimeBaseNode extends SlimeBaseNodeWithoutComments {
    leadingComments?: SlimeComment[] | undefined;
    trailingComments?: SlimeComment[] | undefined;
}

export interface SlimeNodeMap {
    AssignmentProperty: SlimeAssignmentProperty;
    CatchClause: SlimeCatchClause;
    Class: SlimeClass;
    ClassBody: SlimeClassBody;
    Expression: SlimeExpression;
    Function: Function;
    Identifier: SlimeIdentifier;
    Literal: SlimeLiteral;
    MethodDefinition: SlimeMethodDefinition;
    ModuleDeclaration: SlimeModuleDeclaration;
    ModuleSpecifier: SlimeModuleSpecifier;
    Pattern: SlimePattern;
    PrivateIdentifier: SlimePrivateIdentifier;
    Program: SlimeProgram;
    Property: SlimeProperty;
    PropertyDefinition: SlimePropertyDefinition;
    SpreadElement: SlimeSpreadElement;
    Statement: SlimeStatement;
    Super: SlimeSuper;
    SwitchCase: SlimeSwitchCase;
    TemplateElement: SlimeTemplateElement;
    VariableDeclarator: SlimeVariableDeclarator;
}

export type SlimeNode = SlimeNodeMap[keyof SlimeNodeMap];

export interface SlimeComment extends SlimeBaseNodeWithoutComments {
    type: "Line" | "Block";
    value: string;
}

export interface SlimeSourceLocation {
    source?: string | null | undefined;
    start: SlimePosition;
    end: SlimePosition;
}

export interface SlimePosition {
    /** >= Slime1 */
    line: number;
    /** >= Slime0 */
    column: number;
}

export interface SlimeProgram extends SlimeBaseNode {
    type: "Program";
    sourceType: "script" | "module";
    body: Array<SlimeDirective | SlimeStatement | SlimeModuleDeclaration>;
    comments?: SlimeComment[] | undefined;
}

export interface SlimeDirective extends SlimeBaseNode {
    type: "ExpressionStatement";
    expression: SlimeLiteral;
    directive: string;
}

export interface SlimeBaseFunction extends SlimeBaseNode {
    params: SlimePattern[];
    generator?: boolean | undefined;
    async?: boolean | undefined;
    // The body is either BlockStatement or Expression because arrow functions
    // can have a body that's either. FunctionDeclarations and
    // FunctionExpressions have only BlockStatement bodies.
    body: SlimeBlockStatement | SlimeExpression;
}

export type SlimeFunction = SlimeFunctionDeclaration | SlimeFunctionExpression | SlimeArrowFunctionExpression;

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

export interface SlimeBaseStatement extends SlimeBaseNode {
}

export interface SlimeEmptyStatement extends SlimeBaseStatement {
    type: "EmptyStatement";
}

export interface SlimeBlockStatement extends SlimeBaseStatement {
    type: "BlockStatement";
    body: SlimeStatement[];
    innerComments?: SlimeComment[] | undefined;
}

export interface SlimeStaticBlock extends Omit<SlimeBlockStatement, "type"> {
    type: "StaticBlock";
}

export interface SlimeExpressionStatement extends SlimeBaseStatement {
    type: "ExpressionStatement";
    expression: SlimeExpression;
}

export interface SlimeIfStatement extends SlimeBaseStatement {
    type: "IfStatement";
    test: SlimeExpression;
    consequent: SlimeStatement;
    alternate?: SlimeStatement | null | undefined;
}

export interface SlimeLabeledStatement extends SlimeBaseStatement {
    type: "LabeledStatement";
    label: SlimeIdentifier;
    body: SlimeStatement;
}

export interface SlimeBreakStatement extends SlimeBaseStatement {
    type: "BreakStatement";
    label?: SlimeIdentifier | null | undefined;
}

export interface SlimeContinueStatement extends SlimeBaseStatement {
    type: "ContinueStatement";
    label?: SlimeIdentifier | null | undefined;
}

export interface SlimeWithStatement extends SlimeBaseStatement {
    type: "WithStatement";
    object: SlimeExpression;
    body: SlimeStatement;
}

export interface SlimeSwitchStatement extends SlimeBaseStatement {
    type: "SwitchStatement";
    discriminant: SlimeExpression;
    cases: SlimeSwitchCase[];
}

export interface SlimeReturnStatement extends SlimeBaseStatement {
    type: "ReturnStatement";
    argument?: SlimeExpression | null | undefined;
}

export interface SlimeThrowStatement extends SlimeBaseStatement {
    type: "ThrowStatement";
    argument: SlimeExpression;
}

export interface SlimeTryStatement extends SlimeBaseStatement {
    type: "TryStatement";
    block: SlimeBlockStatement;
    handler?: SlimeCatchClause | null | undefined;
    finalizer?: SlimeBlockStatement | null | undefined;
}

export interface SlimeWhileStatement extends SlimeBaseStatement {
    type: "WhileStatement";
    test: SlimeExpression;
    body: SlimeStatement;
}

export interface SlimeDoWhileStatement extends SlimeBaseStatement {
    type: "DoWhileStatement";
    body: SlimeStatement;
    test: SlimeExpression;
}

export interface SlimeForStatement extends SlimeBaseStatement {
    type: "ForStatement";
    init?: SlimeVariableDeclaration | SlimeExpression | null | undefined;
    test?: SlimeExpression | null | undefined;
    update?: SlimeExpression | null | undefined;
    body: SlimeStatement;
}

export interface SlimeBaseForXStatement extends SlimeBaseStatement {
    left: SlimeVariableDeclaration | SlimePattern;
    right: SlimeExpression;
    body: SlimeStatement;
}

export interface SlimeForInStatement extends SlimeBaseForXStatement {
    type: "ForInStatement";
}

export interface SlimeDebuggerStatement extends SlimeBaseStatement {
    type: "DebuggerStatement";
}

export type SlimeDeclaration = SlimeFunctionDeclaration | SlimeVariableDeclaration | SlimeClassDeclaration;

export interface SlimeBaseDeclaration extends SlimeBaseStatement {
}

export interface SlimeMaybeNamedFunctionDeclaration extends SlimeBaseFunction, SlimeBaseDeclaration {
    type: "FunctionDeclaration";
    /** It is null when a function declaration is a part of the `export default function` statement */
    id: SlimeIdentifier | null;
    body: SlimeBlockStatement;
}

export interface SlimeFunctionDeclaration extends SlimeMaybeNamedFunctionDeclaration {
    id: SlimeIdentifier;
}

export interface SlimeVariableDeclaration extends SlimeBaseDeclaration {
    type: "VariableDeclaration";
    declarations: SlimeVariableDeclarator[];
    kind: SlimeSubhutiTokenAst;
}

export interface SlimeVariableDeclarator extends SlimeBaseNode {
    type: "VariableDeclarator";
    id: SlimePattern;
    init?: SlimeExpression | null | undefined;
}

export interface SlimeExpressionMap {
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

export interface SlimeBaseExpression extends SlimeBaseNode {
}

export type SlimeChainElement = SlimeSimpleCallExpression | SlimeMemberExpression;

export interface SlimeChainExpression extends SlimeBaseExpression {
    type: "ChainExpression";
    expression: SlimeChainElement;
}

export interface SlimeThisExpression extends SlimeBaseExpression {
    type: "ThisExpression";
}

export interface SlimeArrayExpression extends SlimeBaseExpression {
    type: "ArrayExpression";
    elements: Array<SlimeExpression | SlimeSpreadElement | null>;
}

export interface SlimeObjectExpression extends SlimeBaseExpression {
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
    value: SlimeExpression | SlimePattern; // Could be an AssignmentProperty
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

export interface SlimeFunctionExpression extends SlimeBaseFunction, SlimeBaseExpression {
    id?: SlimeIdentifier | null | undefined;
    type: "FunctionExpression";
    body: SlimeBlockStatement;
}

export interface SlimeSequenceExpression extends SlimeBaseExpression {
    type: "SequenceExpression";
    expressions: SlimeExpression[];
}

export interface SlimeUnaryExpression extends SlimeBaseExpression {
    type: "UnaryExpression";
    operator: SlimeUnaryOperator;
    prefix: true;
    argument: SlimeExpression;
}

export interface SlimeBinaryExpression extends SlimeBaseExpression {
    type: "BinaryExpression";
    operator: SlimeBinaryOperator;
    left: SlimeExpression | SlimePrivateIdentifier;
    right: SlimeExpression;
}

export interface SlimeAssignmentExpression extends SlimeBaseExpression {
    type: "AssignmentExpression";
    operator: SlimeAssignmentOperator;
    left: SlimePattern | SlimeMemberExpression;
    right: SlimeExpression;
}

export interface SlimeUpdateExpression extends SlimeBaseExpression {
    type: "UpdateExpression";
    operator: SlimeUpdateOperator;
    argument: SlimeExpression;
    prefix: boolean;
}

export interface SlimeLogicalExpression extends SlimeBaseExpression {
    type: "LogicalExpression";
    operator: SlimeLogicalOperator;
    left: SlimeExpression;
    right: SlimeExpression;
}

export interface SlimeConditionalExpression extends SlimeBaseExpression {
    type: "ConditionalExpression";
    test: SlimeExpression;
    alternate: SlimeExpression;
    consequent: SlimeExpression;
}

export interface SlimeBaseCallExpression extends SlimeBaseExpression {
    callee: SlimeExpression | SlimeSuper;
    arguments: Array<SlimeExpression | SlimeSpreadElement>;
}

export type SlimeCallExpression = SlimeSimpleCallExpression | SlimeNewExpression;

export interface SlimeSimpleCallExpression extends SlimeBaseCallExpression {
    type: "CallExpression";
    optional: boolean;
}

export interface SlimeNewExpression extends SlimeBaseCallExpression {
    type: "NewExpression";
}

export interface SlimeMemberExpression extends SlimeBaseExpression, SlimeBasePattern {
    type: "MemberExpression";
    object: SlimeExpression | SlimeSuper;
    property: SlimeExpression | SlimePrivateIdentifier;
    computed: boolean;
    optional: boolean;
}

export type SlimePattern = SlimeIdentifier | SlimeObjectPattern | SlimeArrayPattern | SlimeRestElement | SlimeAssignmentPattern | SlimeMemberExpression;

export interface SlimeBasePattern extends SlimeBaseNode {
}

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

export interface SlimeIdentifier extends SlimeBaseNode, SlimeBaseExpression, SlimeBasePattern {
    type: "Identifier";
    name: string;
}

export type SlimeLiteral = SlimeSimpleLiteral | RegExpLiteral | bigintLiteral;

export interface SlimeSimpleLiteral extends SlimeBaseNode, SlimeBaseExpression {
    type: "Literal";
    value: string | boolean | number | null;
    raw?: string | undefined;
}

export interface RegExpLiteral extends SlimeBaseNode, SlimeBaseExpression {
    type: "Literal";
    value?: RegExp | null | undefined;
    regex: {
        pattern: string;
        flags: string;
    };
    raw?: string | undefined;
}

export interface bigintLiteral extends SlimeBaseNode, SlimeBaseExpression {
    type: "Literal";
    value?: bigint | null | undefined;
    bigint: string;
    raw?: string | undefined;
}

export type SlimeUnaryOperator = "-" | "+" | "!" | "~" | "typeof" | "void" | "delete";

export type SlimeBinaryOperator =
    | "=="
    | "!="
    | "==="
    | "!=="
    | "<"
    | "<="
    | ">"
    | ">="
    | "<<"
    | ">>"
    | ">>>"
    | "+"
    | "-"
    | "*"
    | "/"
    | "%"
    | "**"
    | "|"
    | "^"
    | "&"
    | "in"
    | "instanceof";

export type SlimeLogicalOperator = "||" | "&&" | "??";

export type SlimeAssignmentOperator =
    | "="
    | "+="
    | "-="
    | "*="
    | "/="
    | "%="
    | "**="
    | "<<="
    | ">>="
    | ">>>="
    | "|="
    | "^="
    | "&="
    | "||="
    | "&&="
    | "??=";

export type SlimeUpdateOperator = "++" | "--";

export interface SlimeForOfStatement extends SlimeBaseForXStatement {
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

export interface SlimeArrowFunctionExpression extends SlimeBaseExpression, SlimeBaseFunction {
    type: "ArrowFunctionExpression";
    expression: boolean;
    body: SlimeBlockStatement | SlimeExpression;
}

export interface SlimeYieldExpression extends SlimeBaseExpression {
    type: "YieldExpression";
    argument?: SlimeExpression | null | undefined;
    delegate: boolean;
}

export interface SlimeTemplateLiteral extends SlimeBaseExpression {
    type: "TemplateLiteral";
    quasis: SlimeTemplateElement[];
    expressions: SlimeExpression[];
}

export interface SlimeTaggedTemplateExpression extends SlimeBaseExpression {
    type: "TaggedTemplateExpression";
    tag: SlimeExpression;
    quasi: SlimeTemplateLiteral;
}

export interface SlimeTemplateElement extends SlimeBaseNode {
    type: "TemplateElement";
    tail: boolean;
    value: {
        /** It is null when the template literal is tagged and the text has an invalid escape (e.g. - tag`\unicode and \u{55}`) */
        cooked?: string | null | undefined;
        raw: string;
    };
}

export interface SlimeAssignmentProperty extends SlimeProperty {
    value: SlimePattern;
    kind: "init";
    method: boolean; // false
}

export interface SlimeObjectPattern extends SlimeBasePattern {
    type: "ObjectPattern";
    properties: Array<SlimeAssignmentProperty | SlimeRestElement>;
}

export interface SlimeArrayPattern extends SlimeBasePattern {
    type: "ArrayPattern";
    elements: Array<SlimePattern | null>;
}

export interface SlimeRestElement extends SlimeBasePattern {
    type: "RestElement";
    argument: SlimePattern;
}

export interface SlimeAssignmentPattern extends SlimeBasePattern {
    type: "AssignmentPattern";
    left: SlimePattern;
    right: SlimeExpression;
}

export type SlimeClass = SlimeClassDeclaration | SlimeClassExpression;

export interface SlimeBaseClass extends SlimeBaseNode {
    superClass?: SlimeExpression | null | undefined;
    body: SlimeClassBody;
}

export interface SlimeClassBody extends SlimeBaseNode {
    type: "ClassBody";
    body: Array<SlimeMethodDefinition | SlimePropertyDefinition | SlimeStaticBlock>;
}

export interface SlimeMethodDefinition extends SlimeBaseNode {
    type: "MethodDefinition";
    key: SlimeExpression | SlimePrivateIdentifier;
    value: SlimeFunctionExpression;
    kind: "constructor" | "method" | "get" | "set";
    computed: boolean;
    static: SlimeSubhutiTokenAst;
}

export interface SlimeMaybeNamedClassDeclaration extends SlimeBaseClass, SlimeBaseDeclaration {
    type: "ClassDeclaration";
    /** It is null when a class declaration is a part of the `export default class` statement */
    id: SlimeIdentifier | null;
}

export interface SlimeClassDeclaration extends SlimeMaybeNamedClassDeclaration {
    id: SlimeIdentifier;
    class: SlimeSubhutiTokenAst
}

export interface SlimeClassExpression extends SlimeBaseClass, SlimeBaseExpression {
    type: "ClassExpression";
    id?: SlimeIdentifier | null | undefined;
}

export interface SlimeMetaProperty extends SlimeBaseExpression {
    type: "MetaProperty";
    meta: SlimeIdentifier;
    property: SlimeIdentifier;
}

export type SlimeModuleDeclaration =
    | SlimeImportDeclaration
    | SlimeExportNamedDeclaration
    | SlimeExportDeclaration
    | SlimeExportAllDeclaration;

export interface SlimeBaseModuleDeclaration extends SlimeBaseNode {
}

export type SlimeModuleSpecifier = SlimeImportSpecifier | SlimeImportDefaultSpecifier | SlimeImportNamespaceSpecifier | SlimeExportSpecifier;

export interface SlimeBaseModuleSpecifier extends SlimeBaseNode {
    local: SlimeIdentifier;
}

export interface SlimeImportDeclaration extends SlimeBaseModuleDeclaration {
    type: "ImportDeclaration";
    specifiers: Array<SlimeImportSpecifier | SlimeImportDefaultSpecifier | SlimeImportNamespaceSpecifier>;
    source: SlimeLiteral;
}

export interface SlimeImportSpecifier extends SlimeBaseModuleSpecifier {
    type: "ImportSpecifier";
    imported: SlimeIdentifier | SlimeLiteral;
}

export interface SlimeImportExpression extends SlimeBaseExpression {
    type: "ImportExpression";
    source: SlimeExpression;
}

export interface SlimeImportDefaultSpecifier extends SlimeBaseModuleSpecifier {
    type: "ImportDefaultSpecifier";
}

export interface SlimeImportNamespaceSpecifier extends SlimeBaseModuleSpecifier {
    type: "ImportNamespaceSpecifier";
}

export interface SlimeExportNamedDeclaration extends SlimeBaseModuleDeclaration {
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

export interface SlimeSubhutiTokenAst extends SlimeBaseNodeWithoutComments {

}

export interface SlimeExportDeclaration extends SlimeBaseModuleDeclaration {
    type: "ExportDeclaration";
    export: SlimeSubhutiTokenAst
    default: SlimeSubhutiTokenAst
    declaration: SlimeMaybeNamedFunctionDeclaration | SlimeMaybeNamedClassDeclaration | SlimeExpression;
}

export interface SlimeExportAllDeclaration extends SlimeBaseModuleDeclaration {
    type: "ExportAllDeclaration";
    exported: SlimeIdentifier | SlimeLiteral | null;
    source: SlimeLiteral;
}

export interface SlimeAwaitExpression extends SlimeBaseExpression {
    type: "AwaitExpression";
    argument: SlimeExpression;
}
