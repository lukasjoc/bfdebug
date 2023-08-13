<script lang="ts">
    import Action from './Action.svelte';
    import {interpreter} from '$lib/stores';
    let tape = $interpreter.getTape()
    function update() {
        tape = $interpreter.getTape()
    }
</script>

<Action label="Memory">
    <button on:click={update}> Refresh </button>
    <table>
        <tr>
        {#each tape as  _, i}
                <td>{String(i).padStart(6, '0')}</td>
            {/each}
        </tr>
        <tr>
            {#each tape as v, _}
                <td>{String(v)}</td>
            {/each}
        </tr>
    </table>
</Action>
