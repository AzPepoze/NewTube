<script lang="ts">
	import searchIcon from "@ui/assets/icons/search.svg";
	import { getAssetUrl } from "@ui/utils";

	let {
		value = $bindable(""),
		placeholder = "Search",
		onInput = () => {},
	}: {
		value?: string;
		placeholder?: string;
		onInput?: (val: string) => void;
	} = $props();

	function handleInput() {
		onInput(value);
	}
</script>

<div class="STYLESHIFT-Search-Wrapper">
	<img class="STYLESHIFT-Search-Icon" src={getAssetUrl(searchIcon)} alt="" />
	<input
		type="text"
		class="STYLESHIFT-Search-Input"
		{placeholder}
		bind:value
		oninput={handleInput}
	/>
</div>

<style lang="scss">
	.STYLESHIFT-Search-Wrapper {
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;
		background: var(--White-38);
		border-radius: 20px;
		padding: 5px 15px;
		box-sizing: border-box;
		margin-top: 3px;
		transition: all 0.3s ease;

		&:focus-within {
			background: var(--White-50);
			box-shadow: 0 0 0 2px var(--Theme-0, #7f5db7);
		}
	}

	.STYLESHIFT-Search-Icon {
		width: 20px;
		height: 20px;
		color: var(--Grey-Light);
		margin-right: 10px;
		flex-shrink: 0;
	}

	.STYLESHIFT-Search-Input {
		background: transparent;
		border: none;
		outline: none;
		color: var(--Font-Color);
		font-size: 17px;
		width: 100%;
		padding: 5px 0;

		&::placeholder {
			color: var(--Grey-Light);
		}
	}
</style>
