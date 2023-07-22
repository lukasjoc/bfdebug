const Inc = "Inc" as const
const Dec = "Dec" as const
const Left = "Left" as const
const Right = "Right" as const
const Print = "Print" as const
const Input = "Input" as const
const LoopStart = "LoopStart" as const
const LoopEnd = "LoopEnd" as const
const Ignored = "Ignored" as const

type Token =
    | typeof Inc
    | typeof Dec
    | typeof Left
    | typeof Right
    | typeof Print
    | typeof Input
    | typeof LoopStart
    | typeof LoopEnd
    | typeof Ignored

type JumpTable = { [key: number]: number };

function charToToken(char: string): Token {
    switch (char) {
        case '+': return Inc
        case '-': return Dec
        case '<': return Left
        case '>': return Right
        case '[': return LoopStart
        case ']': return LoopEnd
        case ',': return Input
        case '.': return Print
    }
    return Ignored
}

export default class Brainfuck {
    private tokens: Token[] | null = null;
    private tape: number[] | null = null;
    constructor(public source: string) {
        this.source = source;
        this.tokens = Brainfuck.tokenize(source)
        this.tape = null;
    }

    private buildJumpTable(): JumpTable {
        if (!this.tokens?.length) {
            throw new Error("Missing tokens. Please tokenize first!")
        }
        const table: JumpTable = {};
        const levels: number[] = [];

        let iter = 0;
        for (const token of this.tokens) {
            switch (token) {
                case LoopStart: {
                    levels.push(iter);
                    break;
                }
                case LoopEnd: {
                    const last = levels.pop();
                    if (last !== undefined) {
                        table[last] = iter;
                        table[iter] = last;
                    } else {
                        throw new Error(`Unclosed loop token before: ${iter}`);
                    }
                    break;
                }
                default:
                    break;
            }
            iter++;
        }

        return table;
    }

    private static tokenize(source: string): Token[] {
        return source.split('').map(charToToken)
    }

    evaluate(): string[] {
        if (!this.tokens?.length) {
            throw new Error("Missing tokens. Please tokenize first!")
        }
        this.tape = new Array(30_000).fill(0);
        const table = this.buildJumpTable()
        const stdout = [""]
        let iter = 0;
        let ptr = 0
        while (iter < this.tokens.length) {
            const token = this.tokens[iter];
            switch (token) {
                case Inc: this.tape[ptr]++; break;
                case Dec: this.tape[ptr]--; break;
                case Left: ptr--; break;
                case Right: ptr++; break;
                case LoopStart:
                    if (this.tape[ptr] === 0) {
                        iter = table[iter];
                    }
                    break;
                case LoopEnd:
                    if (this.tape[ptr] !== 0) {
                        iter = table[iter];
                    }
                    break;
                case Input: {
                    const r = prompt()
                    const rn = Number(r)
                    if (Number.isNaN(rn)) {
                        throw new Error("numeric input expected")
                    }
                    this.tape[ptr] = rn;
                    break;
                }
                case Print: {
                    const value = this.tape[ptr];
                    const valueAsChar = String.fromCharCode(value)
                    if (value === 10 || value === 13) {
                        stdout.push(valueAsChar)
                    } else {
                        stdout[stdout.length - 1] += valueAsChar
                    }
                    break;
                }
                default:
                /* ignored text */
            }
            iter++;
        }
        return stdout;
    }
}
