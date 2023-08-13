<script lang="ts">
    import ArrowRight from '$lib/icons/ArrowRight.svg';
    import ArrowDown from '$lib/icons/ArrowDown.svg';
    export let label: string;
    export let open: boolean = true;
</script>

<div class="action">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="action-label" on:click={() => open = !open}>
        <div class="action-label-toggle">
            <img
                width="20" height="20"
                src={open ? ArrowDown : ArrowRight}
                alt="toggle"
            />
        </div>
        <div class="action-label-content">{label}</div>
    </div>
    {#if open}
        <div class="action-content">
            <slot />
        </div>
    {/if}
</div>

<style>
    .action {
        border-bottom: .5px solid #bbb;
        width: 100%;
        height: auto;
    }

    .action-label {
        display: flex;
        cursor: pointer;
        height: 20px;
        width: 100%;
    }
    .action-label:hover {
        background: #bbb;
    }
    .action-content {
        height: auto;
        width: 100%;
        background: #bbb;
        overflow: auto;
    }
    .action-label-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 2px;
        width:100%;
        overflow: auto;
    }
    .action-label-toggle {
        display: flex;
        width: 5%;
        justify-content: center;
        align-items: center;
    }
</style>
