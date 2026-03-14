<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import {
		codemirrorInstance,
		globalMetadataCache,
	} from "@/styleshift/core/runtimeController";
	import { logger } from "@/shared/logger";
	import TextEditor from "./TextEditor.svelte";

	let {
		value = $bindable(""),
		language = "javascript",
		height = 400,
		onBlur,
		onInput,
	} = $props();

	let container: HTMLDivElement;
	let editorWrapper = $state<HTMLDivElement>();
	let view: any;
	let fallbackMode = $state(false);

	function normalizeInfo(text: string) {
		return String(text || "")
			.replace(/\r/g, "")
			.replace(/\s*@/g, "\n@")
			.trim();
	}

	function parseInfoSections(text: string) {
		const normalized = normalizeInfo(text);
		if (!normalized) {
			return { summary: "", tags: [] as string[] };
		}

		const lines = normalized
			.split(/\n+/)
			.map((line) => line.trim())
			.filter(Boolean);

		const summaryLines: string[] = [];
		const tags: string[] = [];

		for (const line of lines) {
			if (line.startsWith("@")) {
				tags.push(line);
			} else {
				summaryLines.push(line);
			}
		}

		return {
			summary: summaryLines.join(" "),
			tags,
		};
	}

	function renderInfoNode(entry: any) {
		const root = document.createElement("div");
		root.className = "cm-metadata-doc";

		const { summary, tags } = parseInfoSections(entry.info || "");

		if (summary) {
			const summaryEl = document.createElement("div");
			summaryEl.className = "cm-metadata-summary";
			summaryEl.textContent = summary;
			root.appendChild(summaryEl);
		}

		if (tags.length) {
			const tagsEl = document.createElement("div");
			tagsEl.className = "cm-metadata-tags";

			for (const tagText of tags) {
				const row = document.createElement("div");
				row.className = "cm-metadata-tag-row";

				const match = /^(@\w+)\s*(.*)$/.exec(tagText);
				const tag = document.createElement("span");
				tag.className = "cm-metadata-tag";
				tag.textContent = match ? match[1] : "@tag";

				const body = document.createElement("span");
				body.className = "cm-metadata-tag-body";
				body.textContent = match ? match[2] : tagText;

				row.append(tag, body);
				tagsEl.appendChild(row);
			}

			root.appendChild(tagsEl);
		}

		return root;
	}

	function metadataOptions() {
		return globalMetadataCache.map((entry) => ({
			label: entry.label,
			type: entry.type,
			detail: entry.detail,
			info: () => renderInfoNode(entry),
			boost: 20,
		}));
	}

	function normalizeSymbol(text: string) {
		return text.trim().replace(/[\s(){}\[\],;]+$/g, "");
	}

	function findMetadata(word: string) {
		const normalized = normalizeSymbol(word);
		if (!normalized) return null;

		return (
			globalMetadataCache.find(
				(entry: any) => entry.label === normalized,
			) ||
			globalMetadataCache.find(
				(entry: any) =>
					String(entry.label).toLowerCase() ===
					normalized.toLowerCase(),
			)
		);
	}

	onMount(() => {
		if (!editorWrapper) return;

		const init = () => {
			if (!codemirrorInstance) {
				setTimeout(init, 100);
				return;
			}

			try {
				const {
					EditorView: editorView,
					basicSetup,
					javascript,
					localCompletionSource,
					scopeCompletionSource,
					css,
					cssCompletionSource,
					dracula,
					EditorState: editorState,
					autocompletion,
					search,
					hoverTooltip,
					tooltips,
				} = codemirrorInstance;

				const styleshiftCompletions = (context: any) => {
					const word = context.matchBefore(/[\w$]*/);
					if (
						!word ||
						(word.from === word.to && !context.explicit)
					) {
						return null;
					}

					return {
						from: word.from,
						options: metadataOptions(),
					};
				};

				const jsDefaultCompletion =
					scopeCompletionSource(globalThis);

				const styleshiftHover = hoverTooltip(
					(view: any, pos: number, side: number) => {
						const { from, to, text } =
							view.state.doc.lineAt(pos);
						let start = pos;
						let end = pos;

						while (
							start > from &&
							/[\w$]/.test(text[start - from - 1])
						) {
							start--;
						}
						while (
							end < to &&
							/[\w$]/.test(text[end - from])
						) {
							end++;
						}

						if (
							(start === pos && side < 0) ||
							(end === pos && side > 0)
						) {
							return null;
						}

						const word = text.slice(start - from, end - from);
						const metadata = findMetadata(word);
						if (!metadata) {
							return null;
						}

						return {
							pos: start,
							end,
							above: true,
							create() {
								const dom =
									document.createElement("div");
								dom.className = "cm-styleshift-tooltip";
								dom.style.maxWidth = "60ch";
								dom.style.maxHeight = "34vh";
								dom.style.overflow = "auto";

								const header =
									document.createElement("div");
								header.className = "cm-tooltip-header";

								const title =
									document.createElement("div");
								title.className = "cm-tooltip-title";
								title.textContent = metadata.label;
								header.appendChild(title);

								if (metadata.detail || metadata.type) {
									const badge =
										document.createElement(
											"span",
										);
									badge.className =
										"cm-tooltip-badge";
									badge.textContent =
										metadata.detail ||
										metadata.type;
									header.appendChild(badge);
								}

								dom.appendChild(header);

								if (metadata.info) {
									const info =
										renderInfoNode(metadata);
									info.classList.add(
										"cm-tooltip-info",
									);
									dom.appendChild(info);
								}

								return { dom };
							},
						};
					},
				);

				const extensions = [
					...basicSetup,
					dracula,
					search({ top: true }),
					tooltips({ parent: document.body }),
					editorView.updateListener.of((update: any) => {
						if (update.docChanged) {
							const newValue = update.state.doc.toString();
							value = newValue;
							onInput?.(newValue);
						}
					}),
					editorView.domEventHandlers({
						blur: () => {
							onBlur?.(view.state.doc.toString());
						},
					}),
					styleshiftHover,
				];

				if (language === "javascript" || language === "js") {
					extensions.push(javascript());
					extensions.push(
						autocompletion({
							override: [
								styleshiftCompletions,
								localCompletionSource,
								jsDefaultCompletion,
							],
						}),
					);
				} else if (language === "css") {
					extensions.push(css());
					extensions.push(
						autocompletion({
							override: [cssCompletionSource],
						}),
					);
				} else {
					extensions.push(autocompletion());
				}

				view = new editorView({
					state: editorState.create({
						doc:
							typeof value === "string"
								? value
								: String(value || ""),
						extensions,
					}),
					parent: editorWrapper,
				});

				logger.info(
					"ui",
					"CodeEditor initialized with CodeMirror 6",
				);
			} catch (err) {
				logger.error("ui", "Failed to initialize CodeEditor", err);
				fallbackMode = true;
			}
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
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: newVal,
				},
			});
		}
	}

	export function getValue() {
		return view ? view.state.doc.toString() : value;
	}
</script>

<div
	bind:this={container}
	class="STYLESHIFT-Code-Editor-Container"
	style:height="{height}px"
>
	{#if !fallbackMode}
		<div bind:this={editorWrapper} class="editor-wrapper"></div>
	{:else}
		<TextEditor bind:value {onInput} {onBlur} className="fallback-mode" />
	{/if}
</div>

<style lang="scss">
	.STYLESHIFT-Code-Editor-Container {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid var(--Border-Color);
		border-radius: 8px;
		overflow: hidden;
		margin-top: 10px;
		transition: border-color 0.2s;

		&:focus-within {
			border-color: var(--Theme-0);
		}
	}

	.editor-wrapper {
		width: 100%;
		height: 100%;
		min-height: 0;
		:global(.cm-editor) {
			height: 100%;
			padding: 10px;
		}

		:global(.cm-scroller) {
			font-family: "Fira Code", monospace;
			font-size: 16px;
		}
	}

	:global(.cm-styleshift-tooltip) {
		background: #1f2330;
		border: 1px solid #6272a4;
		border-radius: 10px;
		padding: 10px;
		box-shadow: 0 14px 34px rgba(0, 0, 0, 0.55);
		z-index: 10000000 !important;
	}

	:global(.cm-tooltip-header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		border-bottom: 1px solid rgba(189, 147, 249, 0.28);
		margin-bottom: 10px;
		padding-bottom: 8px;
	}

	:global(.cm-tooltip-title) {
		font-weight: bold;
		font-size: 18px;
		color: #f8f8f2;
		line-height: 1.2;
	}

	:global(.cm-tooltip-badge) {
		font-size: 14px;
		line-height: 1;
		padding: 5px 10px;
		border-radius: 999px;
		border: 1px solid rgba(98, 114, 164, 0.7);
		background: rgba(189, 147, 249, 0.16);
		color: #bd93f9;
		white-space: nowrap;
	}

	:global(.cm-tooltip-info) {
		word-break: break-word;
		font-size: 14px;
		line-height: 1.6;
		color: #e6e6f2;
		margin-top: 10px;
	}

	:global(.cm-metadata-doc) {
		display: grid;
		gap: 10px;
	}

	:global(.cm-metadata-summary) {
		white-space: pre-wrap;
		font-size: 14px;
		line-height: 1.6;
		color: #f1f2f8;
	}

	:global(.cm-metadata-tags) {
		display: grid;
		gap: 8px;
	}

	:global(.cm-metadata-tag-row) {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 10px;
		align-items: start;
	}

	:global(.cm-metadata-tag) {
		font-family: monospace;
		font-size: 14px;
		padding: 3px 8px;
		border-radius: 999px;
		background: rgba(80, 250, 123, 0.12);
		border: 1px solid rgba(80, 250, 123, 0.5);
		color: #50fa7b;
		white-space: nowrap;
	}

	:global(.cm-metadata-tag-body) {
		white-space: pre-wrap;
		font-size: 14px;
		line-height: 1.5;
		color: #d7d9e4;
	}

	:global(.cm-tooltip) {
		border: none !important;
		z-index: 10000000 !important;
	}

	:global(.cm-completionInfo) {
		max-width: min(88ch, 66vw);
		max-height: 52vh;
		overflow: auto;
		padding: 14px 16px;
		background: #1f2330;
		border: 1px solid #6272a4;
		border-radius: 10px;
		box-shadow: 0 14px 34px rgba(0, 0, 0, 0.55);
		font-size: 14px;
		line-height: 1.55;
		color: #e6e6f2;
	}

	:global(.cm-tooltip-autocomplete) {
		z-index: 10000001 !important;
		min-width: 480px;
		max-width: min(86ch, 62vw);
	}

	:global(.cm-tooltip.cm-tooltip-autocomplete > ul) {
		max-height: 320px;
		overflow-y: auto;
	}

	:global(.cm-tooltip.cm-tooltip-autocomplete > ul > li) {
		font-size: 14px;
		line-height: 1.45;
		padding: 6px 10px;
	}

	:global(.cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]) {
		background: rgba(98, 114, 164, 0.35);
		outline: 1px solid rgba(189, 147, 249, 0.6);
	}

	:global(.cm-completionLabel) {
		font-size: 14px;
	}

	:global(.cm-completionDetail) {
		font-size: 14px;
		opacity: 0.95;
	}

	:global(.cm-completionIcon) {
		transform: scale(1.1);
	}

	:global(.cm-panels) {
		background: #1a1f2b;
		border-bottom: 1px solid rgba(98, 114, 164, 0.45);
		color: #e6e6f2;
	}

	:global(.cm-panels-top) {
		position: absolute;
		top: 10px;
		right: 10px;
		left: auto;
		width: auto;
		max-width: min(760px, calc(100% - 20px));
		background: transparent;
		border: none;
		z-index: 30;
		pointer-events: none;
	}

	:global(.cm-panels-top .cm-panel.cm-search) {
		pointer-events: auto;
		margin: 0;
		border: 1px solid rgba(98, 114, 164, 0.6);
		border-radius: 10px;
	}

	:global(.cm-panel.cm-search) {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 10px;
		padding: 10px 12px;
		font-size: 14px;
		line-height: 1.35;
		background: #1f2330;
		border-top: 1px solid rgba(98, 114, 164, 0.3);
	}

	:global(.cm-panel.cm-search label) {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: #d7d9e4;
	}

	:global(.cm-textfield) {
		height: 34px;
		min-width: 200px;
		padding: 0 11px;
		border-radius: 9px;
		border: 1px solid rgba(98, 114, 164, 0.7);
		background: linear-gradient(180deg, #181d2b 0%, #141927 100%);
		color: #f8f8f2;
		font-size: 14px !important;
		line-height: 1.2;
		outline: none;
		transition:
			border-color 0.16s ease,
			box-shadow 0.16s ease,
			background-color 0.16s ease;
	}

	:global(.cm-textfield:hover) {
		border-color: rgba(139, 233, 253, 0.6);
	}

	:global(.cm-textfield::placeholder) {
		color: rgba(230, 230, 242, 0.48);
	}

	:global(.cm-textfield:focus),
	:global(.cm-textfield:focus-visible) {
		border-color: #bd93f9;
		box-shadow:
			0 0 0 2px rgba(189, 147, 249, 0.22),
			0 4px 16px rgba(0, 0, 0, 0.32);
	}

	:global(.cm-textfield.cm-invalid) {
		border-color: rgba(255, 85, 85, 0.85);
		box-shadow: 0 0 0 2px rgba(255, 85, 85, 0.2);
	}

	:global(.cm-panel.cm-search input[type="text"]) {
		height: 32px;
		min-width: 180px;
		padding: 0 10px;
		border-radius: 8px;
		border: 1px solid rgba(98, 114, 164, 0.65);
		background: #151924;
		color: #f8f8f2;
		outline: none;
	}

	:global(.cm-panel.cm-search input[type="text"]:focus) {
		border-color: #bd93f9;
		box-shadow: 0 0 0 2px rgba(189, 147, 249, 0.2);
	}

	:global(.cm-panel.cm-search input[type="checkbox"]) {
		accent-color: #bd93f9;
	}

	:global(.cm-panel.cm-search button) {
		height: 32px;
		padding: 0 10px;
		border-radius: 8px;
		border: 1px solid rgba(98, 114, 164, 0.65);
		background: #202638;
		color: #e6e6f2;
		font-size: 13px;
		cursor: pointer;
	}

	:global(.cm-panel.cm-search button:hover) {
		background: #2a3248;
		border-color: rgba(189, 147, 249, 0.7);
	}

	:global(.cm-panel.cm-search button:active) {
		transform: translateY(1px);
	}

	:global(.cm-panel.cm-search button[name="close"]) {
		margin-left: auto;
		width: 32px;
		padding: 0;
		font-size: 16px;
		line-height: 1;
	}

	:global(.cm-searchMatch) {
		background: rgba(255, 184, 108, 0.3);
		outline: 1px solid rgba(255, 184, 108, 0.65);
	}

	:global(.cm-searchMatch.cm-searchMatch-selected) {
		background: rgba(255, 121, 198, 0.32);
		outline-color: rgba(255, 121, 198, 0.75);
	}
</style>
