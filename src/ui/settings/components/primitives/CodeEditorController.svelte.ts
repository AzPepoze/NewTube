import { logger } from "@/shared/logger";
import {
	codemirrorInstance,
	globalMetadataCache,
} from "@core/runtime/controller";

interface ControllerProps {
	value: string;
	language: string;
	onInput?: (val: string) => void;
	onBlur?: (val: string) => void;
}

interface InfoSections {
	summary: string;
	tags: string[];
}

interface MetadataEntry {
	label: string;
	type: string;
	detail: string;
	info?: string;
}

export class CodeEditorController {
	private view: any = null;
	private value: string = "";
	private language: string = "javascript";
	private onInput?: (val: string) => void;
	private onBlur?: (val: string) => void;

	constructor(props: ControllerProps) {
		this.value = props.value;
		this.language = props.language;
		this.onInput = props.onInput;
		this.onBlur = props.onBlur;
	}

	private normalizeInfo(text: string): string {
		return String(text || "")
			.replace(/\r/g, "")
			.replace(/\s*@/g, "\n@")
			.trim();
	}

	private parseInfoSections(text: string): InfoSections {
		const normalized = this.normalizeInfo(text);
		if (!normalized) {
			return { summary: "", tags: [] };
		}

		const lines = normalized
			.split(/\n+/)
			.map((line) => line.trim())
			.filter(Boolean);
		const summaryLines: string[] = [];
		const tags: string[] = [];

		lines.forEach((line) => {
			if (line.startsWith("@")) {
				tags.push(line);
			} else {
				summaryLines.push(line);
			}
		});

		return { summary: summaryLines.join(" "), tags };
	}

	private renderInfoNode(entry: MetadataEntry): HTMLElement {
		const root = document.createElement("div");
		root.className = "cm-metadata-doc";

		const info = entry.info || entry.detail || "";
		if (!info) {
			// No info available
			return root;
		}

		// Check if info looks like structured text with tags or just a plain string
		if (typeof info === "string" && info.includes("@")) {
			const sections = this.parseInfoSections(info);
			if (sections.summary) {
				root.appendChild(
					this.createSummaryElement(sections.summary),
				);
			}
			if (sections.tags.length) {
				root.appendChild(this.createTagsElement(sections.tags));
			}
		} else if (typeof info === "string") {
			// Plain description text
			const desc = document.createElement("p");
			desc.className = "cm-metadata-summary";
			desc.textContent = info;
			root.appendChild(desc);
		}

		return root;
	}

	private createSummaryElement(summary: string): HTMLElement {
		const el = document.createElement("div");
		el.className = "cm-metadata-summary";
		el.textContent = summary;
		return el;
	}

	private createTagsElement(tags: string[]): HTMLElement {
		const tagsEl = document.createElement("div");
		tagsEl.className = "cm-metadata-tags";
		tags.forEach((tagText) => {
			tagsEl.appendChild(this.createTagRow(tagText));
		});
		return tagsEl;
	}

	private createTagRow(tagText: string): HTMLElement {
		const row = document.createElement("div");
		row.className = "cm-metadata-tag-row";

		const [tagLabel, tagBody] = this.parseTag(tagText);
		const tag = document.createElement("span");
		tag.className = "cm-metadata-tag";
		tag.textContent = tagLabel;

		const body = document.createElement("span");
		body.className = "cm-metadata-tag-body";
		body.textContent = tagBody;

		row.append(tag, body);
		return row;
	}

	private parseTag(tagText: string): [string, string] {
		const match = /^(@\w+)\s*(.*)$/.exec(tagText);
		return match ? [match[1], match[2]] : ["@tag", tagText];
	}

	private metadataOptions(): any[] {
		if (!globalMetadataCache || globalMetadataCache.length === 0) {
			logger.debug("ui", "No metadata cache available");
			return [];
		}

		const validEntries = globalMetadataCache.filter(
			(entry) => entry && entry.label,
		);
		logger.debug(
			"ui",
			`Found ${validEntries.length} valid metadata entries`,
		);

		// Log sample entries for debugging
		if (validEntries.length > 0) {
			logger.debug(
				"ui",
				`Sample metadata: ${validEntries
					.slice(0, 3)
					.map((e) => `${e.label}(${e.type}): ${e.info}`)
					.join(" | ")}`,
			);
		}

		return validEntries.map((entry) => {
			const option: any = {
				label: entry.label,
				type: entry.type || "variable",
				detail: entry.detail,
				boost: 20,
			};

			// Add info for side panel if available
			if (entry.info) {
				option.info = entry.info;
			}

			return option;
		});
	}

	private normalizeSymbol(text: string): string {
		return text.trim().replace(/[\s(){}\[\],;]+$/g, "");
	}

	private findMetadata(word: string): MetadataEntry | null {
		const normalized = this.normalizeSymbol(word);
		if (!normalized) return null;

		// Try exact match first, then case-insensitive
		return (
			globalMetadataCache.find(
				(entry) => entry.label === normalized,
			) ||
			globalMetadataCache.find(
				(entry) =>
					String(entry.label).toLowerCase() ===
					normalized.toLowerCase(),
			) ||
			null
		);
	}

	async initialize(container: HTMLElement): Promise<void> {
		if (!container) return;

		await this.waitForCodemirror();

		logger.info(
			"ui",
			`Initializing CodeEditor with ${globalMetadataCache.length} metadata entries`,
		);

		try {
			const cm = codemirrorInstance;
			const extensions = this.buildExtensions(cm);
			this.createEditorView(container, cm, extensions);
			logger.info("ui", "CodeEditor initialized with CodeMirror 6");
		} catch (err) {
			logger.error("ui", "Failed to initialize CodeEditor", err);
			throw err;
		}
	}

	private async waitForCodemirror(): Promise<void> {
		while (!codemirrorInstance) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
	}

	private buildExtensions(cm: any): any[] {
		const {
			basicSetup,
			dracula,
			search,
			tooltips,
			EditorView: editorView,
		} = cm;

		const extensions = [
			...basicSetup,
			dracula,
			search({ top: true }),
			tooltips({ parent: document.body }),
			this.createUpdateListener(editorView),
			this.createBlurHandler(editorView),
			this.createHoverTooltip(cm),
		];

		this.addLanguageExtensions(cm, extensions);
		return extensions;
	}

	private createUpdateListener(editorView: any): any {
		return editorView.updateListener.of((update: any) => {
			if (update.docChanged) {
				const newValue = update.state.doc.toString();
				this.value = newValue;
				this.onInput?.(newValue);
			}
		});
	}

	private createBlurHandler(editorView: any): any {
		return editorView.domEventHandlers({
			blur: () => {
				this.onBlur?.(this.view.state.doc.toString());
			},
		});
	}

	private createHoverTooltip(cm: any): any {
		const { hoverTooltip } = cm;
		return hoverTooltip((view: any, pos: number, side: number) => {
			try {
				const tooltip = this.findWordAtPosition(view, pos, side);
				if (!tooltip) return null;

				// Validate positions are within document bounds
				const docLength = view.state.doc.length;
				if (
					tooltip.start < 0 ||
					tooltip.end > docLength ||
					tooltip.start > tooltip.end
				) {
					return null;
				}

				return {
					pos: tooltip.start,
					end: tooltip.end,
					above: true,
					create: () => this.createTooltipDOM(tooltip.metadata),
				};
			} catch (err) {
				logger.debug("ui", "Hover tooltip error", err);
				return null;
			}
		});
	}

	private findWordAtPosition(
		view: any,
		pos: number,
		side: number,
	): { start: number; end: number; metadata: any } | null {
		const docLength = view.state.doc.length;

		// Safety: pos must be within valid bounds
		if (pos < 0 || pos > docLength) {
			return null;
		}

		const { from, to, text } = view.state.doc.lineAt(pos);
		let start = pos;
		let end = pos;

		// Find word boundaries (stay within line bounds)
		while (start > from && /[\w$]/.test(text[start - from - 1])) {
			start--;
		}
		while (end < to && /[\w$]/.test(text[end - from])) {
			end++;
		}

		// Clamp to document bounds as safety measure
		start = Math.max(0, start);
		end = Math.min(docLength, end);

		// Validate position relative to hover trigger
		if ((start === pos && side < 0) || (end === pos && side > 0)) {
			return null;
		}

		const word = text.slice(start - from, end - from);
		const metadata = this.findMetadata(word);
		return metadata ? { start, end, metadata } : null;
	}

	private createTooltipDOM(metadata: any): HTMLElement {
		const dom = document.createElement("div");
		dom.className = "cm-styleshift-tooltip";
		dom.style.cssText =
			"max-width: 60ch; max-height: 34vh; overflow: auto;";

		// Header with title and badge
		const header = this.createTooltipHeader(metadata);
		dom.appendChild(header);

		// Info section
		if (metadata.info) {
			const info = this.renderInfoNode(metadata);
			info.classList.add("cm-tooltip-info");
			dom.appendChild(info);
		}

		return dom;
	}

	private createTooltipHeader(metadata: any): HTMLElement {
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

		return header;
	}

	private addLanguageExtensions(cm: any, extensions: any[]): void {
		const {
			javascript,
			css,
			autocompletion,
			localCompletionSource,
			scopeCompletionSource,
			cssCompletionSource,
		} = cm;

		if (this.language === "javascript" || this.language === "js") {
			extensions.push(javascript());
			extensions.push(
				autocompletion({
					override: [
						this.createStylishiftCompletion(),
						localCompletionSource,
						scopeCompletionSource(globalThis),
					],
					maxRenderedOptions: 20,
				}),
			);
		} else if (this.language === "css") {
			extensions.push(css());
			extensions.push(
				autocompletion({
					override: [cssCompletionSource],
					maxRenderedOptions: 20,
				}),
			);
		} else {
			extensions.push(autocompletion());
		}
	}

	private createStylishiftCompletion(): (context: any) => any {
		return (context: any) => {
			const word = context.matchBefore(/[\w$]*/);
			if (!word || (word.from === word.to && !context.explicit)) {
				return null;
			}

			const options = this.metadataOptions();
			if (options.length === 0 && globalMetadataCache.length > 0) {
				logger.debug(
					"ui",
					"Metadata cache populated but no options created",
				);
			}

			return {
				from: word.from,
				options,
			};
		};
	}

	private createEditorView(
		container: HTMLElement,
		cm: any,
		extensions: any[],
	): void {
		const { EditorView: editorView, EditorState: editorState } = cm;

		this.view = new editorView({
			state: editorState.create({
				doc: this.normalizeValue(this.value),
				extensions,
			}),
			parent: container,
		});
	}

	private normalizeValue(val: any): string {
		return typeof val === "string" ? val : String(val || "");
	}

	destroy(): void {
		if (this.view) {
			this.view.destroy();
			this.view = null;
		}
	}

	setValue(newVal: string): void {
		if (this.view) {
			this.view.dispatch({
				changes: {
					from: 0,
					to: this.view.state.doc.length,
					insert: newVal,
				},
			});
		}
	}

	getValue(): string {
		return this.view ? this.view.state.doc.toString() : this.value;
	}
}
