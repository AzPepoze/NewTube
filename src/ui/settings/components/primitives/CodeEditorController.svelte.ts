import { codemirrorInstance, globalMetadataCache } from "@/core/runtime/controller";
import { logger } from "@/shared/logger";

export interface CodeEditorOptions {
	language: string;
	onInput?: (value: string) => void;
	onBlur?: (value: string) => void;
}

/**
 * Controller for the CodeMirror 6 editor, handling initialization, 
 * metadata tooltips, and custom completions.
 */
export class CodeEditorController {
	#view: any = null;
	#fallbackMode = $state(false);
	#editorWrapper: HTMLDivElement | null = null;
	#options: CodeEditorOptions;

	constructor(options: CodeEditorOptions) {
		this.#options = options;
	}

	/* --- Getters & Setters --- */

	get fallbackMode() {
		return this.#fallbackMode;
	}

	set editorWrapper(el: HTMLDivElement | null) {
		this.#editorWrapper = el;
	}

	/* --- Lifecycle Methods --- */

	async init(initialValue: string) {
		if (!this.#editorWrapper) return;

		await this.#waitForCodeMirror();

		try {
			const cm = codemirrorInstance;
			const extensions = this.#buildExtensions(cm);

			this.#view = new cm.EditorView({
				state: cm.EditorState.create({
					doc: initialValue,
					extensions,
				}),
				parent: this.#editorWrapper,
			});

			logger.info("ui", "CodeEditor initialized with CodeMirror 6");
		} catch (err) {
			logger.error("ui", "Failed to initialize CodeEditor", err);
			this.#fallbackMode = true;
		}
	}

	destroy() {
		if (this.#view) {
			this.#view.destroy();
			this.#view = null;
		}
	}

	/* --- Public API --- */

	setValue(newVal: string) {
		if (this.#view) {
			this.#view.dispatch({
				changes: {
					from: 0,
					to: this.#view.state.doc.length,
					insert: newVal,
				},
			});
		}
	}

	getValue() {
		return this.#view ? this.#view.state.doc.toString() : "";
	}

	/* --- Private Initialization Helpers --- */

	async #waitForCodeMirror() {
		while (!codemirrorInstance) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
	}

	#buildExtensions(cm: any) {
		const extensions = [
			...cm.basicSetup,
			cm.dracula,
			cm.search({ top: true }),
			cm.tooltips({ parent: document.body }),
			this.#createUpdateListener(cm),
			this.#createBlurHandler(cm),
			this.#createHoverTooltip(cm),
		];

		const lang = this.#options.language;
		const isJS = lang === "javascript" || lang === "js";
		const isCSS = lang === "css";

		if (isJS) {
			extensions.push(cm.javascript());
			extensions.push(
				cm.autocompletion({
					override: [
						this.#createCompletions(),
						cm.localCompletionSource,
						cm.scopeCompletionSource(globalThis),
					],
				}),
			);
		} else if (isCSS) {
			extensions.push(cm.css());
			extensions.push(
				cm.autocompletion({
					override: [cm.cssCompletionSource],
				}),
			);
		} else {
			extensions.push(cm.autocompletion());
		}

		return extensions;
	}

	/* --- CodeMirror Extension Creators --- */

	#createUpdateListener(cm: any) {
		return cm.EditorView.updateListener.of((update: any) => {
			if (update.docChanged) {
				this.#options.onInput?.(update.state.doc.toString());
			}
		});
	}

	#createBlurHandler(cm: any) {
		return cm.EditorView.domEventHandlers({
			blur: () => {
				this.#options.onBlur?.(this.#view.state.doc.toString());
			},
		});
	}

	#createHoverTooltip(cm: any) {
		return cm.hoverTooltip((view: any, pos: number, side: number) => {
			const { from, to, text } = view.state.doc.lineAt(pos);
			let start = pos, end = pos;

			while (start > from && /[\w$]/.test(text[start - from - 1])) start--;
			while (end < to && /[\w$]/.test(text[end - from])) end++;

			if ((start === pos && side < 0) || (end === pos && side > 0)) return null;

			const word = text.slice(start - from, end - from);
			const metadata = this.#findMetadata(word);
			if (!metadata) return null;

			return {
				pos: start,
				end,
				above: true,
				create: () => this.#renderTooltipDOM(metadata),
			};
		});
	}

	#createCompletions() {
		return (context: any) => {
			const word = context.matchBefore(/[\w$]*/);
			if (!word || (word.from === word.to && !context.explicit)) return null;

			return {
				from: word.from,
				options: this.#getMetadataCompletionOptions(),
			};
		};
	}

	/* --- DOM Rendering Helpers --- */

	#renderTooltipDOM(metadata: any) {
		const dom = document.createElement("div");
		dom.className = "cm-styleshift-tooltip";
		dom.style.cssText = "max-width: 60ch; max-height: 34vh; overflow: auto;";

		const header = document.createElement("div");
		header.className = "cm-tooltip-header";

		const title = document.createElement("div");
		title.className = "cm-tooltip-title";
		title.textContent = metadata.label;
		header.appendChild(title);

		if (metadata.detail || metadata.type) {
			const badge = document.createElement("span");
			badge.className = "cm-tooltip-badge";
			badge.textContent = metadata.detail || metadata.type;
			header.appendChild(badge);
		}

		dom.appendChild(header);

		if (metadata.info) {
			const info = this.#renderMetadataInfo(metadata.info);
			info.classList.add("cm-tooltip-info");
			dom.appendChild(info);
		}

		return { dom };
	}

	#renderMetadataInfo(infoText: string) {
		const root = document.createElement("div");
		root.className = "cm-metadata-doc";

		const { summary, tags } = this.#parseInfoSections(infoText);

		if (summary) {
			const summaryEl = document.createElement("div");
			summaryEl.className = "cm-metadata-summary";
			summaryEl.textContent = summary;
			root.appendChild(summaryEl);
		}

		if (tags.length) {
			const tagsEl = document.createElement("div");
			tagsEl.className = "cm-metadata-tags";

			for (const tagData of tags) {
				const row = document.createElement("div");
				row.className = "cm-metadata-tag-row";
				if (tagData.tag === "@example") {
					row.classList.add("cm-metadata-example-row");
				}

				const tagEl = document.createElement("span");
				tagEl.className = "cm-metadata-tag";
				tagEl.textContent = tagData.tag;

				const bodyEl = document.createElement("span");
				bodyEl.className = "cm-metadata-tag-body";
				bodyEl.textContent = tagData.body.trim();

				if (tagData.tag === "@example") {
					bodyEl.classList.add("cm-metadata-example");
				}

				row.append(tagEl, bodyEl);
				tagsEl.appendChild(row);
			}

			root.appendChild(tagsEl);
		}

		return root;
	}

	/* --- Metadata Parsing Helpers --- */

	#getMetadataCompletionOptions() {
		return globalMetadataCache.map((entry) => ({
			label: entry.label,
			type: entry.type,
			detail: entry.detail,
			info: () => this.#renderMetadataInfo(entry.info || ""),
			boost: 20,
		}));
	}

	#findMetadata(word: string) {
		const normalized = word.trim().replace(/[\s(){}\[\] ,;]+$/g, "");
		if (!normalized) return null;

		const lower = normalized.toLowerCase();
		return globalMetadataCache.find(
			(e: any) => e.label === normalized || String(e.label).toLowerCase() === lower
		);
	}

	#parseInfoSections(text: string) {
		const normalized = String(text || "").replace(/\r/g, "").trim();
		if (!normalized) return { summary: "", tags: [] as { tag: string, body: string }[] };

		const lines = normalized.split("\n");
		const summaryLines: string[] = [];
		const tags: { tag: string, body: string }[] = [];
		let currentTag: { tag: string, body: string } | null = null;

		for (const line of lines) {
			const match = /^\s*(@\w+)\s*(.*)$/.exec(line);
			if (match) {
				currentTag = { tag: match[1], body: match[2] };
				tags.push(currentTag);
			} else if (currentTag) {
				currentTag.body += (currentTag.body ? "\n" : "") + line;
			} else {
				summaryLines.push(line);
			}
		}

		return {
			summary: summaryLines.join("\n").trim(),
			tags,
		};
	}
}
