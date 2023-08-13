<script lang="ts">
    import * as ace from 'brace';
    import type { Editor, Position } from 'brace';
    import 'brace/keybinding/vim';
    import 'brace/mode/text';
    import { onDestroy, onMount } from 'svelte';
    import { interpreter, debuggerInstance } from '$lib/stores';
    import Brainfuck from '$lib/brainfuck';

    function setBreakpoint(event: {
        domEvent: MouseEvent;
        editor: Editor;
        getDocumentPosition: () => Position;
        stop: () => void;
    }) {
        const editor = event.editor;
        const session = editor.session;
        if (editor.getReadOnly()) {
            return;
        }
        const { row } = event.getDocumentPosition();
        const breakpoints = session.getBreakpoints();

        if (!breakpoints[row]) {
            // @ts-expect-error className should be optional
            session.setBreakpoint(row);
        } else {
            session.clearBreakpoint(row);
        }

        // meh dont want to shuffle arrays today ^^
        $debuggerInstance.breakpoints = [];
        for (const i in breakpoints) {
            const breakpoint = Number(i);
            if (breakpoints[breakpoint] !== undefined) {
                $debuggerInstance.breakpoints.push(breakpoint);
            }
        }
        event.stop();
    }


    let editorEl: HTMLDivElement | null = null;
    onMount(() => {
        if (!editorEl) {
            return;
        }
        const editor = ace.edit(editorEl);
        editor.setHighlightActiveLine(true);
        editor.setOption('autoScrollEditorIntoView', true);
        editor.setShowPrintMargin(true);
        editor.setKeyboardHandler('ace/keyboard/vim');
        editor.setValue('+++\n' + '.+\n' + '++--\n');

        const session = editor.getSession();
        session.setMode('ace/mode/text');
        session.setTabSize(4);
        session.setUseWrapMode(true);

        editor.on('guttermousedown', setBreakpoint);

        $debuggerInstance.editor = editor;

        const brainfuck = new Brainfuck();
        $interpreter = brainfuck;
        $debuggerInstance.bf = brainfuck;
    });

    onDestroy(() => {
        if ($debuggerInstance.editor) {
            $debuggerInstance.editor.destroy();
            $debuggerInstance.editor.container.remove();
        }
    });
</script>

<div class="editor" bind:this={editorEl} />

<style>
    .editor {
        height: 100%;
        border-right: 1px solid #bbb;
    }
</style>
