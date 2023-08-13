<script lang="ts">
    import Breakpoints from '$lib/components/Breakpoints.svelte';
    import Controls from '$lib/components/Controls.svelte';
    import Editor from '$lib/components/Editor.svelte';
    import Memory from '$lib/components/Memory.svelte';
    import Output from '$lib/components/Output.svelte';
</script>

<div class="wrapper">
    <div class="editor">
        <Editor />
    </div>
    <aside>
        <Controls />
        <section>
            <Breakpoints />
            <Output />
            <Memory />
        </section>
    </aside>
</div>

<style>
    .wrapper {
        display: flex;
        flex-flow: row nowrap;
        height: 100vh;
    }

    .editor {
        height: 100%;
        width: 45vw;
        background: green;
    }

    aside {
        display: flex;
        flex-flow: column nowrap;
        width: 55vw;
        height: 100%;
    }

    aside > section {
        height: 100%;
        width: 100%;
        border-top: 1px solid #aaa;
        margin-top: 10px;
    }
</style>
