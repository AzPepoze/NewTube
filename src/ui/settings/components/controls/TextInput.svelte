<script lang="ts">
	import { sequencedTask } from "@/core/shared/utilities";
	import { getFromStorage, getRootValue } from "@core/storage/manager";
	import { triggerSettingUpdate } from "@settings/engine/functions";
	import type { Setting } from "@settings/types/styleshiftTypes";
	import { setAndSave } from "@ui/settings/settingsApi";
	import Description from "../primitives/Description.svelte";

	let {
		setting,
		placeholder = "Type here...",
	}: {
		setting: Extract<Setting, { type: "textInput" }>;
		placeholder?: string;
	} = $props();

	let value = $state("");

	async function init() {
		if (setting.id) {
			const storedValue = await getFromStorage(setting.id);
			if (storedValue !== undefined) value = storedValue;
		} else {
			value = setting.value;
		}
	}
	init();

	$effect(() => {
		if (!setting.id && setting.value !== undefined) {
			value = setting.value as string;
		}
	});

	const name = $derived(setting.name);
	const description = $derived(setting.description);

	async function handleUpdate() {
		if (setting.id) {
			await setAndSave(setting, value);
			await triggerSettingUpdate(setting.id);
		} else if (typeof setting.updateFunction === "function") {
			await setting.updateFunction(value);
		}
	}

	const sequencedUpdate = sequencedTask(handleUpdate);

	async function handleInput() {
		if (await getRootValue("enableRealtimeExtension")) {
			sequencedUpdate();
		}
	}

	async function handleChange() {
		await sequencedUpdate();
	}
</script>

<div class="STYLESHIFT-Text-Input-Container">
	<Description {name} {description} />
	<div class="STYLESHIFT-Input-Wrapper">
		<input
			type="text"
			class="STYLESHIFT-Input"
			{placeholder}
			bind:value
			oninput={handleInput}
			onchange={handleChange}
		/>
	</div>
</div>

<style lang="scss">
	.STYLESHIFT-Text-Input-Container {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		width: 100%;
	}

	.STYLESHIFT-Input-Wrapper {
		flex: 1;
		min-width: 200px;
	}

	.STYLESHIFT-Input {
		width: -webkit-fill-available;
		background: var(--Text-Editor-BG, var(--Black-30));
		color: white;
		border-radius: 20px;
		padding: 10px 20px;
		font-family: inherit;
		font-size: 15px;
		outline: none;
		transition: all 0.2s;
		border: 1px gray solid;

		&:focus {
			border-color: var(--Theme-0, #7f5db7);
		}

		&::placeholder {
			color: var(--White-20);
		}
	}
</style>
