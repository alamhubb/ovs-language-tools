import * as ts from 'typescript';
import JsonUtil from "./utils/JsonUtil.ts";

const code = 'let a ='
const sourceFile = ts.createSourceFile('fasdf.ts', code, ts.ScriptTarget.Latest, false);

JsonUtil.log(sourceFile.statements)
