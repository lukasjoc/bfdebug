<script lang="ts">
    import '$lib/global.css';
    import { stdout } from '$lib/brainfuck';
</script>

<div class="stdout">
    <table>
        {#each $stdout.lines() as line, nr}
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
        font-family: "Ubuntu Mono", monospace;
        border: var(--border-primary);
    }
</style>
