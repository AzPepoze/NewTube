<script lang="ts">
	import Icon from "./Icon.svelte";

	let {
		value = $bindable(""),
		placeholder = "Search",
		onInput = () => {},
	}: {
		value?: string;
		placeholder?: string;
		onInput?: (val: string) => void;
	} = $props();

	let inputEl = $state<HTMLInputElement | null>(null);
	let isFocused = $state(false);

	function handleInput() {
		onInput(value);
	}

	function clearSearch() {
		value = "";
		onInput("");
		inputEl?.focus();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			clearSearch();
		}
	}

	// Focus shortcut listener
	$effect(() => {
		function onGlobalKeyDown(e: KeyboardEvent) {
			if (
				e.key === "/" &&
				document.activeElement?.tagName !== "INPUT" &&
				document.activeElement?.tagName !== "TEXTAREA"
			) {
				e.preventDefault();
				inputEl?.focus();
			}
		}
		window.addEventListener("keydown", onGlobalKeyDown);
		return () => window.removeEventListener("keydown", onGlobalKeyDown);
	});
</script>

<div class="STYLESHIFT-Search-Wrapper" class:is-focused={isFocused}>
	<div class="STYLESHIFT-Search-Prefix">
		<Icon name="search" size={18} className="STYLESHIFT-Search-Icon" />
	</div>

	<input
		bind:this={inputEl}
		type="text"
		class="STYLESHIFT-Search-Input"
		{placeholder}
		bind:value
		oninput={handleInput}
		onkeydown={handleKeydown}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
	/>

	{#if value}
		<button
			class="STYLESHIFT-Search-Clear-Button"
			onclick={clearSearch}
			title="Clear search"
		>
			<Icon name="close" size={16} />
		</button>
	{/if}
</div>

<style lang="scss">
	.STYLESHIFT-Search-Wrapper {
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;
		background: var(--White-08);
		border-radius: 12px;
		padding: 2px 12px;
		box-sizing: border-box;
		margin-top: 3px;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		border: 1px solid var(--Border-Color);
		backdrop-filter: blur(8px);

		&:hover {
			background: var(--White-10);
			border-color: var(--White-20);
		}

		&.is-focused {
			background: var(--White-15);
			border-color: var(--Theme-0);
			box-shadow: 0 0 0 3px var(--Theme-0-20);

			.STYLESHIFT-Search-Icon {
				color: var(--Theme-0);
			}
		}
	}

	.STYLESHIFT-Search-Prefix {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		opacity: 0.6;
		transition: color 0.2s ease;
	}

	.STYLESHIFT-Search-Input {
		background: transparent;
		border: none;
		outline: none;
		color: var(--Font-Color);
		font-size: 15px;
		width: 100%;
		padding: 8px 0;
		font-family: inherit;

		&::placeholder {
			color: var(--Font-Color-Dim);
			opacity: 0.5;
		}
	}

	.STYLESHIFT-Search-Clear-Button {
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		border-radius: 50%;
		color: var(--Font-Color-Dim);
		transition: all 0.2s ease;
		margin-left: 8px;

		&:hover {
			background: var(--White-10);
			color: var(--Font-Color);
		}
	}

	.STYLESHIFT-Search-Shortcut {
		font-size: 11px;
		color: var(--Font-Color-Dim);
		background: var(--White-10);
		padding: 1px 6px;
		border-radius: 4px;
		margin-left: 8px;
		opacity: 0.6;
		border: 1px solid var(--Border-Color);
		pointer-events: none;
		user-select: none;
	}
</style>
