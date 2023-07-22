<script lang="ts">
    import '$lib/global.css';
    import * as ace from 'brace';
    import 'brace/keybinding/vim';
    import 'brace/mode/text';
    import { onDestroy, onMount } from 'svelte';
    import EditorToolbar from './EditorToolbar.svelte';
    import EditorStdout from './EditorStdout.svelte';
    import Debugger from './Debugger.svelte';
    import { editor } from '$lib/stores/editor';

    let editorEl: HTMLDivElement | null = null;
    onMount(() => {
        if (!editorEl) {
            return;
        }
        $editor = ace.edit(editorEl);
        $editor.setHighlightActiveLine(true);
        $editor.setOption('autoScrollEditorIntoView', true);
        $editor.setOption('copyWithEmptySelection', true);
        $editor.setShowPrintMargin(false);
        $editor.setKeyboardHandler('ace/keyboard/vim');

        // TODO: set to readonly when in debug mode
        // editor.setReadOnly(true);  // false to make it editable

        // TODO: Example Programs Dropdown
        // $editor.setValue(
        //     'Hello World!\\n in Brainfuck\n\n' +
        //         '++++++++[>++++[>++>+++>+++>+<<<<-]\n' +
        //         '>+>+>->>+\n' +
        //         '[<]<-]\n' +
        //         '>>.>---.+++++++..\n' +
        //         '+++.>>.<-.<.+++.------.--------.>>+.>++\n' +
        //         '\n. print last newline'
        // );
        $editor.setValue('+++\n' + '.+\n' + '++--\n');

        // TODO: write a brainfuck mode
        const session = $editor.getSession();
        session.setMode('ace/mode/text');
        session.setTabSize(4);
        session.setUseWrapMode(true);
    });

    onDestroy(() => {
        if ($editor) {
            $editor.destroy();
            $editor.container.remove();
        }
    });
</script>

<div class="editor">
    <div class="box flex edit" bind:this={editorEl} />
    <EditorStdout />
</div>
<aside>
    <EditorToolbar />
    <Debugger />
</aside>

<style>
    .edit {
        height: 585px;
        margin-right: 0px;
    }
</style>
