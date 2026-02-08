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
	import Search from "./Search.svelte";
	import { load_any, load } from "@core/save";
	import { settings_ui, set_and_save } from "@ui/settings/setting-components";
	import { update_setting_function } from "@settings/functions";
	import {
		run_text_script_from_setting,
		hex_to_color_obj,
		color_obj_to_hex,
		run_text_script,
	} from "@core/extension";
	import { remove_setting } from "@settings/items";
	import { update_all } from "@/styleshift/run";
	import { show_config_ui, remove_config_ui } from "@ui/config";
	import { create_unique_id } from "@functions/normal";
	import Description from "./Description.svelte";
	import { highlight as highlightAction } from "@ui/settings/highlight";
	import SettingFrame from "../SettingFrame.svelte";
	import { add_drag, add_drop_target } from "../../reorder";

	let {
		setting,
		highlight = "",
		onUpdate: externalOnUpdate,
	}: {
		setting: Setting;
		highlight?: string;
		onUpdate?: (value: any) => void;
	} = $props();

	// State for reactive values
	let value = $state<any>(null);
	let isDeveloperMode = $state(false);
	let domNode = $state<HTMLElement | null>(null);

	// Initialize value from storage
	async function init() {
		isDeveloperMode = (await load("Developer_mode")) && (setting.editable ?? false);
		if ("id" in setting && setting.id) {
			value = await load_any(setting.id);
		} else if ("value" in setting) {
			value = setting.value;
		}
	}
	init();

	async function handleUpdate(newValue: any) {
		value = newValue;

		if (externalOnUpdate) externalOnUpdate(newValue);

		if ("id" in setting && setting.id) {
			await set_and_save(setting, newValue);
			update_setting_function(setting.id);
		} else if ("update_function" in setting && typeof setting.update_function === "function") {
			(setting.update_function as Function)(newValue);
		}
	}

	async function handleEdit() {
		show_config_ui(async (parent: HTMLElement) => {
			settings_ui.config_editor_renderer(
				{
					setting,
					onClose: () => remove_config_ui(),
				},
				parent,
			);
		});
	}

	function customSettingAction(node: HTMLElement) {
		node.id = setting.id || create_unique_id(10);
		if (setting.type === "custom") {
			if (typeof setting.ui_function === "function") {
				setting.ui_function(node);
			} else if (typeof setting.ui_function === "string") {
				run_text_script({
					text: setting.ui_function,
					code_name: `${setting.id} : ui_function`,
					args: JSON.stringify({ setting_id: node.id }),
				});
			}
		}
	}

	function dragAction(node: HTMLElement) {
		if (isDeveloperMode) {
			add_drag(node, null, null, setting);
		}
	}

	$effect(() => {
		if (isDeveloperMode && domNode && domNode.parentElement) {
			add_drop_target(domNode, domNode.parentElement, setting, "setting");
		}
	});
</script>

<SettingFrame
	id={setting.id}
	type={setting.type}
	className={isDeveloperMode ? "developer-mode" : ""}
	style={isDeveloperMode && setting.type !== "sub_text" && setting.type !== "text" ? "gap: 10px;" : ""}
	useAction={(node) => {
		domNode = node;
		highlightAction(node, highlight);
	}}
	padding={setting.type !== "button" && setting.type !== "sub_text"}
	transparent={setting.type === "button" || setting.type === "sub_text" || setting.type === "text"}
	vertical={setting.type === "number_slide" ||
		setting.type === "color" ||
		setting.type === "custom" ||
		setting.type === "image_input"}
>
	{#if isDeveloperMode}
		<button class="STYLESHIFT-Config-Button drag-handle" use:dragAction>
			<Icon name="drag" size={16} />
		</button>
	{/if}

	{#if setting.type === "checkbox"}
		<Checkbox {setting} bind:value onUpdate={handleUpdate} />
	{:else if (setting.type as any) === "search"}
		<Search onInput={externalOnUpdate} />
	{:else if setting.type === "button"}
		<Button
			{setting}
			onClick={() => {
				if (!setting.click_function) return;
				if (typeof setting.click_function === "string") {
					run_text_script_from_setting(setting, "click_function");
				} else {
					(setting.click_function as Function)();
				}
			}}
		/>
	{:else if setting.type === "number_slide"}
		<Slider {setting} bind:value onUpdate={handleUpdate} />
	{:else if setting.type === "text_input"}
		<TextInput {setting} bind:value onUpdate={handleUpdate} />
	{:else if setting.type === "color"}
		{@const colorObj = hex_to_color_obj(value || "#ffffff")}
		<ColorPicker
			{setting}
			hex={colorObj.hex}
			alpha={colorObj.alpha}
			onUpdate={(hex, alpha) => handleUpdate(color_obj_to_hex({ hex, alpha }))}
		/>
	{:else if setting.type === "dropdown"}
		<Dropdown {setting} bind:value onUpdate={handleUpdate} />
	{:else if setting.type === "text"}
		<Text
			html={setting.html}
			fontSize={setting.font_size}
			textAlign={setting.align === "left" ? "start" : setting.align === "right" ? "end" : "center"}
		/>
	{:else if setting.type === "sub_text"}
		<Text
			text={setting.text}
			fontSize={setting.font_size}
			color={setting.color}
			textAlign={setting.align === "left" ? "start" : setting.align === "right" ? "end" : "center"}
			className="STYLESHIFT-Setting-Sub-Title"
		/>
	{:else if setting.type === "image_input"}
		<ImageInput {setting} bind:value onFileSelect={() => {}} onUrlUpdate={handleUpdate} />
	{:else if setting.type === "preview_image"}
		<PreviewImage src={value} />
	{:else if setting.type === "custom"}
		<div use:customSettingAction></div>
	{:else if setting.type === "combine_settings"}
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
					remove_setting(setting);
					update_all();
				}}
			>
				<Icon name="delete" size={16} />
			</button>
		</div>
	{/if}
</SettingFrame>

<style lang="scss">
</style>
