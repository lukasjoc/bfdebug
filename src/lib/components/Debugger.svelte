<script lang="ts">
    import '$lib/global.css';
    import { manager } from '$lib/stores/editor';
    import type { Editor, Position } from 'brace';
    import { onDestroy } from 'svelte';

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
        $manager.breakpoints = [];
        for (const i in bpts) {
            const ni = Number(i);
            if (bpts[ni] !== undefined) {
                $manager.breakpoints.push(ni);
            }
        }
        event.stop();
    }

    const managerSubscription = manager.subscribe(
        m => m?.editor?.on('guttermousedown', setBreakpoint)
    );
    onDestroy(managerSubscription);
</script>

<div class="box debugger">
    <div>
        {#if $manager.breakpoints.length}
            all: {$manager.breakpoints.join(', ')}
            <br />
            {#if $manager.isEnabled()}
                current: {$manager.getCurrent()}
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
