import SubhutiMatchToken from "./SubhutiMatchToken.ts";

export interface SubhutiSourceLocation {
    start: SubhutiPosition;
    end: SubhutiPosition;
    filename?: string;
    identifierName?: string | undefined | null;
}

export interface SubhutiPosition {
    line: number;
    column: number;
}

export default class SubhutiCst {
    // pathName: string;
    name: string;
    children?: SubhutiCst[]
    loc: SubhutiSourceLocation
    tokens?: SubhutiMatchToken[]
    value?: string;

    constructor(cst?: SubhutiCst) {
        if (cst) {
            this.name = cst.name;
            // this.pathName = cst.pathName;
            this.children = cst.children;
            this.value = cst.value;
        }
    }

    pushCstToken?(popToken: SubhutiMatchToken) {
        this.tokens.push(popToken);
    }
}
