import * as ts from 'typescript';

// 1. 输入的 TypeScript 源代码
const tsCode = `const a = {haha:123}
`;

// 2. 使用 TypeScript 的 transpileModule 转换代码
const result = ts.transpileModule(tsCode, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  }
});

// 3. 输出转换后的 JS 代码和 Source Map
console.log('JavaScript Code:');
console.log(result.outputText);

console.log('Source Map:');
console.log(result.sourceMapText);
