<script lang="ts">
	import SettingFrame from "../SettingFrame.svelte";
	import Description from "./Description.svelte";
	let {
		id = "",
		name = "",
		description = "",
		placeholder = "Type here...",
		value = $bindable(""),
		onUpdate = () => {},
	} = $props();

	function handleChange() {
		onUpdate(value);
	}
</script>

<SettingFrame {id} type="text">
	<Description {name} {description} />
	<div class="STYLESHIFT-Input-Wrapper">
		<input type="text" class="STYLESHIFT-Input" {placeholder} bind:value onchange={handleChange} />
	</div>
</SettingFrame>

<style lang="scss">
	.STYLESHIFT-Input-Wrapper {
		flex: 1;
		max-width: 250px;
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
