<script lang="ts">
	let {
		accept = "",
		onFileSelect,
		children,
	}: {
		accept?: string;
		onFileSelect: (file: File) => void;
		children?: import("svelte").Snippet;
	} = $props();

	let inputRef: HTMLInputElement;

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			onFileSelect(file);
			target.value = "";
		}
	}

	function triggerClick() {
		inputRef.click();
	}
</script>

<button class="STYLESHIFT-File-Button" onclick={triggerClick}>
	{#if children}
		{@render children()}
	{:else}
		Choose File
	{/if}
</button>
<input bind:this={inputRef} type="file" {accept} onchange={handleChange} style="display: none;" />

<style lang="scss">
	.STYLESHIFT-File-Button {
		background: var(--White-10);
		border: 1px solid var(--White-20);
		border-radius: 8px;
		padding: 6px 12px;
		color: var(--Font-Color, white);
		cursor: pointer;
		transition: all 0.2s;
		font-size: 14px;
		margin: 5px 0;

		&:hover {
			background: var(--White-20);
			border-color: var(--Theme-0, #7f5db7);
		}

		&:active {
			transform: scale(0.98);
		}
	}
</style>
