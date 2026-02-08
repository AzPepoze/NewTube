<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { codemirror } from "@core/extension";

	let { value = $bindable(""), language = "javascript", height = 400, onBlur, onInput } = $props();

	let container: HTMLDivElement;
	let view: any;

	onMount(() => {
		if (!container) return;
		if (!codemirror) {
			console.error("Codemirror not loaded!");
			return;
		}

		const { EditorView, basicSetup, javascript, css, oneDark, EditorState } = codemirror;

		const extensions = [
			basicSetup,
			oneDark,
			EditorView.lineWrapping,
			EditorView.updateListener.of((update: any) => {
				if (update.docChanged) {
					const newVal = update.state.doc.toString();
					value = newVal;
					onInput?.(newVal);
				}
			}),
			EditorView.domEventHandlers({
				blur: () => {
					onBlur?.(view.state.doc.toString());
				}
			})
		];

		if (language === "javascript" || language === "js") {
			extensions.push(javascript());
		} else if (language === "css") {
			extensions.push(css());
		}

		view = new EditorView({
			state: EditorState.create({
				doc: value,
				extensions
			}),
			parent: container
		});
	});

	onDestroy(() => {
		if (view) {
			view.destroy();
		}
	});

	export function setValue(newVal: string) {
		if (view) {
			view.dispatch({
				changes: { from: 0, to: view.state.doc.length, insert: newVal }
			});
		}
	}

	export function getValue() {
		return view ? view.state.doc.toString() : value;
	}
</script>

<div bind:this={container} class="STYLESHIFT-Code-Editor-Container" style:height="{height}px"></div>

<style lang="scss">
	.STYLESHIFT-Code-Editor-Container {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid var(--Border-Color);
		border-radius: 8px;
		overflow: hidden;
		margin-top: 10px;
		transition: border-color 0.2s;

		:global(.cm-editor) {
			height: 100%;
		}

		:global(.cm-scroller) {
			font-family: "Fira Code", monospace;
			font-size: 16px;
		}

		&:focus-within {
			border-color: var(--Theme-0, #ff0000);
		}
	}
</style>
