<script lang="ts">
	import type { Setting } from "@styleshift/types/store";
	import Checkbox from "./Checkbox.svelte";
	import Button from "./Button.svelte";
	import Slider from "./Slider.svelte";
	import TextInput from "./TextInput.svelte";
	import ColorPicker from "./ColorPicker.svelte";
	import Dropdown from "./Dropdown.svelte";
	import Text from "./Text.svelte";
	import ImageInput from "./ImageInput.svelte";
	import PreviewImage from "./PreviewImage.svelte";
	import Icon from "./Icon.svelte";
	import { getFromStorage, getRootValue } from "@/styleshift/core/storageManager";
	import { settingsUi } from "@ui/settings/settingComponents";
	import { executeScriptString } from "@/styleshift/core/runtimeController";
	import { removeSetting } from "@settings/items";
	import { refreshExtensionState } from "@/styleshift/run";
	import { showConfigUi, removeConfigUi } from "@ui/config";
	import { createUniqueId } from "@/styleshift/shared/normal";
	import Description from "./Description.svelte";
	import { highlight as highlightAction } from "@ui/settings/highlight";
	import SettingFrame from "../SettingFrame.svelte";
	import { addDrag, addDropTarget } from "../../reorder";
	import { getTextAlign } from "../../utils";

	let {
		setting,
		highlight = "",
		onUpdate: _externalOnUpdate,
	}: {
		setting: Setting;
		highlight?: string;
		onUpdate?: (value: any) => void;
	} = $props();

	let value = $state<any>(null);
	let isDeveloperMode = $state(false);
	let domNode = $state<HTMLElement | null>(null);

	const textAlign = $derived(getTextAlign((setting as any).align));

	// Initialize value from storage
	async function init() {
		isDeveloperMode = (await getRootValue("Developer_mode")) && (setting.editable ?? false);
		if ("id" in setting && setting.id) {
			value = await getFromStorage(setting.id);
		} else if ("value" in setting) {
			value = setting.value;
		}
	}
	init();

	async function handleEdit() {
		showConfigUi(async (parent: HTMLElement) => {
			settingsUi.configEditorRenderer(
				{
					setting: setting,
					onClose: () => removeConfigUi(),
				},
				parent,
			);
		});
	}

	function customSettingAction(node: HTMLElement) {
		node.id = setting.id || createUniqueId(10);
		if (setting.type === "custom") {
			if (typeof setting.uiFunction === "function") {
				setting.uiFunction(node);
			} else if (typeof setting.uiFunction === "string") {
				executeScriptString({
					scriptContent: setting.uiFunction,
					sourceIdentifier: `${setting.id} : uiFunction`,
					executionArguments: JSON.stringify({ settingId: node.id }),
				});
			}
		}
	}

	function dragAction(node: HTMLElement) {
		if (isDeveloperMode) {
			addDrag(node, null, null, setting);
		}
	}

	$effect(() => {
		if (isDeveloperMode && domNode && domNode.parentElement) {
			addDropTarget(domNode, domNode.parentElement, setting, "setting");
		}
	});
</script>

<SettingFrame
	id={setting.id}
	type={setting.type}
	className={isDeveloperMode ? "developer-mode" : ""}
	style={isDeveloperMode && setting.type !== "subText" && setting.type !== "text" ? "gap: 10px;" : ""}
	useAction={(node) => {
		domNode = node;
		highlightAction(node, highlight);
	}}
	padding={setting.type !== "button" && setting.type !== "subText"}
	transparent={setting.type === "button" || setting.type === "subText" || setting.type === "text"}
	vertical={setting.type === "numberSlide" ||
		setting.type === "color" ||
		setting.type === "custom" ||
		setting.type === "imageInput"}
>
	{#if isDeveloperMode}
		<button class="STYLESHIFT-Config-Button drag-handle" use:dragAction>
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
		<Text html={setting.html} fontSize={setting.fontSize} {textAlign} />
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
		<PreviewImage src={value} />
	{:else if setting.type === "custom"}
		<div use:customSettingAction></div>
	{:else if setting.type === "combineSettings"}
		<Description name={setting.name} description={setting.description} />
	{/if}

	{#if isDeveloperMode}
		<div class="STYLESHIFT-Config-Actions-Overlay">
			<button class="STYLESHIFT-Config-Button edit" onclick={handleEdit}>
				<Icon name="edit" size={16} />
			</button>
			<button
				class="STYLESHIFT-Config-Button delete"
				onclick={() => {
					removeSetting(setting);
					refreshExtensionState();
				}}
			>
				<Icon name="delete" size={16} />
			</button>
		</div>
	{/if}
</SettingFrame>

<style lang="scss">
</style>
