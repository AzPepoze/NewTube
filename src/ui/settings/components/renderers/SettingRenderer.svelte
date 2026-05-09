<script lang="ts">
	import { onDestroy } from "svelte";
	import { registerSettingUi, unregisterSettingUi } from "../../settingsManager";
	import { getTextAlign } from "../../utils";
	import Button from "../controls/Button.svelte";
	import Checkbox from "../controls/Checkbox.svelte";
	import ColorPicker from "../controls/ColorPicker.svelte";
	import Dropdown from "../controls/Dropdown.svelte";
	import ImageInput from "../controls/ImageInput.svelte";
	import PreviewImage from "../controls/PreviewImage.svelte";
	import Selector from "../controls/SelectorInput.svelte";
	import Slider from "../controls/Slider.svelte";
	import Text from "../controls/Text.svelte";
	import TextInput from "../controls/TextInput.svelte";
	import Description from "../primitives/Description.svelte";
	import Icon from "../primitives/Icon.svelte";
	import ConditionStatus from "./ConditionStatus.svelte";
	import SettingFrame from "./SettingFrame.svelte";
	import WarningSection from "./WarningSection.svelte";
	import { highlight as highlightAction } from "@ui/settings/searchHighlight";
	import { addDropTarget, addDrag } from "../../reorder";
	import type { Setting } from "@settings/types/styleshiftTypes";
	import { SettingRendererController } from "./SettingRendererController.svelte";

	let {
		setting,
		highlight = "",
	}: {
		setting: Setting;
		highlight?: string;
	} = $props();

	const controller = $derived(new SettingRendererController(setting));
	let domNode = $state<HTMLElement | null>(null);

	const textAlign = $derived(getTextAlign((setting as any).align));
	const isVerticalSetting = $derived(
		setting.type === "numberSlide" ||
			setting.type === "color" ||
			setting.type === "custom" ||
			setting.type === "imageInput" ||
			setting.type === "keyboardShortcuts" ||
			setting.type === "conditionSetting",
	);

	function dragAction(node: HTMLElement) {
		if (controller.isDeveloperMode) {
			addDrag(node, null, null, setting);
		}
	}

	$effect(() => {
		if (controller.isDeveloperMode && domNode && domNode.parentElement) {
			addDropTarget(domNode, domNode.parentElement, setting, "setting");
		}
	});

	const isLocked = $derived(setting.lock?.condition ?? false);

	onDestroy(() => {
		controller.destroy();
		if (setting.id) unregisterSettingUi(setting.id);
	});
</script>

<SettingFrame
	id={setting.id}
	type={setting.type}
	className="{controller.isDeveloperMode ? 'developer-mode' : ''} {isLocked
		? 'STYLESHIFT-Setting-Hard-Locked'
		: ''} {!controller.requirementsMet
		? 'STYLESHIFT-Setting-Requirement-Warning'
		: ''}"
	style="{controller.isDeveloperMode &&
	setting.type !== 'subText' &&
	setting.type !== 'text'
		? 'gap: 10px;'
		: ''} {isLocked || !controller.requirementsMet
		? 'flex-direction: column; align-items: stretch;'
		: ''}"
	useAction={(node) => {
		domNode = node;
		highlightAction(node, highlight);
		if (setting.id && node.parentElement) {
			registerSettingUi(setting.id, node.parentElement, node);
		}
	}}
	padding={setting.type !== "button" && setting.type !== "subText"}
	transparent={setting.type === "button" ||
		setting.type === "subText" ||
		setting.type === "text"}
	vertical={isVerticalSetting}
>
	<div
		class="STYLESHIFT-Setting-Row-Content"
		class:is-vertical={isVerticalSetting}
	>
		{#if controller.isDeveloperMode}
			<button
				class="STYLESHIFT-Config-Button drag-handle"
				use:dragAction
			>
				<Icon name="drag" size={16} />
			</button>
		{/if}

		{#if setting.type === "checkbox"}
			<Checkbox {setting} />
		{:else if setting.type === "button"}
			<Button {setting} />
		{:else if setting.type === "numberSlide"}
			<Slider {setting} />
		{:else if setting.type === "textInput"}
			<TextInput {setting} />
		{:else if setting.type === "color"}
			<ColorPicker {setting} />
		{:else if setting.type === "dropdown"}
			<Dropdown {setting} />
		{:else if setting.type === "text"}
			<Text
				html={setting.html}
				fontSize={setting.fontSize}
				{textAlign}
			/>
		{:else if setting.type === "subText"}
			<Text
				text={setting.text}
				fontSize={setting.fontSize}
				color={setting.color}
				{textAlign}
				className="STYLESHIFT-Setting-Sub-Title"
			/>
		{:else if setting.type === "imageInput"}
			<ImageInput {setting} />
		{:else if setting.type === "previewImage"}
			<PreviewImage src={controller.value} />
		{:else if setting.type === "custom"}
			<div use:controller.customSettingAction></div>
		{:else if setting.type === "combineSetting"}
			<Description
				name={setting.name}
				description={setting.description}
			/>
		{:else if setting.type === "conditionSetting"}
			<div
				style="display: flex; flex-direction: column; width: 100%; gap: 5px;"
			>
				<Description
					name={setting.name}
					description={setting.description}
				/>
				<ConditionStatus
					conditionsMet={controller.conditionsMet}
					condition={setting.condition}
					requiredSettings={controller.requiredSettings}
				/>
			</div>
		{:else if setting.type === "keyboardShortcuts"}
			<div use:controller.keyboardShortcutsAction></div>
		{:else if setting.type === "selectorInput"}
			<Selector {setting} />
		{/if}

		{#if controller.isDeveloperMode || setting.quickCustomize}
			<div class="STYLESHIFT-Config-Actions-Overlay">
				{#if setting.quickCustomize}
					<button
						class="STYLESHIFT-Config-Button quick-edit"
						title="Edit in Quick Customize"
						onclick={() => controller.handleQuickEdit()}
					>
						<Icon name="brush" size={16} color="var(--White-100)" />
					</button>
				{/if}
				
				{#if controller.isDeveloperMode}
					<button
						class="STYLESHIFT-Config-Button edit"
						onclick={() => controller.handleEdit()}
					>
						<Icon name="edit" size={16} />
					</button>
					<button
						class="STYLESHIFT-Config-Button delete"
						onclick={() => controller.handleDelete()}
					>
						<Icon name="delete" size={16} />
					</button>
				{/if}
			</div>
		{/if}
	</div>

	<WarningSection
		{isLocked}
		lockMessage={setting.lock?.message}
		requirementsMet={controller.requirementsMet}
		require={setting.require}
		requiredSettings={controller.requiredSettings}
	/>
</SettingFrame>

<style lang="scss">
	.STYLESHIFT-Setting-Row-Content {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		width: 100%;
		position: relative;

		&.is-vertical {
			flex-direction: column;
			align-items: stretch;
		}
	}

	:global(
			.STYLESHIFT-Setting-Frame.STYLESHIFT-Setting-Hard-Locked
				.STYLESHIFT-Setting-Row-Content
		) {
		pointer-events: none !important;
		opacity: 0.6 !important;
	}

	:global(
			.STYLESHIFT-Setting-Frame.STYLESHIFT-Setting-Requirement-Warning:not(
					.STYLESHIFT-Setting-Hard-Locked
				)
				.STYLESHIFT-Setting-Row-Content
		) {
		pointer-events: all;
		opacity: 1;
	}
</style>
