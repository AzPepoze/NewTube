<script lang="ts">
	import { fade, fly, scale } from "svelte/transition";
	import { quintOut, backOut } from "svelte/easing";
	import { onMount } from "svelte";
	import { getAssetUrl } from "@ui/utils";
	import { logger } from "@/shared/logger";
	import { IS_FIREFOX } from "@/styleshift";
	import { alertPrompt } from "@/styleshift/shared/extension";

	let { onDone }: { onDone: () => void } = $props();

	let visible = $state(false);
	let step = $state(1);

	let commands = $state([]);

	onMount(() => {
		visible = true;
	});

	function nextStep() {
		step += 1;
		if (step === 2) {
			fetchCommandsShortcut();
		}
	}

	async function fetchCommandsShortcut() {
		logger.info("ui", "Fetching all keyboard shortcuts");
		try {
			const response = await chrome.runtime.sendMessage({
				Command: "getCommands",
			});
			logger.info("ui", "Got response from getCommands:", response);
			if (!response) {
				logger.warn("ui", "Empty response from getCommands");
				return;
			}
			if (Array.isArray(response)) {
				commands = response.filter((cmd) => cmd.shortcut);
				logger.info("ui", "Loaded commands:", commands);
			}
		} catch (e) {
			logger.error("ui", "Failed to fetch commands:", e);
		}
	}

	function close() {
		visible = false;
		setTimeout(onDone, 500);
	}
</script>

{#if visible}
	<div
		class="Welcome-Overlay STYLESHIFT-Main"
		transition:fade={{ duration: 1000 }}
	>
		<div class="Glow-Effect"></div>

		<div
			class="Welcome-Content-Wrapper"
			in:scale={{ start: 0.7, duration: 2500, easing: quintOut }}
			out:scale={{ start: 0.9, duration: 400 }}
		>
			<div class="Welcome-Content">
				{#if step === 1}
					<div
						class="Step-Container"
						out:fade={{ duration: 400 }}
					>
						<div
							class="Welcome-Logo-Container"
							in:fly|global={{
								y: -20,
								duration: 1000,
								delay: 300,
								easing: backOut,
							}}
						>
							<img
								src={getAssetUrl("icon/128.png")}
								alt="NewTube"
								class="Main-Icon"
							/>
						</div>

						<div class="Main-Title">
							<h2
								in:fly|global={{
									y: 20,
									duration: 800,
									delay: 600,
								}}
							>
								{#each "Welcome to NewTube".split("") as char, i (i)}
									<span
										class="wave-char white"
										style="animation-delay: {i *
											50}ms"
										>{char === " "
											? "\u00A0"
											: char}</span
									>
								{/each}
							</h2>
						</div>

						<div
							class="Action-Area"
							in:fly|global={{
								y: 30,
								duration: 1000,
								delay: 1400,
								easing: backOut,
							}}
						>
							<div class="Button-With-Meme">
								<img
									src={getAssetUrl(
										"welcome/kokoro.gif",
									)}
									alt=""
									class="Side-Meme left"
								/>
								<button
									class="Start-Button"
									onclick={nextStep}
								>
									<span class="btn-text">YAY!</span>
								</button>
								<img
									src={getAssetUrl(
										"welcome/kokoro.gif",
									)}
									alt=""
									class="Side-Meme right"
								/>
							</div>
						</div>
					</div>
				{:else if step === 2}
					<div
						class="Step-Container"
						in:fade={{ duration: 600, delay: 200 }}
						out:fade={{ duration: 400 }}
					>
						<div
							class="Wave-Title"
							in:fly|global={{
								y: 20,
								duration: 800,
								easing: backOut,
							}}
						>
							{#each "⌨️ Keyboard Shortcuts".split("") as char, i (i)}
								<span
									class="wave-char"
									style="animation-delay: {i * 50}ms"
									>{char === " "
										? "\u00A0"
										: char}</span
								>
							{/each}
						</div>

						<div
							class="Support-Section"
							in:fly|global={{
								y: 20,
								duration: 800,
								delay: 500,
							}}
						>
							{#if commands.length > 0}
								<div class="shortcuts-section">
									<p class="shortcuts-subtitle">
										(You can change these in your
										browser's extension settings)
									</p>
									<div class="shortcuts-list">
										{#each commands as cmd (cmd.name)}
											<div
												class="shortcut-item"
											>
												<span
													class="shortcut-desc"
													>{cmd.description}</span
												>
												<span
													class="shortcut-key"
													>{cmd.shortcut}</span
												>
											</div>
										{/each}
									</div>
								</div>
							{:else}
								<div class="shortcuts-empty-container">
									<p class="shortcuts-empty-text">
										No shortcuts configured
									</p>
									<button
										class="Start-Button highlight"
										onclick={() => {
											if (IS_FIREFOX) {
												alertPrompt({
													title: "Shortcuts Management",
													message: `Cannot open shortcut settings in Firefox.\nPlease navigate to "about:addons" manually to manage shortcuts.`,
												});
											} else {
												chrome.runtime.sendMessage({
													Command: "editCommands",
												});
											}
										}}
									>
										<span class="btn-text"
											>Manage Shortcuts</span
										>
									</button>
								</div>
							{/if}
						</div>

						<div
							class="Action-Area"
							in:fly|global={{
								y: 30,
								duration: 1000,
								delay: 1000,
								easing: backOut,
							}}
						>
							<div class="Button-With-Meme">
								<img
									src={getAssetUrl(
										"welcome/kokoro.gif",
									)}
									alt=""
									class="Side-Meme left"
								/>
								<button
									class="Start-Button"
									onclick={nextStep}
								>
									<span class="btn-text">Next</span>
								</button>
								<img
									src={getAssetUrl(
										"welcome/kokoro.gif",
									)}
									alt=""
									class="Side-Meme right"
								/>
							</div>
						</div>
					</div>
				{:else if step === 3}
					<div
						class="Step-Container"
						in:fade={{ duration: 600, delay: 200 }}
					>
						<div
							class="Wave-Title"
							in:fly|global={{
								y: 20,
								duration: 800,
								easing: backOut,
							}}
						>
							{#each "Enjoy your new experience!".split("") as char, i (i)}
								<span
									class="wave-char"
									style="animation-delay: {i * 50}ms"
									>{char === " "
										? "\u00A0"
										: char}</span
								>
							{/each}
						</div>

						<div
							class="Support-Section"
							in:fly|global={{
								y: 20,
								duration: 800,
								delay: 500,
							}}
						>
							<p class="Text-Sub">
								NewTube is a free, open-source project.
								If you enjoy using it, please consider
								supporting its development to help me
								keep improving the experience for
								everyone!
							</p>
							<p class="Text-Sub secondary">
								If you encounter any issues, please
								report them on GitHub.
							</p>
						</div>

						<div
							class="Action-Area"
							in:fly|global={{
								y: 30,
								duration: 1000,
								delay: 1000,
								easing: backOut,
							}}
						>
							<div class="Button-With-Meme">
								<img
									src={getAssetUrl(
										"welcome/kokoro.gif",
									)}
									alt=""
									class="Side-Meme left"
								/>
								<button
									class="Start-Button highlight"
									onclick={close}
								>
									<span class="btn-text"
										>Let's GO!!!</span
									>
								</button>
								<img
									src={getAssetUrl(
										"welcome/kokoro.gif",
									)}
									alt=""
									class="Side-Meme right"
								/>
							</div>
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
		background-color: var(--BG-Dark-Welcome);
		background-image: linear-gradient(
				to right,
				var(--White-03) 1px,
				transparent 1px
			),
			linear-gradient(to bottom, var(--White-03) 1px, transparent 1px);
		background-size: 40px 40px;
		z-index: 999999;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--Font-Color);
		font-family: "Inter", system-ui, sans-serif;
		overflow: hidden;
	}

	.Glow-Effect {
		position: absolute;
		width: 150%;
		height: 150%;
		background: radial-gradient(
			circle at center,
			var(--Theme-0-12) 0%,
			transparent 60%
		);
		animation: pulseGlow 8s infinite alternate ease-in-out;
		pointer-events: none;
		z-index: 2;
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
			font-size: 64px;
			font-weight: 900;
			margin: 0;
			letter-spacing: -2px;
			line-height: 1.1;
		}
	}

	.Text-Sub {
		font-size: 24px;
		color: var(--White-30);
		margin-top: 20px;
		letter-spacing: 2px;
		font-weight: 500;
		max-width: 600px;
		line-height: 1.4;

		&.secondary {
			font-size: 18px;
			margin-top: 10px;
			opacity: 0.8;
		}
	}

	.Support-Section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}

	.Button-With-Meme {
		display: flex;
		align-items: center;
		gap: 20px;
		position: relative;
	}

	.Side-Meme {
		width: 100px;
		height: 100px;
		object-fit: contain;
		filter: drop-shadow(0 0 10px var(--Theme-0-30));

		&.left {
			transform: scaleX(-1);
		}
	}

	.Wave-Title {
		font-size: 48px;
		font-weight: 900;
		display: flex;
		justify-content: center;
		color: var(--Font-Color);
		margin-bottom: 10px;
	}

	.wave-char {
		display: inline-block;
		animation: textWavePurple 2s infinite ease-in-out;

		&.white {
			animation-name: textWaveWhite;
		}
	}

	@keyframes textWavePurple {
		0%,
		100% {
			transform: translateY(0);
			text-shadow: 0 0 10px var(--Theme-0-30);
		}
		50% {
			transform: translateY(-15px);
			color: var(--Theme-0);
			text-shadow: 0 0 20px var(--Theme-0-50);
		}
	}

	@keyframes textWaveWhite {
		0%,
		100% {
			transform: translateY(0);
			text-shadow: 0 0 10px var(--White-30);
		}
		50% {
			transform: translateY(-15px);
			text-shadow: 0 0 20px var(--White-80);
		}
	}

	@keyframes titleFloat {
		0%,
		100% {
			transform: translateY(0) scale(1);
			filter: drop-shadow(0 0 0px rgba(127, 93, 183, 0));
		}
		50% {
			transform: translateY(-10px) scale(1.02);
			filter: drop-shadow(0 0 20px rgba(127, 93, 183, 0.5));
		}
	}

	.Start-Button {
		position: relative;
		background: var(--White-95);
		color: black;
		border: none;
		padding: 22px 70px;
		border-radius: 30px;
		font-size: 20px;
		font-weight: 800;
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 10px 30px var(--Black-50);

		&.highlight {
			background: var(--Theme-0);
			color: white;
			box-shadow: 0 15px 40px var(--Theme-0-40);
		}

		&:hover {
			transform: scale(1.08) translateY(-5px);
			box-shadow: 0 20px 50px var(--White-15);
			background: white;

			&.highlight {
				background: var(--Theme-0-Light);
				box-shadow: 0 20px 50px var(--Theme-0-50);
			}
		}

		&:active {
			transform: scale(0.96);
		}
	}

	.shortcuts-section {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin: 20px 0;
		padding: 16px;
		background: var(--White-02);
		border-radius: 8px;
		border: 1px solid var(--White-05);
		max-width: 600px;
	}

	.shortcuts-subtitle {
		font-size: 12px;
		color: var(--White-40);
		margin: 0 0 12px 0;
		font-style: italic;
	}

	.shortcuts-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.shortcut-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 12px;
		background: var(--White-03);
		border-radius: 5px;
		gap: 12px;
	}

	.shortcut-desc {
		font-size: 12px;
		color: var(--White-50);
		flex: 1;
	}

	.shortcut-key {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco,
			"Roboto Mono", "Courier New", monospace;
		font-size: 11px;
		font-weight: 700;
		background: var(--Theme-0-15);
		border: 1px solid var(--Theme-0-30);
		color: var(--Theme-0-Text);
		padding: 3px 6px;
		border-radius: 3px;
		white-space: nowrap;
	}

	.shortcuts-empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		padding: 20px;
	}

	.shortcuts-empty-text {
		font-size: 16px;
		color: var(--White-40);
		font-style: italic;
	}
</style>
