import Brainfuck, { BrainfuckDebugger } from '$lib/brainfuck';
import { writable } from 'svelte/store';

export const interpreter = writable(new Brainfuck());
export const debuggerInstance = writable(new BrainfuckDebugger(null, null, []));
