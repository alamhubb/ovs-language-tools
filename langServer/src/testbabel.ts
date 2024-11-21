class SourceMapPositionConverter {
    private sourceLineStarts: number[];
    private generatedLineStarts: number[];

    constructor(sourceCode: string, generatedCode: string) {
        // 计算源代码和生成代码的每行起始位置
        this.sourceLineStarts = this.computeLineStarts(sourceCode);
        this.generatedLineStarts = this.computeLineStarts(generatedCode);
    }

    /**
     * 计算每行的起始偏移量
     */
    private computeLineStarts(code: string): number[] {
        const starts = [0]; // 第一行从0开始
        let pos = 0;

        while ((pos = code.indexOf('\n', pos)) !== -1) {
            starts.push(pos + 1); // +1 跳过换行符
            pos++;
        }
        return starts;
    }

    /**
     * 将 Babel 的位置信息转换为偏移量
     */
    convertBabelMapping(mapping: {
        generated: { line: number; column: number };
        original: { line: number; column: number };
    }) {
        return {
            // 生成代码的偏移量
            generatedOffset: this.positionToOffset(
                mapping.generated,
                this.generatedLineStarts
            ),
            // 源代码的偏移量
            originalOffset: this.positionToOffset(
                mapping.original,
                this.sourceLineStarts
            )
        };
    }

    /**
     * 将行列位置转换为偏移量
     */
    private positionToOffset(
        position: { line: number; column: number },
        lineStarts: number[]
    ): number {
        // Babel 的行号从1开始，需要转换为0基础的索引
        const lineIndex = position.line - 1;

        if (lineIndex < 0 || lineIndex >= lineStarts.length) {
            throw new Error(`Invalid line number: ${position.line}`);
        }

        return {
            offsets:lineStarts[lineIndex] + position.column,
            length:lineStarts[lineIndex] + position.column
        };
    }
}

// 使用示例
const sourceCode = `let c1 = 123
let c2 = c1
let c3 = c2
let c4 = c3

Tes
`;

const generatedCode = `let c1 = 123
let c2 = c1
let c3 = c2
let c4 = c3
Tes
`;

// 创建转换器
const converter = new SourceMapPositionConverter(sourceCode, generatedCode);

// Babel 的映射示例
const babelMapping = [
        {
            generated: { line: 1, column: 0 },
            source: 'source.js',
            original: { line: 1, column: 0 },
            name: undefined
        },
        {
            generated: { line: 1, column: 4 },
            source: 'source.js',
            original: { line: 1, column: 4 },
            name: 'c1'
        },
        {
            generated: { line: 1, column: 6 },
            source: 'source.js',
            original: { line: 1, column: 6 },
            name: undefined
        },
        {
            generated: { line: 1, column: 9 },
            source: 'source.js',
            original: { line: 1, column: 9 },
            name: undefined
        },
        {
            generated: { line: 1, column: 12 },
            source: 'source.js',
            original: { line: 1, column: 12 },
            name: undefined
        },
        {
            generated: { line: 2, column: 0 },
            source: 'source.js',
            original: { line: 2, column: 0 },
            name: undefined
        },
        {
            generated: { line: 2, column: 4 },
            source: 'source.js',
            original: { line: 2, column: 4 },
            name: 'c2'
        },
        {
            generated: { line: 2, column: 6 },
            source: 'source.js',
            original: { line: 2, column: 6 },
            name: undefined
        },
        {
            generated: { line: 2, column: 9 },
            source: 'source.js',
            original: { line: 2, column: 9 },
            name: 'c1'
        },
        {
            generated: { line: 2, column: 11 },
            source: 'source.js',
            original: { line: 2, column: 11 },
            name: undefined
        },
        {
            generated: { line: 3, column: 0 },
            source: 'source.js',
            original: { line: 3, column: 0 },
            name: undefined
        },
        {
            generated: { line: 3, column: 4 },
            source: 'source.js',
            original: { line: 3, column: 4 },
            name: 'c3'
        },
        {
            generated: { line: 3, column: 6 },
            source: 'source.js',
            original: { line: 3, column: 6 },
            name: undefined
        },
        {
            generated: { line: 3, column: 9 },
            source: 'source.js',
            original: { line: 3, column: 9 },
            name: 'c2'
        },
        {
            generated: { line: 3, column: 11 },
            source: 'source.js',
            original: { line: 3, column: 11 },
            name: undefined
        },
        {
            generated: { line: 4, column: 0 },
            source: 'source.js',
            original: { line: 4, column: 0 },
            name: undefined
        },
        {
            generated: { line: 4, column: 4 },
            source: 'source.js',
            original: { line: 4, column: 4 },
            name: 'c4'
        },
        {
            generated: { line: 4, column: 6 },
            source: 'source.js',
            original: { line: 4, column: 6 },
            name: undefined
        },
        {
            generated: { line: 4, column: 9 },
            source: 'source.js',
            original: { line: 4, column: 9 },
            name: 'c3'
        },
        {
            generated: { line: 4, column: 11 },
            source: 'source.js',
            original: { line: 4, column: 11 },
            name: undefined
        },
        {
            generated: { line: 5, column: 0 },
            source: 'source.js',
            original: { line: 5, column: 1 },
            name: 'Tes'
        },
        {
            generated: { line: 5, column: 3 },
            source: 'source.js',
            original: { line: 5, column: 4 },
            name: undefined
        }
    ]
;

// 转换为偏移量
const offsets = babelMapping.map(item=>converter.convertBabelMapping(item));
console.log('Offsets:', offsets);
