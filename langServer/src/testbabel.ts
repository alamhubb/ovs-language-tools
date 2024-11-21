import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import { SourceMapConsumer } from 'source-map';

// 源代码示例
const sourceCode = `
const greeting = "hello world";
console.log(greeting);
const farewell = "goodbye world";
`;

// 解析源代码，生成 AST，并保留位置信息
const ast = parse(sourceCode);

// 验证 AST 节点是否包含位置信息
traverse(ast, {
    enter(path) {
        console.log(path.node.type)
        path.node.start = undefined
        path.node.end = undefined
        path.node.loc.start.index = undefined
        path.node.loc.end.index = undefined
        if (!path.node.loc) {
            console.error(`Node of type ${path.node.type} is missing loc information.`);
        }
    }
});


console.log(ast)
// 转换 AST 示例：将所有字符串字面量转换为大写
traverse(ast, {
    StringLiteral(path) {
        const originalValue = path.node.value;
        path.node.value = originalValue.toUpperCase();
        // 保留源位置（通常不需要修改）
        path.node.loc = path.node.loc;
    }
});

// 存储生成码 tokens
const generatedTokens: any[] = [];

// 生成代码，并启用源码映射和 tokens 追踪
const genRes = generate(ast, {
    sourceMaps: true,              // 启用源码映射
    sourceFileName: 'source.js',   // 源文件名
    file: 'generated.js',          // 生成文件名（注意：使用 'file' 而不是 'fileName'）
    tokens: true,                  // 启用 tokens
    retainLines: true,             // 保留行号
    compact: false,                // 不压缩代码
    comments: true,                // 保留注释
    onToken: (token) => {
        generatedTokens.push({
            type: token.type.label,
            value: token.value,
            start: token.start,
            end: token.end,
            loc: token.loc,
        });
    },
});

console.log(genRes)
console.log(genRes.code)
console.log(genRes.map)
console.log(genRes.rawMappings)
console.log(generatedTokens)
