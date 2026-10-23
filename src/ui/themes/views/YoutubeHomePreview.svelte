<script lang="ts">
	import type { PreviewColors } from "../previewColors";

	/** The home page is drawn on a 1920x1080 canvas and scaled down to the card. */
	const CANVAS_WIDTH = 1920;

	let {
		colors,
		backgroundImage = "",
	}: {
		colors: PreviewColors;
		backgroundImage?: string;
	} = $props();

	let width = $state(0);
	const scale = $derived(width / CANVAS_WIDTH);

	const guideItems = ["Home", "Shorts", "Subscriptions"];
	const chipLabels = ["All", "Music", "Gaming", "News", "Live", "Recently uploaded"];
	const cards = [0, 1, 2, 3, 4, 5];
</script>

<div class="preview" bind:clientWidth={width}>
	<div
		class="stage"
		style:transform="scale({scale})"
		style:--yt-page={colors.page}
		style:--yt-text={colors.text}
		style:--yt-muted={colors.secondaryText}
		style:--yt-accent={colors.accent}
		style:--yt-topbar={colors.topbar}
		style:--yt-border={colors.border}
		style:--yt-radius="{colors.radius}px"
	>
		{#if backgroundImage}
			<div class="wallpaper" style:background-image="url({backgroundImage})"></div>
		{/if}

		<header class="topbar">
			<span class="menu-button"></span>
			<div class="logo">
				<span class="logo-play"></span>
				<span class="logo-text">YouTube</span>
			</div>
			<div class="search">
				<span class="search-field"></span>
				<span class="search-go"></span>
			</div>
			<span class="mic"></span>
			<span class="create"></span>
			<span class="avatar"></span>
		</header>

		<aside class="guide">
			{#each guideItems as item, index (item)}
				<div class="guide-entry" class:selected={index === 0}>
					<span class="guide-icon"></span>
					<span>{item}</span>
				</div>
			{/each}
		</aside>

		<div class="chips">
			{#each chipLabels as chip, index (chip)}
				<span class="chip" class:selected={index === 0}>{chip}</span>
			{/each}
		</div>

		<div class="grid">
			{#each cards as card (card)}
				<div class="card">
					<div class="thumb">
						<span class="duration"></span>
					</div>
					<div class="info">
						<span class="channel-avatar"></span>
						<div class="info-text">
							<span class="title"></span>
							<span class="meta"></span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.preview {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
	}

	.stage {
		position: absolute;
		top: 0;
		left: 0;
		width: 1920px;
		height: 1080px;
		transform-origin: top left;
		overflow: hidden;
		background: var(--yt-page);
		color: var(--yt-text);
		font-family: "Roboto", "Arial", sans-serif;
	}

	.wallpaper {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
	}
	.wallpaper::after {
		content: "";
		position: absolute;
		inset: 0;
		background: color-mix(in srgb, var(--yt-page) 55%, transparent);
	}

	.topbar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 2;
		height: 56px;
		background: var(--yt-topbar);
	}
	.menu-button {
		position: absolute;
		left: 24px;
		top: 16px;
		width: 24px;
		height: 2px;
		background: var(--yt-text);
		box-shadow:
			0 6px 0 var(--yt-text),
			0 12px 0 var(--yt-text);
	}
	.logo {
		position: absolute;
		left: 56px;
		top: 16px;
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.logo-play {
		width: 28px;
		height: 20px;
		border-radius: 6px;
		background: var(--yt-accent);
	}
	.logo-text {
		font-size: 20px;
		font-weight: 600;
		letter-spacing: -0.4px;
		color: var(--yt-text);
	}
	.search {
		position: absolute;
		left: 610px;
		top: 8px;
		width: 600px;
		height: 40px;
		display: flex;
	}
	.search-field {
		flex: 1;
		border: 1px solid var(--yt-border);
		border-right: 0;
		border-radius: 20px 0 0 20px;
		background: color-mix(in srgb, var(--yt-text) 5%, var(--yt-page));
	}
	.search-go {
		width: 64px;
		border: 1px solid var(--yt-border);
		border-radius: 0 20px 20px 0;
		background: color-mix(in srgb, var(--yt-text) 10%, var(--yt-page));
	}
	.mic {
		position: absolute;
		left: 1251px;
		top: 8px;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--yt-text) 10%, var(--yt-page));
	}
	.create {
		position: absolute;
		left: 1420px;
		top: 10px;
		width: 92px;
		height: 36px;
		border-radius: 18px;
		background: color-mix(in srgb, var(--yt-text) 10%, var(--yt-page));
	}
	.avatar {
		position: absolute;
		left: 1842px;
		top: 10px;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--yt-accent);
	}

	.guide {
		position: absolute;
		top: 56px;
		left: 0;
		bottom: 0;
		width: 240px;
		padding: 12px;
		box-sizing: border-box;
	}
	.guide-entry {
		display: flex;
		align-items: center;
		gap: 24px;
		height: 40px;
		padding: 0 12px;
		border-radius: var(--yt-radius);
		font-size: 14px;
		font-weight: 500;
	}
	.guide-entry.selected {
		background: color-mix(in srgb, var(--yt-text) 10%, var(--yt-page));
	}
	.guide-icon {
		width: 24px;
		height: 24px;
		border-radius: 6px;
		background: var(--yt-muted);
		opacity: 0.6;
	}

	.chips {
		position: absolute;
		top: 68px;
		left: 264px;
		display: flex;
		gap: 12px;
	}
	.chip {
		height: 32px;
		line-height: 32px;
		padding: 0 12px;
		border-radius: 8px;
		background: color-mix(in srgb, var(--yt-text) 10%, var(--yt-page));
		font-size: 14px;
		font-weight: 500;
		white-space: nowrap;
	}
	.chip.selected {
		background: var(--yt-text);
		color: var(--yt-page);
	}

	.grid {
		position: absolute;
		top: 128px;
		left: 264px;
		display: grid;
		grid-template-columns: repeat(3, 524px);
		grid-auto-rows: 395px;
		column-gap: 16px;
	}
	.card {
		display: flex;
		flex-direction: column;
	}
	.thumb {
		position: relative;
		width: 524px;
		height: 295px;
		border-radius: 12px;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--yt-accent) 45%, var(--yt-page)),
			color-mix(in srgb, var(--yt-text) 12%, var(--yt-page))
		);
	}
	.duration {
		position: absolute;
		right: 8px;
		bottom: 8px;
		width: 40px;
		height: 20px;
		border-radius: 4px;
		background: rgba(0, 0, 0, 0.8);
	}
	.info {
		display: flex;
		gap: 8px;
		margin-top: 12px;
	}
	.channel-avatar {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--yt-text) 20%, var(--yt-page));
	}
	.info-text {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
		flex: 1;
	}
	.title {
		display: block;
		width: 90%;
		height: 12px;
		margin-top: 4px;
		border-radius: 4px;
		background: color-mix(in srgb, var(--yt-text) 60%, transparent);
	}
	.meta {
		display: block;
		width: 45%;
		height: 9px;
		border-radius: 4px;
		background: var(--yt-muted);
	}
</style>
