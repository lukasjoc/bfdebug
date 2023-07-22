<script lang="ts">
    import type { Editor } from 'brace';
    import Icon from './Icon.svelte';
    import type { LigatureIcon } from '$lib/icons';
    import sharedEditor from '$lib/stores/editor';
    import { sharedStdout } from '$lib/brainfuck';
    import { onDestroy } from 'svelte';
    import Brainfuck from '$lib/brainfuck';

    let editor: Editor | null = null;
    const stopEditor = sharedEditor.subscribe((e) => {
        editor = e;
    });

    function run() {
        if (!editor) {
            return;
        }
        sharedStdout.update((stdout) => {
            stdout.clear();
            return stdout;
        });
        const bf = new Brainfuck(editor.getValue());
        bf.evaluate();
    }

    function debug() {
        console.log('debug not implemented');
    }

    type ToolConfig = {
        label: string;
        icon: LigatureIcon;
        action: () => void;
        disabled?: true;
    };

    const tools: ToolConfig[] = [
        { label: 'Debug', icon: 'view', action: debug, disabled: true },
        { label: 'Run', icon: 'refreshbutton', action: run }
    ];

    onDestroy(stopEditor);
</script>

<div class="toolbar flex">
    {#each tools as tool}
        <button on:click={tool.action} disabled={tool.disabled}>
            <Icon icon={tool.icon} label={tool.label} />
        </button>
    {/each}
</div>

<style>
    .toolbar {
        height: 25px;
        border-bottom: var(--border-default);
        background-color: var(--primary);
        justify-content: flex-end;
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
</style>
