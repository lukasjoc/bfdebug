<script lang="ts">
    import '$lib/global.css';
    import * as ace from 'brace';
    import 'brace/keybinding/vim';
    import 'brace/mode/text';
    import { onDestroy, onMount } from 'svelte';
    import EditorToolbar from './EditorToolbar.svelte';
    import EditorStdout from './EditorStdout.svelte';
    import Debugger from './Debugger.svelte';
    import { manager } from '$lib/stores/editor';

    let editorEl: HTMLDivElement | null = null;
    onMount(() => {
        if (!editorEl) {
            return;
        }
        $manager.editor = ace.edit(editorEl);
        $manager.editor = ace.edit(editorEl);
        $manager.editor.setHighlightActiveLine(true);
        $manager.editor.setOption('autoScrollEditorIntoView', true);
        $manager.editor.setOption('copyWithEmptySelection', true);
        $manager.editor.setShowPrintMargin(false);
        $manager.editor.setKeyboardHandler('ace/keyboard/vim');

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
        $manager.editor.setValue('+++\n' + '.+\n' + '++--\n');

        // TODO: write a brainfuck mode
        const session = $manager.editor.getSession();
        session.setMode('ace/mode/text');
        session.setTabSize(4);
        session.setUseWrapMode(true);
    });

    onDestroy(() => {
        // TODO: would it make sense to have a destroy on the manager?
        if ($manager.editor) {
            $manager.editor.destroy();
            $manager.editor.container.remove();
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
