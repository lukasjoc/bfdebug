<script lang="ts">
	// import '@picocss/pico';
	import * as ace from 'brace';
	import 'brace/keybinding/vim';
	import { onDestroy, onMount } from 'svelte';
	import Brainfuck from '$lib/brainfuck';

	let editorEl: HTMLDivElement | undefined = undefined;
	let editor: ace.Editor | undefined = undefined;

	onMount(() => {
		if (editorEl) {
			editor = ace.edit(editorEl);
			// TODO: write a brainfuck mode
			editor.getSession().setMode('ace/mode/text');
			editor.setHighlightActiveLine(true);
			editor.setOptions({
				autoScrollEditorIntoView: true,
				copyWithEmptySelection: true
			});
			editor.session.setTabSize(4);
			editor.session.setUseWrapMode(true);
			editor.setShowPrintMargin(false);
			editor.setKeyboardHandler('ace/keyboard/vim');

			// set to readonly when in debug mode
			// editor.setReadOnly(true);  // false to make it editable
			editor.setValue(
				'++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.'
			);
		}
	});
	onDestroy(() => {
		if (editor) {
			editor.destroy();
			editor.container.remove();
			editor = undefined;
		}
	});

    type Line = string;
	let stdout: Line[] = [];
	function run() {
		if (!editor) {
			return;
		}
		const brainfuck = new Brainfuck(editor.getValue());
		stdout = brainfuck.evaluate();
	}
</script>

<div class="grid">
	<div class="wrapper">
		<div class="toolbar">
			<button
				disabled
				on:click={() => alert('impl debug')}
				class="toolbar-btn lsf-icon"
				title="eye"
			>
				<small>Debug</small>
			</button>
			<button on:click={run} class="toolbar-btn lsf-icon" title="refreshbutton">
				<small>Run</small>
			</button>
		</div>
		<div class="box box-editor" bind:this={editorEl} style="height: 585px;" />
		<div class="box-stdout-wrapper">
			<table class="box-stdout" style="max-height: 200px;">
                {#each stdout as line, nr}
				    <tr>{nr+1} {line}</tr>
                {/each}
			</table>
		</div>
	</div>
	<div class="box" style="height: 807px;">debugger</div>
</div>

<style>
	:root {
		--spacing: 1rem;
		--grid-spacing-vertical: 0;
		--grid-spacing-horizontal: var(--spacing);
	}

	/** Grid Minimal grid system with auto-layout columns */
	.grid {
		grid-column-gap: var(--grid-spacing-horizontal);
		grid-row-gap: var(--grid-spacing-vertical);
		display: grid;
		grid-template-columns: 1fr;
		margin: 0;
		gap: 7px;
	}
	@media (min-width: 992px) {
		.grid {
			grid-template-columns: repeat(auto-fit, minmax(0%, 1fr));
		}
	}

	.grid > * {
		min-width: 0;
	}

	.box {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #bbb;
		width: 100%;
	}
	.box-editor {
		margin-right: 0px;
	}

	.box-stdout-wrapper {
		height: 200px;
		overflow: auto;
		background-color: #bbb;
		margin-top: 3px;
	}
	.box-stdout {
		width: 100%;
	}
	tr {
		font-size: 12px;
		font-family: monospace;
		width: 100%;
		border: 1px solid #aaa;
	}
	.toolbar {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		background-color: #bbb;
		height: 20px;
		border-bottom: 1px solid #aaa;
	}

	button {
		cursor: pointer;
		outline: none;
		border: 1px solid #aaa;
	}

	.toolbar-btn {
		height: 100%;
		padding-left: 2px;
		padding-right: 2px;
	}
	.toolbar-btn:hover {
		border: 1px solid #000;
	}
</style>
