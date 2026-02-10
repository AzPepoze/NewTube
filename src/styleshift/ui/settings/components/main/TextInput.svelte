<script lang="ts">
	import type { Setting } from "@styleshift/types/store";
	import Description from "./Description.svelte";
	import { get_from_storage, get_root_value } from "@/styleshift/core/storage-manager";
	import { set_and_save } from "@ui/settings/setting-components";
	import { trigger_setting_update } from "@settings/functions";
	import { sequenced_task } from "@functions/normal";

	let {
		setting,
		placeholder = "Type here...",
	}: {
		setting: Extract<Setting, { type: "text_input" }>;
		placeholder?: string;
	} = $props();

	let value = $state("");

	async function init() {
		if (setting.id) {
			value = await get_from_storage(setting.id);
		} else {
			value = setting.value;
		}
	}
	init();

	const name = $derived(setting.name);
	const description = $derived(setting.description);

	async function handleUpdate() {
		if (setting.id) {
			await set_and_save(setting, value);
			await trigger_setting_update(setting.id);
		} else if (typeof setting.update_function === "function") {
			await setting.update_function(value);
		}
	}

	const sequencedUpdate = sequenced_task(handleUpdate);

	async function handleInput() {
		if (await get_root_value("Realtime_Extension")) {
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
