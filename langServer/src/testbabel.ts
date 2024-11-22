import Parser from 'tree-sitter'
import typescript from 'tree-sitter-typescript'

const parser = new Parser();
parser.setLanguage(typescript.typescript);

const sourceCode = 'let x =';
const tree = parser.parse(sourceCode);

console.log(tree.rootNode.toString())
