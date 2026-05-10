import { initializeDeveloperEnvironment, isDevModulesLoaded } from "@core/runtime/controller";

export class QuickCustomizeController {
	selector = $state("");
	activeTab = $state("basic");
	rawCss = $state("");
	settingName = $state("");
	isEditorLoading = $state(false);

	basicStyles = $state<Record<string, string>>({
		"background-color": "#ffffff",
		color: "#000000",
		"font-size": "14px",
		opacity: "1",
		"border-radius": "0px",
		display: "block",
	});

	enabledStyles = $state<Record<string, boolean>>({
		"background-color": false,
		color: false,
		"font-size": false,
		opacity: false,
		"border-radius": false,
		display: false,
	});

	defaultName = $derived(`Custom: ${this.selector.slice(0, 20)}${this.selector.length > 20 ? "..." : ""}`);

	previewStyleElement: HTMLStyleElement | null = null;
	private props: {
		selector: string;
		initialData: any;
		onSave: (data: any) => void;
	};

	constructor(props: { selector: string; initialData: any; onSave: (data: any) => void }) {
		this.props = props;
		this.selector = props.selector;

		const initialData = props.initialData;
		if (initialData) {
			this.settingName = initialData.name;
			this.activeTab = initialData.mode;
			if (initialData.basicStyles) {
				Object.assign(this.basicStyles, initialData.basicStyles);
			}
			if (initialData.enabledStyles) {
				Object.assign(this.enabledStyles, initialData.enabledStyles);
			}
			if (initialData.rawCss) {
				this.rawCss = initialData.rawCss;
			} else {
				this.rawCss = `${this.selector} {\n\t\n}`;
			}
		} else {
			this.rawCss = `${this.selector} {\n\t\n}`;
		}
	}

	generateBasicCss() {
		let css = `${this.selector} {\n`;
		for (const [prop, value] of Object.entries(this.basicStyles)) {
			if (this.enabledStyles[prop]) {
				css += `  ${prop}: ${value} !important;\n`;
			}
		}
		css += `}`;
		return css;
	}

	applyPreview() {
		if (typeof document === "undefined") return;
		if (!this.previewStyleElement) {
			this.previewStyleElement = document.createElement("style");
			this.previewStyleElement.id = "quick-customize-preview";
			document.head.appendChild(this.previewStyleElement);
		}
		this.previewStyleElement.textContent = this.activeTab === "basic" ? this.generateBasicCss() : this.rawCss;
	}

	async handleTabChange(tab: string) {
		this.activeTab = tab;
		if (tab === "advanced" && !isDevModulesLoaded) {
			this.isEditorLoading = true;
			try {
				await initializeDeveloperEnvironment();
			} finally {
				this.isEditorLoading = false;
			}
		}
	}

	handleSave() {
		this.props.onSave({
			selector: this.selector,
			css: this.activeTab === "basic" ? this.generateBasicCss() : this.rawCss,
			mode: this.activeTab,
			name: this.settingName || this.defaultName,
			metadata: {
				basicStyles: $state.snapshot(this.basicStyles),
				enabledStyles: $state.snapshot(this.enabledStyles),
			},
		});
	}

	destroy() {
		this.previewStyleElement?.remove();
	}
}
