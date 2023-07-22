import { writable } from 'svelte/store';

const Inc = 'Inc' as const;
const Dec = 'Dec' as const;
const Left = 'Left' as const;
const Right = 'Right' as const;
const Print = 'Print' as const;
const Input = 'Input' as const;
const LoopStart = 'LoopStart' as const;
const LoopEnd = 'LoopEnd' as const;
const Ignored = 'Ignored' as const;

type Token =
    | typeof Inc
    | typeof Dec
    | typeof Left
    | typeof Right
    | typeof Print
    | typeof Input
    | typeof LoopStart
    | typeof LoopEnd
    | typeof Ignored;

type JumpTable = { [key: number]: number };

function charToToken(char: string): Token {
    switch (char) {
    case '+':
        return Inc;
    case '-':
        return Dec;
    case '<':
        return Left;
    case '>':
        return Right;
    case '[':
        return LoopStart;
    case ']':
        return LoopEnd;
    case ',':
        return Input;
    case '.':
        return Print;
    }
    return Ignored;
}
export type Line = string;
export class BrainfuckStdout {
    private internalLines: Line[] = [''];

    lines(): Readonly<Line[]> {
        return this.internalLines;
    }

    length() {
        return this.internalLines.length;
    }

    push(code: number) {
        const char = String.fromCharCode(code);
        //  LF,            CR
        if (code === 10 || code === 13) {
            this.internalLines.push(char);
        }
        // non-printables
        else if (code < 32) {
            this.internalLines[this.length() - 1] += 'N';
        } else {
            this.internalLines[this.length() - 1] += char;
        }
    }

    clear() {
        this.internalLines[0] = '';
        this.internalLines.splice(1, this.length());
    }
}

class MissingTokensError extends Error {
    public message = 'Missing tokens. Please tokenize first!';
}

export default class Brainfuck {
    private tokens: Token[] | null = null;
    private tape: number[] = new Array(30_000).fill(0);
    private ptr: number = 0;

    public resetTape() {
        this.ptr = 0;
        this.tape = this.tape.fill(0);
    }

    public getTape() {
        return this.tape;
    }

    public getPtr() {
        return this.ptr;
    }

    public getValueAtPtr() {
        return this.tape[this.ptr];
    }

    private buildJumpTable(): JumpTable {
        if (!this.tokens?.length) {
            throw new MissingTokensError();
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
        return source.split('').map(charToToken);
    }

    evaluate(source: string) {
        this.tokens = Brainfuck.tokenize(source);
        if (!this.tokens?.length) {
            throw new MissingTokensError();
        }
        const table = this.buildJumpTable();
        let iter = 0;
        while (iter < this.tokens.length) {
            const token = this.tokens[iter];
            switch (token) {
            case Inc:
                this.tape[this.ptr]++;
                break;
            case Dec:
                this.tape[this.ptr]--;
                break;
            case Left:
                this.ptr--;
                break;
            case Right:
                this.ptr++;
                break;
            case LoopStart:
                if (this.tape[this.ptr] === 0) {
                    iter = table[iter];
                }
                break;
            case LoopEnd:
                if (this.tape[this.ptr] !== 0) {
                    iter = table[iter];
                }
                break;
            case Input: {
                const r = prompt();
                const n = Number(r);
                if (Number.isNaN(n)) {
                    throw new Error('Invalid input! Expected numeric got alphabetic.');
                }
                this.tape[this.ptr] = n;
                break;
            }
            case Print: {
                stdout.update((stdout) => {
                    stdout.push(this.tape[this.ptr]);
                    return stdout;
                });
                break;
            }
            default:
                /* ignored text */
            }
            iter++;
        }
    }
}

export const stdout = writable(new BrainfuckStdout());
export const brainfuck = writable(new Brainfuck());
