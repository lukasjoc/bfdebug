<script lang="ts">
    import '$lib/global.css';
    import * as ace from 'brace';
    import 'brace/keybinding/vim';
    import 'brace/mode/text';
    import type { Editor } from 'brace';
    import { onDestroy, onMount } from 'svelte';
    import EditorToolbar from './EditorToolbar.svelte';
    import EditorStdout from './EditorStdout.svelte';
    import Debugger from './Debugger.svelte';
    import sharedEditor from '$lib/stores/editor';

    let editorEl: HTMLDivElement | null = null;
    let editor: Editor | null = null;

    onMount(() => {
        if (editorEl) {
            editor = ace.edit(editorEl);
            editor.setHighlightActiveLine(true);
            editor.setOption('autoScrollEditorIntoView', true);
            editor.setOption('copyWithEmptySelection', true);
            editor.setShowPrintMargin(false);
            editor.setKeyboardHandler('ace/keyboard/vim');

            // TODO: set to readonly when in debug mode
            // editor.setReadOnly(true);  // false to make it editable

            // TODO: Example Programs Dropdown
            editor.setValue(
                'Hello World!\\n in Brainfuck\n\n' +
                    '++++++++[>++++[>++>+++>+++>+<<<<-]\n' +
                    '>+>+>->>+\n' +
                    '[<]<-]\n' +
                    '>>.>---.+++++++..\n' +
                    '+++.>>.<-.<.+++.------.--------.>>+.>++\n' +
                    '\n. print last newline'
            );

            // TODO: write a brainfuck mode
            const session = editor.getSession();
            session.setMode('ace/mode/text');
            session.setTabSize(4);
            session.setUseWrapMode(true);

            // editor.on('guttermousedown', (event) => {
            //     console.log("gutter was clicked; ", event.getDocumentPosition());
            // })

            sharedEditor.set(editor);
        }
    });

    onDestroy(() => {
        if (editor) {
            editor.destroy();
            editor.container.remove();
            editor = null;
            sharedEditor.set(null);
        }
    });
</script>

<div class="editor">
    <div class="box flex edit" bind:this={editorEl} />
    <EditorToolbar />
    <EditorStdout />
</div>
<aside>
    <Debugger />
</aside>

<style>
    .edit {
        height: 585px;
        margin-right: 0px;
    }
</style>
