export  class SlimeCodePosition {
    line: number = 0
    start: number = 0
    index: number = 0
    length: number = 0
}

export default class SlimeCodeMapping {
   source: SlimeCodePosition[] = []
   generate: SlimeCodePosition[] = []
}
