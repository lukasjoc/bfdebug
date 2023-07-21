<script lang="ts">
	import '@picocss/pico';
	import * as ace from 'brace';
	import 'brace/keybinding/vim';
	import { onDestroy, onMount } from 'svelte';

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
			editor.setValue(',[.,]');
		}
	});
	onDestroy(() => {
		if (editor) {
			editor.destroy();
			editor.container.remove();
			editor = undefined;
		}
	});
</script>

<div class="grid wrapper">
	<div>
		<div class="box" bind:this={editorEl} style="height: 600px;" />
		<div class="box" style="height: 200px;">stdout</div>
	</div>
	<div class="box" style="height: 807px;">debugger</div>
</div>

<style>
	.box {
		border: 2px dotted #fefe;
		margin: 7px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #bbb;
	}
</style>
