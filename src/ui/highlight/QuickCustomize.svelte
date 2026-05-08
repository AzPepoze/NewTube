<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import CapsuleTabs from "../window/components/CapsuleTabs.svelte";
	import Icon from "../settings/components/primitives/Icon.svelte";
	import TextInput from "../settings/components/controls/TextInput.svelte";
	import CodeEditor from "../settings/components/primitives/CodeEditor.svelte";
	import { logger } from "@shared/logger";
	import { initializeDeveloperEnvironment, isDevModulesLoaded } from "@core/runtime/controller";
	import QuickControlRow from "./QuickControlRow.svelte";

	let {
		selector = "",
		onClose = () => {},
		onSave = (_data: any) => {},
		initialData = null as any
	}: {
		selector: string;
		onClose: () => void;
		onSave: (data: { selector: string, css: string, mode: string, name: string, metadata: any }) => void;
		initialData?: { name: string, mode: string, basicStyles: any, enabledStyles: any, rawCss?: string } | null;
	} = $props();

	let activeTab = $state("basic");
	let basicStyles = $state<Record<string, any>>({
		"background-color": "#ffffff",
		"color": "#ffffff",
		"font-size": "",
		"opacity": 1,
		"border-radius": "",
		"display": "",
	});
	let enabledStyles = $state<Record<string, boolean>>({
		"background-color": false,
		"color": false,
		"font-size": false,
		"opacity": false,
		"border-radius": false,
		"display": false,
	});

	let settingName = $state("");
	const defaultName = $derived(`Custom: ${selector.slice(0, 20)}${selector.length > 20 ? "..." : ""}`);

	let rawCss = $state("");
	let previewStyleElement: HTMLStyleElement | null = null;
	let isEditorLoading = $state(false);

	const tabs = [
		{ id: "basic", label: "Basic", icon: "settings_input_component" },
		{ id: "advanced", label: "Advanced", icon: "code" }
	];

	const controls = [
		{ property: "background-color", label: "Background Color", type: "color" },
		{ property: "color", label: "Text Color", type: "color" },
		{ property: "font-size", label: "Font Size", type: "textInput", placeholder: "e.g. 16px" },
		{ property: "opacity", label: "Opacity", type: "numberSlide", min: 0, max: 1, step: 0.01 },
		{ property: "border-radius", label: "Border Radius", type: "textInput", placeholder: "e.g. 12px" },
		{ property: "display", label: "Display", type: "dropdown", options: [
			{ label: "Default", value: "" },
			{ label: "Block", value: "block" },
			{ label: "Inline Block", value: "inline-block" },
			{ label: "Flex", value: "flex" },
			{ label: "Hidden", value: "none" }
		]}
	];

	$effect(() => {
		if (activeTab === "advanced" && !isDevModulesLoaded) {
			isEditorLoading = true;
			initializeDeveloperEnvironment().finally(() => (isEditorLoading = false));
		}
	});

	function generateBasicCss(joiner: string = "\n") {
		const body = controls
			.filter(ctrl => enabledStyles[ctrl.property])
			.map(ctrl => {
				const val = basicStyles[ctrl.property];
				return (val !== "" && val !== undefined) ? `${ctrl.property}: ${val} !important;` : null;
			})
			.filter(Boolean)
			.join(joiner);
		
		return `${selector} { ${body} }`;
	}

	function applyPreview() {
		if (!previewStyleElement) {
			previewStyleElement = document.createElement("style");
			previewStyleElement.id = "styleshift-quick-customize-preview";
			document.head.appendChild(previewStyleElement);
		}
		previewStyleElement.textContent = activeTab === "basic" ? generateBasicCss(" ") : rawCss;
	}

	$effect(() => { applyPreview(); });

	onMount(() => { 
		if (initialData) {
			settingName = initialData.name;
			activeTab = initialData.mode;
			if (initialData.basicStyles) {
				Object.assign(basicStyles, initialData.basicStyles);
			}
			if (initialData.enabledStyles) {
				Object.assign(enabledStyles, initialData.enabledStyles);
			}
			if (initialData.rawCss) {
				rawCss = initialData.rawCss;
			} else {
				rawCss = `${selector} {\n\t\n}`;
			}
		} else {
			rawCss = `${selector} {\n\t\n}`;
		}
		logger.debug("QuickCustomize", "Mounted for selector", selector); 
	});
	onDestroy(() => { previewStyleElement?.remove(); });

	function handleSave() {
		onSave({
			selector,
			css: activeTab === "basic" ? generateBasicCss() : rawCss,
			mode: activeTab,
			name: settingName || defaultName,
			metadata: {
				basicStyles: $state.snapshot(basicStyles),
				enabledStyles: $state.snapshot(enabledStyles)
			}
		});
	}
</script>

<div class="STYLESHIFT-Quick-Customize-Container">
	<div class="setting-name-header">
		<TextInput 
			setting={{
				type: "textInput",
				name: "Setting Name",
				value: settingName,
				id: "",
				updateFunction: (val) => (settingName = val)
			}}
			placeholder={defaultName}
		/>
	</div>

	<div class="selector-info">
		<div class="icon-box">
			<Icon name="code" size={14} color="var(--White-100)" />
		</div>
		<code>{selector}</code>
	</div>

	<div class="tabs-wrapper">
		<CapsuleTabs options={tabs} bind:activeId={activeTab} />
	</div>

	<main class="modal-content STYLESHIFT-Scrollable">
		{#if activeTab === "basic"}
			<div class="basic-controls-list">
				{#each controls as ctrl (ctrl.property)}
					<QuickControlRow 
						{ctrl} 
						bind:enabled={enabledStyles[ctrl.property]} 
						bind:value={basicStyles[ctrl.property]} 
					/>
				{/each}
			</div>
		{:else}
			<div class="advanced-editor">
				{#if isEditorLoading}
					<div class="editor-loading">
						<Icon name="sync" size={24} color="var(--Theme-0)" />
						<span>Loading Editor...</span>
					</div>
				{:else}
					<CodeEditor bind:value={rawCss} language="css" height={300} onBlur={() => {}} onInput={() => {}} />
				{/if}
			</div>
		{/if}
	</main>

	<footer class="modal-footer">
		<button class="btn-secondary" onclick={onClose}>Cancel</button>
		<button class="btn-primary" onclick={handleSave}>Save Customization</button>
	</footer>
</div>

<style lang="scss">
	.STYLESHIFT-Quick-Customize-Container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.setting-name-header {
		padding: 15px 20px 0;
	}

	.selector-info {
		margin: 10px 20px 5px;
		padding: 14px 18px;
		border-radius: 15px;
		background: var(--White-02);
		display: flex;
		align-items: center;
		gap: 12px;
		border: 1px solid var(--White-05);
		
		.icon-box {
			width: 28px;
			height: 28px;
			border-radius: 8px;
			background: var(--Theme-0);
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 4px 10px rgba(127, 93, 183, 0.3);
		}

		code {
			color: var(--White-100);
			font-family: 'Fira Code', monospace;
			font-size: 13px;
			letter-spacing: -0.3px;
			font-weight: 500;
			opacity: 0.9;
		}
	}

	.tabs-wrapper {
		padding: 15px 20px;
		display: flex;
		justify-content: center;
	}

	.modal-content {
		padding: 0 20px 20px;
		flex: 1;
		min-height: 250px;
		overflow-y: auto;
	}

	.basic-controls-list {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.advanced-editor {
		height: 300px;
		position: relative;
	}

	.editor-loading {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 12px;
		color: var(--White-60);
		
		:global(svg) { animation: spin 1.5s linear infinite; }
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.modal-footer {
		padding: 15px 20px;
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		background: var(--White-02);
		border-top: 1px solid var(--White-05);
	}

	button {
		padding: 10px 18px;
		border-radius: 12px;
		font-weight: 600;
		font-size: 13px;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

		&.btn-primary {
			background: var(--Theme-0);
			color: white;
			border: none;
			box-shadow: 0 4px 12px rgba(127, 93, 183, 0.3);
			&:hover { filter: brightness(1.1); transform: translateY(-1px); }
		}

		&.btn-secondary {
			background: transparent;
			color: var(--White-60);
			border: 1px solid var(--White-20);
			&:hover { color: white; background: var(--White-05); }
		}
	}
</style>
