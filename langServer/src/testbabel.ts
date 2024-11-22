import Parser from 'tree-sitter'
import typescript from 'tree-sitter-typescript'
import JsonUtil from "./utils/JsonUtil.ts";

const parser = new Parser();
parser.setLanguage(typescript.typescript);

const sourceCode = 'let x =';
const tree = parser.parse(sourceCode);

JsonUtil.log(tree.rootNode.toString())
