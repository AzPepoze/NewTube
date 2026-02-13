<script lang="ts">
	import { fade, fly, scale } from "svelte/transition";
	import { quintOut, backOut } from "svelte/easing";
	import { onMount } from "svelte";
	import { getAssetUrl } from "@ui/utils";

	let { onDone }: { onDone: () => void } = $props();

	let visible = $state(false);
	let step = $state(1);

	onMount(() => {
		visible = true;
	});

	function nextStep() {
		step = 2;
	}

	function close() {
		visible = false;
		setTimeout(onDone, 500);
	}
</script>

{#if visible}
	<div class="Welcome-Overlay" transition:fade={{ duration: 1000 }}>
		<div class="Glow-Effect"></div>

		<div
			class="Welcome-Content-Wrapper"
			in:scale={{ start: 0.7, duration: 2500, easing: quintOut }}
			out:scale={{ start: 0.9, duration: 400 }}
		>
			<div class="Welcome-Content">
				{#if step === 1}
					<div class="Step-Container" out:fade={{ duration: 400 }}>
						<div
							class="Welcome-Logo-Container"
							in:fly|global={{ y: -20, duration: 1000, delay: 300, easing: backOut }}
						>
							<img src={getAssetUrl("icon/128.png")} alt="NewTube" class="Main-Icon" />
						</div>

						<div class="Main-Title">
							<h2 class="Text-Gradient" in:fly|global={{ y: 20, duration: 800, delay: 600 }}>
								I'm back
							</h2>
							<p class="Text-Sub" in:fly|global={{ y: 20, duration: 800, delay: 900 }}>
								did you miss me?
							</p>
						</div>

						<div
							class="Action-Area"
							in:fly|global={{ y: 30, duration: 1000, delay: 1400, easing: backOut }}
						>
							<button class="Start-Button" onclick={nextStep}>
								<span class="btn-text">YAY!</span>
							</button>
						</div>
					</div>
				{:else}
					<div class="Step-Container" in:fade={{ duration: 600, delay: 200 }}>
						<div class="Wave-Title" in:fly|global={{ y: 20, duration: 800, easing: backOut }}>
							{#each "Enjoy your new experience!".split("") as char, i (i)}
								<span class="wave-char" style="animation-delay: {i * 50}ms"
									>{char === " " ? "\u00A0" : char}</span
								>
							{/each}
						</div>

						<div
							class="Action-Area"
							in:fly|global={{ y: 30, duration: 1000, delay: 1000, easing: backOut }}
						>
							<button class="Start-Button highlight" onclick={close}>
								<span class="btn-text">Let's GO!!!</span>
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.Welcome-Overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #000000;
		z-index: 999999;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-family: "Inter", system-ui, sans-serif;
		overflow: hidden;
	}

	.Glow-Effect {
		position: absolute;
		width: 150%;
		height: 150%;
		background: radial-gradient(circle at center, rgba(127, 93, 183, 0.12) 0%, transparent 60%);
		animation: pulseGlow 8s infinite alternate ease-in-out;
		pointer-events: none;
	}

	@keyframes pulseGlow {
		from {
			transform: scale(1);
			opacity: 0.4;
		}
		to {
			transform: scale(1.3);
			opacity: 0.7;
		}
	}

	.Welcome-Content-Wrapper {
		z-index: 20;
		text-align: center;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.Welcome-Content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 400px;
	}

	.Step-Container {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40px;
		width: 100%;
	}

	.Welcome-Logo-Container {
		position: relative;
		width: 180px;
		height: 180px;
		margin-bottom: 10px;
	}

	.Main-Icon {
		width: 100%;
		height: 100%;
		object-fit: contain;
		position: relative;
		z-index: 2;
	}

	.Main-Title {
		h2 {
			font-size: 84px;
			font-weight: 900;
			margin: 0;
			letter-spacing: -4px;
			line-height: 1;
		}

		.Text-Sub {
			font-size: 24px;
			color: rgba(255, 255, 255, 0.3);
			margin-top: 20px;
			letter-spacing: 3px;
			font-weight: 500;
		}
	}

	.Wave-Title {
		font-size: 48px;
		font-weight: 900;
		display: flex;
		justify-content: center;
		color: #fff;
		margin-bottom: 20px;
	}

	.wave-char {
		display: inline-block;
		animation: textWave 2s infinite ease-in-out;
	}

	@keyframes textWave {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-15px);
			color: #7f5db7;
		}
	}

	.Text-Gradient {
		background: linear-gradient(to bottom, #fff 40%, #7f5db7);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.Start-Button {
		position: relative;
		background: rgba(255, 255, 255, 0.95);
		color: black;
		border: none;
		padding: 22px 70px;
		border-radius: 30px;
		font-size: 20px;
		font-weight: 800;
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

		&.highlight {
			background: #7f5db7;
			color: white;
			box-shadow: 0 15px 40px rgba(127, 93, 183, 0.4);
		}

		&:hover {
			transform: scale(1.08) translateY(-5px);
			box-shadow: 0 20px 50px rgba(255, 255, 255, 0.15);
			background: #ffffff;

			&.highlight {
				background: #9374c9;
				box-shadow: 0 20px 50px rgba(127, 93, 183, 0.5);
			}
		}

		&:active {
			transform: scale(0.96);
		}
	}
</style>
