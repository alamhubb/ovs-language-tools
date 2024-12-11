import {SubhutiSourceLocation} from "subhuti/src/struct/SubhutiCst";

export class SlimeCodePosition {
    line: number = 0
    column: number = 0
    length: number = 0
    //为什么需要index，mapping需要，使用index方便，不需要index，生成的map不需要，只要有length就行，有length就可以用来计算index了
    // index: number = 0
}

export default class SlimeCodeMapping {
    source: SlimeCodePosition = null
    generate: SlimeCodePosition = null
}
