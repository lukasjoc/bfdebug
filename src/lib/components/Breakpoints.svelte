<script lang="ts">
    import Action from './Action.svelte';
    import {debuggerInstance} from '$lib/stores';
</script>

<Action label="Breakpoints">
    <table>
        <tr>
            <th>Line</th>
            <th>State</th>
        </tr>
        {#each $debuggerInstance.breakpoints as breakpoint }
        <tr>
            <td> {breakpoint} </td>
            <td> TODO </td>
        </tr>
        {/each}
    </table>
</Action>
