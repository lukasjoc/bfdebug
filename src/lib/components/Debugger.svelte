<script lang="ts">
    import '$lib/global.css';
    import { editor, debuggerState } from '$lib/stores/editor';
    import type { Editor, Position } from 'brace';
    import { onDestroy } from 'svelte';
    import {brainfuck} from '$lib/brainfuck';

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
        const bpts = session.getBreakpoints();

        if (!bpts[row]) {
            // @ts-expect-error className should be optional
            session.setBreakpoint(row);
        } else {
            session.clearBreakpoint(row);
        }

        // meh dont want to shuffle arrays today ^^
        $debuggerState.breakpoints.splice(0, $debuggerState.breakpoints.length);
        for (const i in bpts) {
            const ni = Number(i);
            if (bpts[ni] !== undefined) {
                $debuggerState.breakpoints.push(ni);
            }
        }
        $debuggerState.breakpoints = $debuggerState.breakpoints;
        event.stop();
    }

    const stop = editor.subscribe((e) => {
        e?.on('guttermousedown', setBreakpoint);
    });

    onDestroy(stop);
</script>

<div class="box debugger">
    <div>
        {#if $debuggerState.breakpoints.length}
            all: {$debuggerState.breakpoints.join(', ')}
            <br />
            {#if $debuggerState.debugging}
                current: {$debuggerState.current}/{$debuggerState.breakpoints[$debuggerState.current]}
            {/if}
        {:else}
            Set a breakpoint to debug
        {/if}
    </div>
</div>

<style>
    .debugger {
        height: 100%;
        font-size: 12px;
        font-family: "Ubuntu Mono", monospace;
    }
</style>
