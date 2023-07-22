<script lang="ts">
    import type { Line } from '$lib/brainfuck';
    import '$lib/global.css';
    import { sharedStdout } from '$lib/brainfuck';
    import { onDestroy } from 'svelte';

    let lines: Readonly<Line[]> = [];
    const stop = sharedStdout.subscribe((stdout) => {
        lines = stdout?.lines() ?? [];
    });
    onDestroy(stop);
</script>

<div class="stdout">
    <table>
        {#each lines as line, nr}
            <tr>{nr + 1} {line}</tr>
        {/each}
    </table>
</div>

<style>
    :root {
        --stdout-height: 200px;
    }

    .stdout {
        min-height: var(--stdout-height);
        background-color: var(--primary);
        margin-top: 3px;
        overflow: auto;
    }

    table {
        height: 100%;
        width: 100%;
    }
    tr {
        width: 100%;
        font-size: 12px;
        font-family: 'Ubuntu Mono', monospace;
        border: var(--border-primary);
    }
</style>
