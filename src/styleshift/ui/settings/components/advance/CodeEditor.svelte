<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { monaco as monacoInstance } from "../../../../core/extension";

	let { value = $bindable(""), language = "javascript", height = 400, onBlur, onInput } = $props();

	let container: HTMLDivElement;
	let editor: any;
	let model: any;

	onMount(() => {
		if (!container) return;

		model = monacoInstance.editor.createModel(value, language);
		editor = monacoInstance.editor.create(container, {
			model: model,
			automaticLayout: true,
			theme: "vs-dark",
			minimap: { enabled: false },
			fontSize: 14,
			lineNumbers: "on",
			roundedSelection: true,
			scrollBeyondLastLine: false,
			readOnly: false,
			cursorStyle: "line",
			glyphMargin: false,
			folding: true,
		});

		editor.onDidChangeModelContent(() => {
			const newVal = editor.getValue();
			value = newVal;
			onInput?.(newVal);
		});

		editor.onDidBlurEditorWidget(() => {
			onBlur?.(editor.getValue());
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.dispose();
		}
		if (model) {
			model.dispose();
		}
	});

	export function setValue(newVal: string) {
		if (editor) {
			editor.setValue(newVal);
		}
	}

	export function getValue() {
		return editor ? editor.getValue() : value;
	}
</script>

<div bind:this={container} class="STYLESHIFT-Code-Editor-Container" style:height="{height}px"></div>

<style lang="scss">
	.STYLESHIFT-Code-Editor-Container {
		width: 100%;
		border: 1px solid var(--White-10);
		border-radius: 8px;
		overflow: hidden;
		margin-top: 10px;
		transition: border-color 0.2s;

		&:focus-within {
			border-color: var(--theme-color, #ff0000);
		}
	}
</style>
