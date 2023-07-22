import type { Editor } from 'brace';
import { writable } from 'svelte/store';

export const editor = writable<Editor | null>(null);

export type DebuggerState = {
    debugging: boolean,
    breakpoints: number[],
    current: number | null,
    pos: number | null,
}

// TODO: write a Debugger "Manager" Class to handle this better.
// using callbacks for steps handling.
export const debuggerState = writable<DebuggerState>({
    debugging: false,
    breakpoints: [],
    current: null,
    pos: null,
});
