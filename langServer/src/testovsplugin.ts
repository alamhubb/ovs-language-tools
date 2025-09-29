import {vitePluginOvsTransform} from "ovsjs/src"

const cases: Record<string, string> = {
  simpleCall: `console.log(1)`,
  ovsDivLiteral: `div {
  123
}`
}

for (const [name, code] of Object.entries(cases)) {
  const res = vitePluginOvsTransform(code)
  console.log(`=== ${name} ===`)
  console.log('code:', res.code)
  console.log('mapping:', res.mapping)
}

