<script lang="ts">
	import TextInput from "@controls/TextInput.svelte";
	import CodeEditor from "@editor/CodeEditor.svelte";
	import Icon from "@primitives/Icon.svelte";
	import { logger } from "@shared/logger";
	import type { QuickCustomizeMetadata, QuickCustomizeMode } from "@settings/types/styleshiftTypes";
	import { onDestroy, onMount } from "svelte";
	import CapsuleTabs from "../window/components/CapsuleTabs.svelte";
	import QuickControlRow from "./QuickControlRow.svelte";
	import { QuickCustomizeController } from "./QuickCustomizeController.svelte";

	type QuickCustomizeSaveData = {
		selector: string;
		css: string;
		mode: QuickCustomizeMode;
		name: string;
		metadata: QuickCustomizeMetadata;
	};
	type QuickCustomizeInitialData = {
		name: string;
		mode: QuickCustomizeMode;
		basicStyles: Record<string, string>;
		enabledStyles: Record<string, boolean>;
		rawCss?: string;
	};

	let {
		selector = "",
		onClose = () => {},
		onSave = (_data: QuickCustomizeSaveData) => {},
		initialData = null as QuickCustomizeInitialData | null,
	}: {
		selector: string;
		onClose: () => void;
		onSave: (data: QuickCustomizeSaveData) => void;
		initialData?: QuickCustomizeInitialData | null;
	} = $props();

	const controller = new QuickCustomizeController({
		get selector() {
			return selector;
		},
		get initialData() {
			return initialData;
		},
		get onSave() {
			return onSave;
		},
	});

	$effect(() => {
		controller.selector = selector;
	});

	$effect(() => {
		controller.applyPreview();
	});

	const controls = [
		{ id: "background-color", label: "Background", type: "color", icon: "format_color_fill" },
		{ id: "color", label: "Text Color", type: "color", icon: "title" },
		{ id: "font-size", label: "Font Size", type: "numberSlide", icon: "text_fields", min: 8, max: 72, unit: "px" },
		{ id: "opacity", label: "Opacity", type: "numberSlide", icon: "opacity", min: 0, max: 1, step: 0.05 },
		{
			id: "border-radius",
			label: "Rounding",
			type: "numberSlide",
			icon: "rounded_corner",
			min: 0,
			max: 50,
			unit: "px",
		},
		{
			id: "display",
			label: "Visibility",
			type: "dropdown",
			icon: "visibility",
			options: [
				{ label: "Show", value: "block" },
				{ label: "Hide", value: "none" },
			],
		},
	];

	onMount(() => {
		logger.debug("QuickCustomize", "Mounted for selector", selector);
	});
	onDestroy(() => {
		controller.destroy();
	});
	$effect(() => {
		controller.handleTabChange(controller.activeTab);
	});
</script>

<div class="styleshift-quick-customize-container">
	<div class="setting-name-header">
		<TextInput
			setting={{
				type: "textInput",
				name: "Setting Name",
				value: controller.settingName,
				id: "",
				updateFunction: (val) => (controller.settingName = val),
			}}
			placeholder={controller.defaultName}
		/>
	</div>

	<div class="selector-info">
		<div class="icon-box">
			<Icon name="code" size={20} color="var(--text-primary)" />
		</div>
		<div class="info-text">
			<span class="selector-name">{selector}</span>
		</div>
	</div>

	<div class="tabs-wrapper">
		<CapsuleTabs
			options={[
				{ id: "basic", label: "Basic" },
				{ id: "advanced", label: "Advanced" },
			]}
			bind:activeId={controller.activeTab}
		/>
	</div>

	<div class="modal-content">
		{#if controller.activeTab === "basic"}
			<div class="basic-controls-list">
				{#each controls as control (control.id)}
					<QuickControlRow
						ctrl={control}
						bind:value={controller.basicStyles[control.id]}
						bind:enabled={controller.enabledStyles[control.id]}
					/>
				{/each}
			</div>
		{:else}
			<div class="advanced-editor">
				{#if controller.isEditorLoading}
					<div class="editor-loading">
						<Icon name="sync" size={24} color="var(--fg-opacity-60)" />
						<span>Loading Code Editor...</span>
					</div>
				{/if}
				<CodeEditor
					value={controller.rawCss}
					language="css"
					height="100%"
					onInput={(val) => (controller.rawCss = val)}
				/>
			</div>
		{/if}
	</div>

	<div class="modal-footer">
		<button class="btn-secondary" onclick={onClose}>Cancel</button>
		<button class="btn-primary" onclick={() => controller.handleSave()}>Save Setting</button>
	</div>
</div>

<style lang="scss">
	.styleshift-quick-customize-container {
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
		background: var(--fg-opacity-03);
		display: flex;
		align-items: center;
		gap: 12px;
		border: 1px solid var(--fg-opacity-05);

		.icon-box {
			width: 36px;
			height: 36px;
			border-radius: 12px;
			background: var(--fg-opacity-05);
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			border: 1px solid var(--fg-opacity-10);
			color: var(--text-primary);
		}

		.info-text {
			display: flex;
			flex-direction: column;
			gap: 4px;

			.selector-name {
				font-family: "Fira Code", "JetBrains Mono", monospace;
				font-size: 13px;
				color: var(--text-primary);
				font-weight: 500;
			}
		}
	}

	.tabs-wrapper {
		padding: 15px 20px;
		display: flex;
		justify-content: center;
	}

	.modal-content {
		flex: 1;
		min-height: 250px;
		overflow-y: auto;
		border-radius: 12px;
		border: 1px solid var(--border-subtle);
		display: flex;
		flex-direction: column;
	}

	.basic-controls-list {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.advanced-editor {
		flex: 1;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.editor-loading {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		background: var(--bg-overlay-20);
		border-radius: 12px;
		color: var(--fg-opacity-60);

		:global(svg) {
			animation: spin 1.5s linear infinite;
		}
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.modal-footer {
		padding: 15px 20px;
		display: flex;
		justify-content: flex-end;
		gap: 12px;
	}

	button {
		padding: 10px 18px;
		border-radius: 12px;
		font-weight: 600;
		font-size: 13px;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

		&.btn-primary {
			background: var(--theme-0);
			color: white;
			border: none;
			box-shadow: 0 4px 12px var(--shadow-color);
			&:hover {
				filter: brightness(1.1);
				transform: translateY(-1px);
			}
		}

		&.btn-secondary {
			background: transparent;
			color: var(--fg-opacity-60);
			border: 1px solid var(--fg-opacity-20);
			&:hover {
				color: var(--text-primary);
				background: var(--fg-opacity-05);
			}
		}
	}
</style>
