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
	import { show_config_ui } from "@ui/config";
	import { create_unique_id } from "@functions/normal";
	import Description from "./Description.svelte";
	import { highlight as highlightAction } from "@ui/settings/highlight";
	import SettingFrame from "../SettingFrame.svelte";

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
			settings_ui.config_editor_renderer({ setting, parent }, parent);
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
</script>

{#snippet config_buttons()}
	{#if isDeveloperMode}
		<div class="STYLESHIFT-Config-Frame">
			<button class="STYLESHIFT-Config-Button drag"><Icon name="drag" /></button>
			<button class="STYLESHIFT-Config-Button edit" onclick={handleEdit}><Icon name="edit" /></button>
			<button
				class="STYLESHIFT-Config-Button delete"
				onclick={() => {
					remove_setting(setting);
					update_all();
				}}><Icon name="delete" /></button
			>
		</div>
	{/if}
{/snippet}

<SettingFrame
	id={setting.id}
	type={setting.type}
	style={isDeveloperMode ? "gap: 10px; background: rgba(255, 255, 255, 0.03);" : ""}
	useAction={(node) => highlightAction(node, highlight)}
	padding={setting.type !== "button"}
	transparent={setting.type === "button"}
	vertical={setting.type === "number_slide" ||
		setting.type === "color" ||
		setting.type === "custom" ||
		setting.type === "image_input"}
>
	{@render config_buttons()}
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
</SettingFrame>

<style lang="scss">
	.STYLESHIFT-Config-Frame {
		display: flex;
		flex-direction: column;
		gap: 5px;
		opacity: 0;
		transition: opacity 0.2s;
		padding-left: 10px;
	}

	:global(.STYLESHIFT-Setting-Frame:hover) .STYLESHIFT-Config-Frame {
		opacity: 1;
	}

	.STYLESHIFT-Config-Button {
		background: var(--White-10);
		border: 1px solid var(--White-20);
		border-radius: 8px;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			background: var(--White-20);
			transform: scale(1.1);
		}

		&.delete:hover {
			background: rgba(255, 0, 0, 0.3);
			border-color: red;
		}
	}
</style>
