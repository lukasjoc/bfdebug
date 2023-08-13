<script lang="ts">
    import IconArrowBottom from '$lib/icons/ArrowBottom.svg';
    import IconArrowTop from '$lib/icons/ArrowTop.svg';
    import IconArrowRightSide from '$lib/icons/ArrowRightSide.svg';
    import IconDebuggerStart from '$lib/icons/DebuggerStart.svg';
    import IconRefresh from '$lib/icons/Refresh.svg';
    import { debuggerInstance } from '$lib/stores';
</script>

<section>
    <button on:click={() => $debuggerInstance.run()}>
        <img height="20" width="20" src={IconRefresh} alt="refresh" /> Run
    </button>
    <button on:click={() => $debuggerInstance.enable()}>
        <img height="20" width="20" src={IconDebuggerStart} alt="debugger-start" /> Start Debugger
    </button>
    <button  on:click={() => $debuggerInstance.prev()}>
        <img height="20" width="20" src={IconArrowTop} alt="arrow-top" /> Prev
    </button>
    <button  on:click={() => $debuggerInstance.next()}>
        <img height="20" width="20" src={IconArrowBottom} alt="arrow-bottom" />Next
    </button>
    <button  on:click={() => $debuggerInstance.stepNext()}>
        <img height="20" width="20" src={IconArrowRightSide} alt="arrow-right-side" /> Step
    </button>
</section>

<style>
    section {
        display: flex;
        height: 25px;
        width: 100%;
        padding: 2px;
        border-bottom: 1px solid #aaa;
    }
    button {
        margin-right: 2px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        outline: none;
        border: 1px solid #aaa;
    }

    button:hover {
        background: #bbb;
    }
</style>
