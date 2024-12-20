import {
    createEmptyValueRegToken,
    createKeywordToken,
    createRegToken,
    SubhutiCreateTokenGroupType, createValueRegToken, createToken
} from "subhuti/src/struct/SubhutiCreateToken.ts";

export const Es5TokensName = {
    // Keywords
    VarTok: 'VarTok',
    BreakTok: 'BreakTok',
    DoTok: 'DoTok',
    InstanceOfTok: 'InstanceOfTok',
    TypeofTok: 'TypeofTok',
    CaseTok: 'CaseTok',
    ElseTok: 'ElseTok',
    NewTok: 'NewTok',
    CatchTok: 'CatchTok',
    FinallyTok: 'FinallyTok',
    ReturnTok: 'ReturnTok',
    VoidTok: 'VoidTok',
    ContinueTok: 'ContinueTok',
    ForTok: 'ForTok',
    SwitchTok: 'SwitchTok',
    WhileTok: 'WhileTok',
    DebuggerTok: 'DebuggerTok',
    FunctionTok: 'FunctionTok',
    ThisTok: 'ThisTok',
    WithTok: 'WithTok',
    DefaultTok: 'DefaultTok',
    IfTok: 'IfTok',
    ThrowTok: 'ThrowTok',
    DeleteTok: 'DeleteTok',
    InTok: 'InTok',
    TryTok: 'TryTok',
    SuperTok: 'SuperTok',
    NullLiteral: 'NullLiteral',
    TrueTok: 'TrueTok',
    FalseTok: 'FalseTok',
    // Identifiers
    Identifier: 'Identifier',
    SetTok: 'SetTok',
    GetTok: 'GetTok',
    // Punctuators
    LBrace: 'LBrace',
    RBrace: 'RBrace',
    LParen: 'LParen',
    RParen: 'RParen',
    LBracket: 'LBracket',
    RBracket: 'RBracket',
    Dot: 'Dot',
    Semicolon: 'Semicolon',
    Comma: 'Comma',
    // Operators
    PlusPlus: 'PlusPlus',
    MinusMinus: 'MinusMinus',
    Ampersand: 'Ampersand',
    VerticalBar: 'VerticalBar',
    Circumflex: 'Circumflex',
    Exclamation: 'Exclamation',
    Tilde: 'Tilde',
    AmpersandAmpersand: 'AmpersandAmpersand',
    VerticalBarVerticalBar: 'VerticalBarVerticalBar',
    Question: 'Question',
    Colon: 'Colon',
    Asterisk: 'Asterisk',
    Slash: 'Slash',
    Percent: 'Percent',
    Plus: 'Plus',
    Minus: 'Minus',
    LessLess: 'LessLess',
    MoreMore: 'MoreMore',
    MoreMoreMore: 'MoreMoreMore',
    Less: 'Less',
    More: 'More',
    LessEq: 'LessEq',
    MoreEq: 'MoreEq',
    EqEq: 'EqEq',
    NotEq: 'NotEq',
    EqEqEq: 'EqEqEq',
    NotEqEq: 'NotEqEq',
    Eq: 'Eq',
    PlusEq: 'PlusEq',
    MinusEq: 'MinusEq',
    AsteriskEq: 'AsteriskEq',
    PercentEq: 'PercentEq',
    LessLessEq: 'LessLessEq',
    MoreMoreEq: 'MoreMoreEq',
    MoreMoreMoreEq: 'MoreMoreMoreEq',
    AmpersandEq: 'AmpersandEq',
    VerticalBarEq: 'VerticalBarEq',
    CircumflexEq: 'CircumflexEq',
    SlashEq: 'SlashEq',
    // Literals
    NumericLiteral: 'NumericLiteral',
    StringLiteral: 'StringLiteral',
    RegularExpressionLiteral: 'RegularExpressionLiteral',
    Spacing: 'Spacing',
    LineBreak: 'LineBreak'
};
export const es5TokensObj = {


    // Keywords
    VarTok: createKeywordToken(Es5TokensName.VarTok, "var"),
    BreakTok: createKeywordToken(Es5TokensName.BreakTok, "break"),
    DoTok: createKeywordToken(Es5TokensName.DoTok, "do"),
    InstanceOfTok: createKeywordToken(Es5TokensName.InstanceOfTok, "instanceof"),
    TypeofTok: createKeywordToken(Es5TokensName.TypeofTok, "typeof"),
    CaseTok: createKeywordToken(Es5TokensName.CaseTok, "case"),
    ElseTok: createKeywordToken(Es5TokensName.ElseTok, "else"),
    NewTok: createKeywordToken(Es5TokensName.NewTok, "new"),
    CatchTok: createKeywordToken(Es5TokensName.CatchTok, "catch"),
    FinallyTok: createKeywordToken(Es5TokensName.FinallyTok, "finally"),
    ReturnTok: createKeywordToken(Es5TokensName.ReturnTok, "return"),
    VoidTok: createKeywordToken(Es5TokensName.VoidTok, "void"),
    ContinueTok: createKeywordToken(Es5TokensName.ContinueTok, "continue"),
    ForTok: createKeywordToken(Es5TokensName.ForTok, "for"),
    SwitchTok: createKeywordToken(Es5TokensName.SwitchTok, "switch"),
    WhileTok: createKeywordToken(Es5TokensName.WhileTok, "while"),
    DebuggerTok: createKeywordToken(Es5TokensName.DebuggerTok, "debugger"),
    FunctionTok: createKeywordToken(Es5TokensName.FunctionTok, "function"),
    ThisTok: createKeywordToken(Es5TokensName.ThisTok, "this"),
    WithTok: createKeywordToken(Es5TokensName.WithTok, "with"),
    DefaultTok: createKeywordToken(Es5TokensName.DefaultTok, "default"),
    IfTok: createKeywordToken(Es5TokensName.IfTok, "if"),
    ThrowTok: createKeywordToken(Es5TokensName.ThrowTok, "throw"),
    DeleteTok: createKeywordToken(Es5TokensName.DeleteTok, "delete"),
    InTok: createKeywordToken(Es5TokensName.InTok, "in"),
    TryTok: createKeywordToken(Es5TokensName.TryTok, "try"),
    SuperTok: createKeywordToken(Es5TokensName.SuperTok, "super"),
    NullLiteral: createKeywordToken(Es5TokensName.NullLiteral, "null"),
    TrueTok: createKeywordToken(Es5TokensName.TrueTok, "true"),
    FalseTok: createKeywordToken(Es5TokensName.FalseTok, "false"),
    SetTok: createKeywordToken(Es5TokensName.SetTok, "set"),
    GetTok: createKeywordToken(Es5TokensName.GetTok, "get"),

    //不需要转译的
    // Punctuators
    Semicolon: createRegToken(Es5TokensName.Semicolon, /;/),
    Comma: createRegToken(Es5TokensName.Comma, /,/),
    // Operators,
    MinusMinus: createRegToken(Es5TokensName.MinusMinus, /--/),
    Ampersand: createRegToken(Es5TokensName.Ampersand, /&/),
    Exclamation: createRegToken(Es5TokensName.Exclamation, /!/),
    Tilde: createRegToken(Es5TokensName.Tilde, /~/),
    AmpersandAmpersand: createRegToken(Es5TokensName.AmpersandAmpersand, /&&/),
    Colon: createRegToken(Es5TokensName.Colon, /:/),
    Percent: createRegToken(Es5TokensName.Percent, /%/),
    Minus: createRegToken(Es5TokensName.Minus, /-/),
    LessLess: createRegToken(Es5TokensName.LessLess, /<</),
    MoreMore: createRegToken(Es5TokensName.MoreMore, />>/),
    MoreMoreMore: createRegToken(Es5TokensName.MoreMoreMore, />>>/),
    Less: createRegToken(Es5TokensName.Less, /</),
    More: createRegToken(Es5TokensName.More, />/),
    LessEq: createRegToken(Es5TokensName.LessEq, /<=/),
    MoreEq: createRegToken(Es5TokensName.MoreEq, />=/),
    EqEq: createRegToken(Es5TokensName.EqEq, /==/),
    NotEq: createRegToken(Es5TokensName.NotEq, /!=/),
    EqEqEq: createRegToken(Es5TokensName.EqEqEq, /===/),
    NotEqEq: createRegToken(Es5TokensName.NotEqEq, /!==/),
    Eq: createRegToken(Es5TokensName.Eq, /=/),
    MinusEq: createRegToken(Es5TokensName.MinusEq, /-=/),
    PercentEq: createRegToken(Es5TokensName.PercentEq, /%=/),
    LessLessEq: createRegToken(Es5TokensName.LessLessEq, /<<=/),
    MoreMoreEq: createRegToken(Es5TokensName.MoreMoreEq, />>=/),
    MoreMoreMoreEq: createRegToken(Es5TokensName.MoreMoreMoreEq, />>>=/),
    AmpersandEq: createRegToken(Es5TokensName.AmpersandEq, /&=/),

    VerticalBar: createValueRegToken(Es5TokensName.VerticalBar, /\|/, '|'),
    Circumflex: createValueRegToken(Es5TokensName.Circumflex, /\^/, '^'),
    Question: createValueRegToken(Es5TokensName.Question, /\?/, '?'),
    PlusPlus: createValueRegToken(Es5TokensName.PlusPlus, /\+\+/, '++'),
    LBrace: createValueRegToken(Es5TokensName.LBrace, /\{/, '{'),
    RBrace: createValueRegToken(Es5TokensName.RBrace, /}/, '}'),
    LParen: createValueRegToken(Es5TokensName.LParen, /\(/, '('),
    RParen: createValueRegToken(Es5TokensName.RParen, /\)/, ')'),
    LBracket: createValueRegToken(Es5TokensName.LBracket, /\[/, '['),
    RBracket: createValueRegToken(Es5TokensName.RBracket, /]/, ']'),
    Dot: createValueRegToken(Es5TokensName.Dot, /\./, '.'),
    VerticalBarVerticalBar: createValueRegToken(Es5TokensName.VerticalBarVerticalBar, /\|\|/, '||'),
    Asterisk: createValueRegToken(Es5TokensName.Asterisk, /\*/, '*'),
    Slash: createValueRegToken(Es5TokensName.Slash, /\/\//, '//'),
    Plus: createValueRegToken(Es5TokensName.Plus, /\+/, '+'),
    PlusEq: createValueRegToken(Es5TokensName.PlusEq, /\+=/, '+='),
    AsteriskEq: createValueRegToken(Es5TokensName.AsteriskEq, /\*=/, '*='),
    VerticalBarEq: createValueRegToken(Es5TokensName.VerticalBarEq, /\|=/, '|='),
    CircumflexEq: createValueRegToken(Es5TokensName.CircumflexEq, /\^=/, '^='),
    SlashEq: createValueRegToken(Es5TokensName.SlashEq, /\/=/, '/='),


    // Identifiers
    Identifier: createEmptyValueRegToken(Es5TokensName.Identifier, /[A-Za-z_$][A-Za-z0-9_$]*/),

    // Literals
    NumericLiteral: createEmptyValueRegToken(Es5TokensName.NumericLiteral, /-?\d+(\.\d+)?/),
    StringLiteral: createEmptyValueRegToken(Es5TokensName.StringLiteral, /(["'])((?:\\\1|(?:(?!\1|\n|\r).)*)*)\1/),
    RegularExpressionLiteral: createEmptyValueRegToken(
        Es5TokensName.RegularExpressionLiteral,
        /\/(?:\\.|[^\\\/])+\/[gimuy]*/
    ),
    Spacing: createValueRegToken(
         Es5TokensName.Spacing,
         /[\t\f\v]/,
        ' ',
        SubhutiCreateTokenGroupType.skip
    ),
    LineBreak: createValueRegToken(
      Es5TokensName.LineBreak,
      /[\n\r]/,
      '\n',
      SubhutiCreateTokenGroupType.skip
    ),
};
export const es5Tokens = Object.values(es5TokensObj);
