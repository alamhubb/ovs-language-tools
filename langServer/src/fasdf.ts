import {vitePluginOvsTransform} from "ovsjs/src";
import {MappingConverter} from "./languagePlugin.ts";
import {LogUtil} from "./logutil.ts";
import { SourceMap } from '@volar/source-map';

const code = `import OvsAPI from 'ovsjs/src/OvsAPI';
const a = 1
export const hello = {
    render() {
console.
    }
}
`
const res = vitePluginOvsTransform(code)

console.log(res.mapping)

const offsets = MappingConverter.convertMappings(res.mapping)

const mappings = [{
  sourceOffsets: offsets.map(item => item.original.offset),
  generatedOffsets: offsets.map(item => item.generated.offset),
  lengths: offsets.map(item => item.original.length),
  generatedLengths: offsets.map(item => item.generated.length),
  // sourceOffsets: [0],
  // generatedOffsets: [0],
  // lengths: [styleText.length],
  data: {
    completion: true,
    format: true,
    navigation: true,
    semantic: true,
    structure: true,
    verification: true
  },
}]

console.log(mappings)

// const defaultMapperFactory = new SourceMap(mappings);

/*const res1111 = defaultMapperFactory.toGeneratedLocation(97)
console.log(res1111)
for (const res1111Element of res1111) {
  console.log(6666)
  console.log(res1111Element)
}*/

//问题来自于length太长了
