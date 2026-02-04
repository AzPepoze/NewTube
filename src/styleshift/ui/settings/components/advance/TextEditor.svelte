<script lang="ts">
	let { value = $bindable(""), onInput, onBlur, className = "" } = $props();
</script>

<textarea
	class="STYLESHIFT-Text-Editor {className}"
	bind:value
	oninput={() => onInput?.(value)}
	onblur={() => onBlur?.(value)}
></textarea>

<style lang="scss">
	.STYLESHIFT-Text-Editor {
		width: 100%;
		min-height: 100px;
		background: var(--White-05);
		border: 1px solid var(--White-10);
		color: white;
		border-radius: 8px;
		padding: 10px;
		font-family: "Fira Code", monospace;
		resize: vertical;
		outline: none;
		transition: border-color 0.2s;

		&:focus {
			border-color: var(--theme-color, #ff0000);
		}
	}
</style>
