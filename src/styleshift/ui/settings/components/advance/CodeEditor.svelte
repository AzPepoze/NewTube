<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { codemirror, global_functions_metadata } from "@core/extension";
	import { logger } from "@functions/logger";

	let { value = $bindable(""), language = "javascript", height = 400, onBlur, onInput } = $props();

	let container: HTMLDivElement;
	let view: any;

	onMount(() => {
		if (!container) return;

		const init = () => {
			if (!codemirror) {
				setTimeout(init, 100);
				return;
			}

			const {
				EditorView,
				basicSetup,
				javascript,
				css,
				oneDark,
				EditorState,
				autocompletion,
				hoverTooltip,
				tooltips,
			} = codemirror;

			function styleshiftCompletions(context: any) {
				const word = context.matchBefore(/[\w$]*/);
				if (!word || (word.from === word.to && !context.explicit)) return null;

				logger.info(
					"ui",
					"Providing completions for:",
					word.text,
					"Metadata count:",
					global_functions_metadata.length,
				);

				return {
					from: word.from,
					options: global_functions_metadata.map((m) => ({
						label: m.label,
						type: m.type,
						detail: m.detail,
						info: m.info ? m.info.replace(/\r/g, "") : "",
					})),
				};
			}

			const styleshiftHover = hoverTooltip((view: any, pos: number, side: number) => {
				const { from, to, text } = view.state.doc.lineAt(pos);
				let start = pos,
					end = pos;
				while (start > from && /[\w$]/.test(text[start - from - 1])) start--;
				while (end < to && /[\w$]/.test(text[end - from])) end++;
				if ((start == pos && side < 0) || (end == pos && side > 0)) return null;

				const word = text.slice(start - from, end - from);
				const metadata = global_functions_metadata.find((m) => m.label === word);
				if (!metadata) return null;

				return {
					pos: start,
					end,
					above: true,
					create() {
						const dom = document.createElement("div");
						dom.className = "cm-styleshift-tooltip";

						const title = document.createElement("div");
						title.className = "cm-tooltip-title";
						title.style.fontWeight = "bold";
						title.style.fontSize = "16px";
						title.style.color = "var(--Theme-0, #ff0000)";
						title.style.borderBottom = "1px solid var(--White-10)";
						title.style.marginBottom = "8px";
						title.style.paddingBottom = "4px";
						title.textContent = metadata.label + (metadata.detail || "");
						dom.appendChild(title);

						if (metadata.info) {
							const info = document.createElement("div");
							info.className = "cm-tooltip-info";
							info.style.whiteSpace = "pre-wrap";
							info.style.fontSize = "15px";
							info.style.lineHeight = "1.5";
							info.style.color = "var(--White-80)";
							info.textContent = metadata.info.replace(/\r/g, "");
							dom.appendChild(info);
						}

						return { dom };
					},
				};
			});

			const extensions = [
				basicSetup,
				oneDark,
				tooltips({
					parent: document.body,
				}),
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
					},
				}),
			];

			if (language === "javascript" || language === "js") {
				extensions.push(
					javascript({
						extraKeywords: [],
					}),
				);
				extensions.push(
					autocompletion({
						override: [styleshiftCompletions],
					}),
				);
				extensions.push(styleshiftHover);
			} else if (language === "css") {
				extensions.push(css());
			}

			view = new EditorView({
				state: EditorState.create({
					doc: value,
					extensions,
				}),
				parent: container,
			});
		};

		init();
	});

	onDestroy(() => {
		if (view) {
			view.destroy();
		}
	});

	export function setValue(newVal: string) {
		if (view) {
			view.dispatch({
				changes: { from: 0, to: view.state.doc.length, insert: newVal },
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

	:global(.cm-styleshift-tooltip) {
		background: var(--BG-Surface, #1e1e1e);
		border: 1px solid var(--Border-Color, #333);
		border-radius: 8px;
		padding: 12px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
		max-width: 600px;
		z-index: 10000000 !important;
	}

	:global(.cm-tooltip) {
		border: none !important;
		z-index: 10000000 !important;
	}

	:global(.cm-tooltip-autocomplete) {
		z-index: 10000000 !important;
	}
</style>
