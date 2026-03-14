<script lang="ts">
	import type { Setting } from "@/styleshift/types/styleshiftTypes";
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
	import WarningSection from "./WarningSection.svelte";
	import {
		getFromStorage,
		getRootValue,
	} from "@/styleshift/core/storageManager";
	import { createError } from "@/styleshift/shared/extension";
	import { settingsUi } from "@ui/settings/settingComponents";
	import { executeScriptString } from "@/styleshift/core/runtimeController";
	import { removeSetting } from "@settings/items";
	import { refreshExtensionState } from "@/styleshift/run";
	import { showConfigUi, removeConfigUi } from "@ui/config";
	import { createUniqueId, logger } from "@/styleshift/shared/normal";
	import Description from "./Description.svelte";
	import { highlight as highlightAction } from "@ui/settings/highlight";
	import SettingFrame from "../SettingFrame.svelte";
	import { addDrag, addDropTarget } from "../../reorder";
	import { getTextAlign } from "../../utils";
	import {
		registerSettingListener,
		unregisterSettingListener,
	} from "@settings/functions";
	import {
		registerSettingUi,
		unregisterSettingUi,
	} from "@ui/settings/settings";
	import { SvelteMap } from "svelte/reactivity";
	import KeyboardShortcutsComponent from "../dev/KeyboardShortcuts.svelte";

	let {
		setting,
		highlight = "",
	}: {
		setting: Setting;
		highlight?: string;
		onUpdate?: (value: any) => void;
	} = $props();

	let value = $state<any>(null);
	let isDeveloperMode = $state(false);
	let domNode = $state<HTMLElement | null>(null);

	// Requirements state
	let requirementsMet = $state(true);
	let requiredSettings = $state<
		Record<
			string,
			{ name: string; value: any; type: string; options?: any }
		>
	>({});
	let isLocked = $derived(setting.lock?.condition ?? false);
	let listeners = new SvelteMap<string, (val: any) => void>();

	const textAlign = $derived(getTextAlign((setting as any).align));
	const isVerticalSetting = $derived(
		setting.type === "numberSlide" ||
			setting.type === "color" ||
			setting.type === "custom" ||
			setting.type === "imageInput" ||
			setting.type === "keyboardShortcuts",
	);

	// Initialize value from storage
	async function init() {
		try {
			isDeveloperMode =
				(await getRootValue("developerMode")) &&
				(setting.editable ?? false);
			if ("id" in setting && setting.id) {
				value = await getFromStorage(setting.id);
			} else if ("value" in setting) {
				value = setting.value;
			}

			if (setting.require && Object.keys(setting.require).length > 0) {
				const allSettings = await (
					await import("@settings/items")
				).getSettingsList();
				for (const reqId in setting.require) {
					const reqSetting = allSettings[reqId];
					if (reqSetting) {
						const reqValue = await getFromStorage(reqId);
						requiredSettings[reqId] = {
							name: (reqSetting as any).name || reqId,
							value: reqValue,
							type: reqSetting.type,
							options: (reqSetting as any).options,
						};

						const listener = (newVal: any) => {
							requiredSettings[reqId].value = newVal;
							checkRequirements();
						};
						listeners.set(reqId, listener);
						registerSettingListener(reqId, listener);
					}
				}
				checkRequirements();
			}
		} catch (error) {
			createError(
				`Failed to initialize setting "${setting.id || setting.type}".\n\nJSON: ${JSON.stringify(setting, null, 2)}`,
			);
			logger.error("settings", `Init error for ${setting.id}:`, error);
		}
	}

	function checkRequirements() {
		if (!setting.require) {
			requirementsMet = true;
			return;
		}
		requirementsMet = Object.keys(setting.require).every((id) => {
			const req = requiredSettings[id];
			const requiredValue = setting.require![id];

			if (Array.isArray(requiredValue)) {
				return req && requiredValue.includes(req.value);
			}

			return req && req.value === requiredValue;
		});
	}

	init();

	$effect(() => {
		return () => {
			listeners.forEach((listener, id) => {
				unregisterSettingListener(id, listener);
			});
			if (setting.id) {
				unregisterSettingUi(setting.id);
			}
		};
	});

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
		try {
			node.id = setting.id || createUniqueId(10);
			if (setting.type === "custom") {
				if (typeof setting.uiFunction === "function") {
					setting.uiFunction(node);
				} else if (typeof setting.uiFunction === "string") {
					executeScriptString({
						scriptContent: setting.uiFunction,
						sourceIdentifier: `${setting.id} : uiFunction`,
						executionArguments: JSON.stringify({
							settingId: node.id,
						}),
					});
				}
			}
		} catch (error) {
			createError(
				`Failed to render custom setting "${setting.id}".\n\nJSON: ${JSON.stringify(setting, null, 2)}`,
			);
			logger.error(
				"settings",
				`Custom action error for ${setting.id}:`,
				error,
			);
		}
	}

	function dragAction(node: HTMLElement) {
		if (isDeveloperMode) {
			try {
				addDrag(node, null, null, setting);
			} catch (error) {
				logger.error(
					"settings",
					`Drag action error for ${setting.id}:`,
					error,
				);
			}
		}
	}

	function keyboardShortcutsAction(node: HTMLElement) {
		try {
			if (setting.type === "keyboardShortcuts") {
				settingsUi.renderComponent(
					KeyboardShortcutsComponent,
					{},
					node,
				);
			}
		} catch (error) {
			createError(
				`Failed to render keyboard shortcuts for "${setting.id}".\n\nJSON: ${JSON.stringify(setting, null, 2)}`,
			);
			logger.error(
				"settings",
				`Keyboard action error for ${setting.id}:`,
				error,
			);
		}
	}

	$effect(() => {
		if (isDeveloperMode && domNode && domNode.parentElement) {
			addDropTarget(
				domNode,
				domNode.parentElement,
				setting,
				"setting",
			);
		}
	});
</script>

<SettingFrame
	id={setting.id}
	type={setting.type}
	className="{isDeveloperMode ? 'developer-mode' : ''} {isLocked
		? 'STYLESHIFT-Setting-Hard-Locked'
		: ''} {!requirementsMet
		? 'STYLESHIFT-Setting-Requirement-Warning'
		: ''}"
	style="{isDeveloperMode &&
	setting.type !== 'subText' &&
	setting.type !== 'text'
		? 'gap: 10px;'
		: ''} {isLocked || !requirementsMet
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
		{#if isDeveloperMode}
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
			<PreviewImage src={value} />
		{:else if setting.type === "custom"}
			<div use:customSettingAction></div>
		{:else if setting.type === "combineSettings"}
			<Description
				name={setting.name}
				description={setting.description}
			/>
		{:else if setting.type === "keyboardShortcuts"}
			<div use:keyboardShortcutsAction></div>
		{/if}

		{#if isDeveloperMode}
			<div class="STYLESHIFT-Config-Actions-Overlay">
				<button
					class="STYLESHIFT-Config-Button edit"
					onclick={handleEdit}
				>
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
	</div>

	<WarningSection
		{isLocked}
		lockMessage={setting.lock?.message}
		{requirementsMet}
		require={setting.require}
		{requiredSettings}
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
