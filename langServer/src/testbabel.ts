import * as esprima from 'esprima';

// 1. 基本解析
const code = "let a = ";

// 2. 使用 tolerant 选项进行容错解析
const ast = esprima.parseScript(code, {
    tolerant: true,      // 启用容错模式
    tokens: true,        // 包含词法标记
    range: true,         // 包含范围信息
    comment: true,       // 包含注释
    loc: true           // 包含位置信息
});

