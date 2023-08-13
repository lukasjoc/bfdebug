import type { Editor } from 'brace';
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

export class BrainfuckDebugger {
    private row: number = 0;
    private col: number = -1;
    private active: number = -1;
    private debugging: boolean = false;
    private current: number = -1;
    breakpoints: number[];
    bf: Brainfuck | null;
    editor: Editor | null;

    constructor(bf: Brainfuck|null, editor: Editor | null, breakpoints: number[]) {
        this.bf = bf;
        this.editor = editor;
        this.breakpoints = breakpoints;
    }
    run() {
        if (!this.editor) {
            throw new Error('missing required dependency `editor`.');
        }
        // TODO: clear stdout
        // this.stdout.clear();
        this.bf?.resetTape();
        this.bf?.evaluate(this.editor.getValue());
    }

    enable() {
        if (!this.editor) {
            throw new Error('missing required dependency `editor`.');
        }
        this.debugging = true;
        console.log('[manager/enable]: ', this);
        this.editor.moveCursorTo(0, 0, true);
        this.editor.setReadOnly(true);
        this.bf?.resetTape();
    }

    isEnabled() {
        return this.debugging && this.editor?.getReadOnly();
    }

    disable() {
        if (!this.editor) {
            throw new Error('missing required dependency `editor`.');
        }
        console.log('[manager/disable]: ', this);
        this.debugging = false;
        this.editor.setReadOnly(false);
    }

    next() {
        if (this.debugging === false) {
            return;
        }
        if (this.current + 2 > this.breakpoints.length) {
            this.disable();
            throw new Error('breakpoints exhausted');
        }

        this.current += 1;
        this.active = this.breakpoints[this.current];
        this.row = this.active;

        this.editor?.moveCursorTo(this.row, 0, true);
        const prevProgram = this.editor?.session
            .getLines(0, this.row - 1)
            .join('\n');

        console.log('[manager/next]: ', prevProgram);

        if (prevProgram) {
            // TODO: clear stdout
            this.bf?.resetTape();
            this.bf?.evaluate(prevProgram);
        }
    }

    prev() {
        if (this.debugging === false) {
            return;
        }
        if (this.current < 1) {
            throw new Error('breakpoints exhausted');
        }

        this.current -= 1;
        this.active = this.breakpoints[this.current];
        this.row = this.active;

        this.editor?.moveCursorTo(this.row, 0, true);
        const prevProgram = this.editor?.session
            .getLines(0, Math.max(0, this.row - 1))
            .join('\n');

        console.log('[manager/prev]: ', prevProgram);

        if (prevProgram) {
            this.bf?.resetTape();
            this.bf?.evaluate(prevProgram);
        }
    }

    getCurrent() {
        return this.active;
    }

    stepNext() {
        if (this.active === -1) {
            throw new Error('stepping is only supported within a breakpoint.'
             + 'Use `next` to jump to the next breakpoint. ');
        }
        // TODO: wrap around to next line when reached EOL
        // move one char to the right and execute all from start of the progoram
        // to the char
        this.col += 1;
        this.editor?.moveCursorToPosition({ row: this.row, column: this.col + 1 });
        const line = this.editor?.session.getLine(this.row);
        const char = line?.at(this.col);
        console.log('[manager/stepnext]: ', char);
        if (char) {
            this.bf?.evaluate(char);
        }
    }

    stepPrev() { console.info('TODO: not implemented'); }
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
