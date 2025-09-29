import {vitePluginOvsTransform} from "ovsjs/src";

const code = `console.log(1)`

const res = vitePluginOvsTransform(code)

console.log(res)

