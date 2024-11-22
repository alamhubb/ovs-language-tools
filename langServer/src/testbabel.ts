import * as ts from 'typescript';
import JsonUtil from "./utils/JsonUtil.ts";

// 1. 解析代码到 AST
const code = 'let a =';
const sourceFile = ts.createSourceFile(
    'example.ts',
    code,
    ts.ScriptTarget.Latest,
    false
);

// 2. 查看 AST 结构
JsonUtil.log(sourceFile.statements);

// 3. 创建 printer
const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    // 可选配置
    removeComments: false,
    omitTrailingSemicolon: false
});

// 4. 生成代码
const result = printer.printFile(sourceFile);
console.log('Generated code:', result);
