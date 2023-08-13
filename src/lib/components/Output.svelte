<script lang="ts">
    import Action from './Action.svelte';
    import { stdout } from '$lib/brainfuck';
</script>

<Action label="Output">
    <table>
        <tr>
            <th>Line</th>
            <th>Output</th>
        </tr>
        {#each $stdout.lines() as line, nr }
            <tr>
                <td> {nr+1} </td>
                <td> {line} </td>
            </tr>
        {/each}
    </table>
</Action>
