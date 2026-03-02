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
	import {
		getFromStorage,
		getRootValue,
	} from "@/styleshift/core/storageManager";
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
	import {
		registerSettingListener,
		unregisterSettingListener,
	} from "@settings/functions";
	import { SvelteMap } from "svelte/reactivity";

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
			setting.type === "imageInput",
	);

	// Initialize value from storage
	async function init() {
		isDeveloperMode =
			(await getRootValue("Developer_mode")) &&
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
	}

	function dragAction(node: HTMLElement) {
		if (isDeveloperMode) {
			addDrag(node, null, null, setting);
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

	{#if isLocked || !requirementsMet}
		<div class="STYLESHIFT-Setting-Warning-Section">
			<div class="lock-info">
				<div class="lock-messages">
					{#if isLocked}
						<div class="lock-message">
							{setting.lock?.message ||
								"This setting is currently locked."}
						</div>
					{/if}
					{#if !requirementsMet}
						<div class="requirement-warning">
							<div
								style="display: flex; align-items: center; gap: 5px; color: #ffcc00; font-weight: bold;"
							>
								This setting requires:
							</div>
							<ul class="requirement-list">
								{#each Object.keys(setting.require || {}) as reqId (reqId)}
									{#if requiredSettings[reqId]?.value !== setting.require[reqId]}
										<li>
											<span class="highlight">
												{requiredSettings[
													reqId
												].name}
											</span>
											{#if requiredSettings[reqId].type === "checkbox"}
												to be enabled
											{:else}
												to be
												{#if Array.isArray(setting.require[reqId])}
													{#each setting.require[reqId] as val, i (val)}
														<span
															class="highlight"
															>{(
																requiredSettings[
																	reqId
																]
																	.options?.[
																	val
																] as any
															)
																?.name ||
																val}</span
														>
														{#if i < setting.require[reqId].length - 1}
															or
														{/if}
													{/each}
												{:else}
													<span
														class="highlight"
														>{(
															requiredSettings[
																reqId
															]
																.options?.[
																setting
																	.require[
																	reqId
																]
															] as any
														)?.name ||
															setting
																.require[
																reqId
															]}</span
													>
												{/if}
											{/if}
										</li>
									{/if}
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
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

	.STYLESHIFT-Setting-Warning-Section {
		margin-top: 10px;
		padding: 10px 15px;
		background: rgba(255, 204, 0, 0.1);
		border: 1px dashed #ffcc00;
		border-radius: 5px;
		z-index: 5;
		pointer-events: all;
	}

	.lock-info {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		width: 100%;
	}

	.lock-messages {
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-size: 13px;
		line-height: 1.4;
	}

	.lock-message {
		font-weight: 500;
		color: #ffffff;
		white-space: normal;
		overflow-wrap: break-word;
	}

	.requirement-warning {
		color: #ffcc00;
	}

	.requirement-list {
		margin: 5px 0 0 18px;
		padding: 0;
		list-style: disc;
		font-size: 12px;
		opacity: 0.9;

		.highlight {
			color: #fff;
			font-weight: bold;
			background: rgba(255, 255, 255, 0.1);
			padding: 0 4px;
			border-radius: 4px;
		}
	}
</style>
