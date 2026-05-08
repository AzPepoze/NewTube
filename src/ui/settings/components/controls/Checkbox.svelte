<script lang="ts">
	import { getFromStorage } from "@core/storage/manager";
	import { triggerSettingUpdate } from "@settings/engine/functions";
	import type { Setting } from "@settings/types/styleshiftTypes";
	import { setAndSave } from "@ui/settings/settingsApi";
	import Description from "../primitives/Description.svelte";

	let {
		setting,
		value = $bindable(false),
		hideLabel = false,
	}: {
		setting: Extract<Setting, { type: "checkbox" }>;
		value?: boolean;
		hideLabel?: boolean;
	} = $props();

	async function init() {
		if (setting.id) {
			value = await getFromStorage(setting.id);
		} else {
			value = setting.value;
		}
	}
	init();

	$effect(() => {
		if (!setting.id && setting.value !== undefined) {
			value = setting.value;
		}
	});

	const name = $derived(setting.name || "");
	const description = $derived(setting.description || "");

	async function handleChange() {
		if (setting.id) {
			await setAndSave(setting, value);
			triggerSettingUpdate(setting.id);
		} else if (typeof (setting as any).updateFunction === "function") {
			(setting as any).updateFunction(value);
		}
	}
</script>

{#if !hideLabel}
	<Description {name} {description} />
{/if}
<input
	type="checkbox"
	class="STYLESHIFT-Checkbox"
	bind:checked={value}
	onchange={handleChange}
/>

<style lang="scss">
	.STYLESHIFT-Checkbox {
		font-size: 20px;
		appearance: none;
		width: 3.6em;
		height: 1.8em;
		background: var(--BG-Input);
		border-radius: 99px;
		position: relative;
		cursor: pointer;
		outline: none;
		transition: all 0.2s;
		box-shadow: 0px 0px 3px 0px white;
		margin: 0px;

		&:hover {
			filter: brightness(1.5);
			scale: 1.05;
		}

		&:checked {
			background: var(--Theme-0, #7f5db7);

			&:after {
				left: calc(100% - 1.5em - 0.15em) !important;
				transform: rotate(180deg) !important;
				filter: drop-shadow(0px 0px 5px black);
			}
		}

		&:after {
			position: absolute;
			display: flex;
			content: "❖";
			font-weight: 1000;
			width: 1.5em;
			height: 1.5em;
			border-radius: 50%;
			background: white !important;
			box-shadow: 0 0 0.25em var(--Black-30);
			left: 0.15em;
			top: 50%;
			translate: 0 -50%;
			transition: all 0.3s;
			justify-content: center;
			color: black !important;
			align-items: center;
			font-size: 20px;
		}
	}
</style>
