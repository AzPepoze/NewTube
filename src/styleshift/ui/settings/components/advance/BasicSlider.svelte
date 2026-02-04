<script lang="ts">
	let {
		min = 0,
		max = 100,
		step = 1,
		value = $bindable(0),
		onInput,
	}: {
		min?: number;
		max?: number;
		step?: number;
		value?: number;
		onInput?: (val: number) => void;
	} = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const val = parseFloat(target.value);
		value = val;
		onInput?.(val);
	}

	let progress = $derived(((value - min) / (max - min)) * 100);
</script>

<input
	type="range"
	{min}
	{max}
	{step}
	{value}
	oninput={handleInput}
	class="STYLESHIFT-Number-Slide"
	style:--progress="{progress}%"
/>

<style lang="scss">
	.STYLESHIFT-Number-Slide {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 6px;
		background: var(--White-10);
		border-radius: 10px;
		outline: none;
		cursor: pointer;
		border: 1px solid var(--White-10);
		background-image: linear-gradient(var(--Theme-0, #7f5db7), var(--Theme-0, #7f5db7));
		background-size: var(--progress) 100%;
		background-repeat: no-repeat;
		margin: 10px 0;

		&::-webkit-slider-thumb {
			-webkit-appearance: none;
			appearance: none;
			width: 16px;
			height: 16px;
			background: var(--Font-Color, white);
			border: 2px solid var(--Theme-0, #7f5db7);
			border-radius: 50%;
			cursor: pointer;
			box-shadow: 0 0 10px var(--Black-30);
			transition: transform 0.1s ease;
		}

		&::-webkit-slider-thumb:hover {
			transform: scale(1.1);
		}
	}
</style>
