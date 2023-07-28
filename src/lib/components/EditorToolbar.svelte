<script lang="ts">
    import Icon from './Icon.svelte';
    import type { LigatureIcon } from '$lib/icons';
    import { manager } from '$lib/stores/editor';
    import { onDestroy } from 'svelte';

    type ToolConfig =
        | { label: string; icon: LigatureIcon; action: () => void; disabled?: boolean }
        | ({ divider: true }
        & { label?: never; icon?: never; action?: never; disabled?: never; });

    let enabled = false;
    const managerSubscription = manager.subscribe((m) => {enabled = m.isEnabled()??false;});
    onDestroy(managerSubscription);

    $: tools = [
        {
            label: 'Run',
            icon: 'refreshbutton',
            action: () => $manager.run(),
        },
        { divider: true },
        {
            label: 'Debug',
            icon: 'view',
            action: () => $manager.enable(),
        },
        {
            label: 'Prev',
            icon: 'back',
            action: () => $manager.prev(),
        },
        {
            label: 'Next',
            icon: 'next',
            action: () => $manager.next(),
        },
        {
            label: 'Step',
            icon: 'next',
            action: () => $manager.stepNext(),
        },
    ] as ToolConfig[];
</script>

<div class="toolbar flex">
    {#each tools as tool}
        {#if 'divider' in tool}
            <span class="divider" />
        {:else}
            <button
                on:click={tool.action}>
                <Icon icon={tool.icon} label={tool.label} />
            </button>
        {/if}
    {/each}
</div>

<style>
    .toolbar {
        height: 25px;
        border-bottom: var(--border-default);
        background-color: var(--primary);
        justify-content: flex-start;
    }

    button {
        cursor: pointer;
        outline: none;
        border: var(--border-default);
        height: 100%;
        padding-left: 2px;
        padding-right: 2px;
    }

    button:hover {
        border-color: var(--secondary);
    }
    .divider {
        width: 10px;
    }
</style>
