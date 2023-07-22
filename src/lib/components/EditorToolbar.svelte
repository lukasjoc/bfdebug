<script lang="ts">
    import Icon from './Icon.svelte';
    import type { LigatureIcon } from '$lib/icons';
    import { editor, debuggerState } from '$lib/stores/editor';
    import { stdout, brainfuck } from '$lib/brainfuck';

    function run() {
        if (!$editor) {
            return;
        }
        $stdout.clear();
        $brainfuck.resetTape();
        $brainfuck.evaluate($editor.getValue());
    }

    function stopDebugger() {
        $editor?.setReadOnly(false);
        $debuggerState.debugging = false;
        $debuggerState.current = 0;
    }

    function startDebugger() {
        if (!$debuggerState.breakpoints?.length) {
            stopDebugger();
        }
        $editor?.moveCursorTo(0,0, true);
        $brainfuck.resetTape();
        $editor?.setReadOnly(true);
        $debuggerState.debugging = true;
        $debuggerState.current = -1;
        $debuggerState.pos = -1;
        jumpToNext();
    }

    function jumpToNext() {
        if ($debuggerState.current + 1 < $debuggerState.breakpoints?.length) {
            $debuggerState.current += 1;

            $editor?.moveCursorTo(
                $debuggerState.breakpoints[$debuggerState.current],
                0,
                true,
            );

            console.log('CURRENT: ', $debuggerState);

            if($editor?.getCursorPosition().row !== 0) {
                const contextAbove = $editor?.session
                    .getLines(0, Math.max(0, $debuggerState.breakpoints[$debuggerState.current]-1))
                    .join('\n');
                console.log(contextAbove);
                if(contextAbove?.length) {
                    $brainfuck.resetTape();
                    $brainfuck.evaluate(contextAbove);
                }
            }

            stepRun();
        } else {
            stopDebugger();
        }
    }

    function jumpToPrev() {
        if ($debuggerState.current > 0) {
            $debuggerState.current -= 1;

            $editor?.moveCursorTo(
                $debuggerState.breakpoints[$debuggerState.current],
                0,
                true,
            );


            if($editor?.getCursorPosition().row !== 0) {
                const contextAbove = $editor?.session
                    .getLines(0, Math.max(0, $debuggerState.breakpoints[$debuggerState.current]-1))
                    .join('\n');
                console.log(contextAbove);
                if(contextAbove?.length) {
                    $brainfuck.resetTape();
                    $brainfuck.evaluate(contextAbove);
                    $debuggerState.pos = contextAbove?.length-1;
                }
            }else {
                $brainfuck.resetTape();
            }
            stepRun();
        }
    }

    function stepRun() {
        const row = $debuggerState.breakpoints[$debuggerState.current];
        $debuggerState.pos += 1;
        const rest = $editor?.session
            .getLines(row, $editor.session.getLength())
            .join('\n');
        if (rest?.[$debuggerState.pos]) {
            const char = rest[$debuggerState.pos];
            $brainfuck.evaluate(char);
            console.log('step: ', rest, row, $debuggerState.pos, char, $brainfuck.getValueAtPtr());
        }else {
            stopDebugger();
        }
    }

    type ToolConfig =
        | {
              label: string;
              icon: LigatureIcon;
              action: () => void;
              disabled?: boolean;
          }
        | ({ divider: true } & {
              label?: never;
              icon?: never;
              action?: never;
              disabled?: never;
          });

    $: tools = [
        {
            label: 'Run',
            icon: 'refreshbutton',
            action: run,
            disabled: $debuggerState.debugging,
        },
        { divider: true },
        {
            label: !$debuggerState.debugging ? 'Debug' : 'Debugging',
            icon: 'view',
            action: startDebugger,
            disabled:
                $debuggerState.debugging || !$debuggerState.breakpoints?.length,
        },
        {
            label: 'Prev',
            icon: 'back',
            action: jumpToPrev,
            disabled: !$debuggerState.debugging || $debuggerState.current === 0,
        },
        {
            label: 'Next',
            icon: 'next',
            action: jumpToNext,
            disabled: !$debuggerState.debugging,
        },
        {
            label: 'Step',
            icon: 'next',
            action: stepRun,
            disabled: !$debuggerState.debugging,
        },
    ] as ToolConfig[];
</script>

<div class="toolbar flex">
    {#each tools as tool}
        {#if 'divider' in tool}
            <span class="divider" />
        {:else}
            <button on:click={tool.action} disabled={tool.disabled}>
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
