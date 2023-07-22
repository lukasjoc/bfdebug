import type { Editor } from 'brace';
import { writable } from 'svelte/store';

export default writable<Editor | null>(null);
