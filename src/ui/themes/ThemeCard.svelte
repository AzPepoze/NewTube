<script lang="ts">
	import { NEWTUBE_STORE_THEMES_URL } from "@extensions/youtube/constants";
	import Icon from "@ui/settings/components/primitives/Icon.svelte";
	import IconButton from "@ui/settings/components/primitives/IconButton.svelte";
	import { fade } from "svelte/transition";
	import ThemePreviewUi from "./ThemePreviewUi.svelte";
	import { openThemePreviewOverlay } from "./themeManagerService";

	let {
		id,
		name,
		preview,
		themeId,
		rawTheme,
		isActive,
		isLoading = false,
		isStoreItem = false,
		isInstalled = false,
		animationDelay = 0,
		onApply,
		onApplyLivePreview,
		onSave,
		onExport,
		onDelete,
	}: {
		id: string;
		name: string;
		preview: { bgImg: string; bgColor: string };
		themeId?: string;
		rawTheme?: any;
		isActive: boolean;
		isLoading?: boolean;
		isStoreItem?: boolean;
		isInstalled?: boolean;
		animationDelay?: number;
		onApply: (id: string) => void;
		onApplyLivePreview?: (theme: any) => void;
		onSave?: (id: string) => void;
		onExport?: (id: string) => void;
		onDelete?: (id: string) => void;
	} = $props();

	let isHovered = $state(false);
	let slideIndex = $state(0);
	let slideInterval: any = null;

	let imageList = $derived.by(() => {
		const list: string[] = [];
		if (rawTheme?.coverImage) list.push(rawTheme.coverImage);
		if (Array.isArray(rawTheme?.images)) {
			for (const img of rawTheme.images) {
				if (typeof img === "string" && img && !list.includes(img)) list.push(img);
			}
		}
		if (preview.bgImg && !list.includes(preview.bgImg)) {
			list.push(preview.bgImg);
		}
		return list;
	});

	function handleMouseEnter() {
		isHovered = true;
		if (imageList.length > 1) {
			slideInterval = setInterval(() => {
				slideIndex = (slideIndex + 1) % imageList.length;
			}, 1400);
		}
	}

	function handleMouseLeave() {
		isHovered = false;
		slideIndex = 0;
		if (slideInterval) {
			clearInterval(slideInterval);
			slideInterval = null;
		}
	}

	let currentThemeObject = $derived(
		rawTheme || {
			themeId: themeId || id,
			themeName: name,
			currentSettings: {
				MainThemeColor: preview.bgColor,
				BackgroundImageUrl: preview.bgImg,
			},
		},
	);
</script>

<div
	class="theme-card-wrapper"
	class:is-hovered={isHovered}
	style:animation-delay="{animationDelay}ms"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	role="region"
	aria-label="{name} theme card"
>
	<div
		class="theme-card"
		class:active={isActive}
		class:loading={isLoading}
		onclick={() => !isLoading && onApply(id)}
		onkeydown={(e) => e.key === "Enter" && !isLoading && onApply(id)}
		role="button"
		tabindex="0"
	>
		{#if isActive}
			<div class="active-badge">ACTIVE</div>
		{/if}

		{#if isLoading}
			<div class="loading-overlay" transition:fade={{ duration: 200 }}>
				<div class="spinner"></div>
			</div>
		{/if}

		<div class="preview-area" style:background-color={preview.bgColor}>
			<div class="overlay"></div>

			<div class="slideshow-container">
				{#if imageList.length > 0}
					<div class="slideshow-track" style="transform: translateX(-{slideIndex * 100}%);">
						{#each imageList as imgUrl, idx (idx)}
							<div class="slide-item" style:background-image="url({imgUrl})"></div>
						{/each}
					</div>
				{:else}
					<div class="slideshow-track">
						<div class="slide-item default-mockup">
							<ThemePreviewUi />
						</div>
					</div>
				{/if}
			</div>

			{#if imageList.length > 1 && isHovered}
				<div class="slide-indicators" transition:fade={{ duration: 150 }}>
					{#each imageList as _, idx (idx)}
						<div class="indicator-dot" class:active={idx === slideIndex}></div>
					{/each}
				</div>
			{/if}

			<div class="title-overlay">
				<div class="title-container" title={name}>
					<span class="theme-name">{name}</span>
				</div>
			</div>

			<div class="accent-bar" style:background-color={preview.bgColor}></div>
		</div>
	</div>

	<div class="card-actions-drawer">
		<div class="card-actions">
			<IconButton
				icon="visibility"
				onClick={(e) => {
					e.stopPropagation();
					openThemePreviewOverlay({
						theme: currentThemeObject,
						isStoreItem,
						isInstalled,
						onApply: () => onApply(id),
						onApplyLivePreview: (t) => onApplyLivePreview?.(t),
						onSave: () => onSave?.(id),
					});
				}}
				size={18}
				className="preview-btn"
			/>
			{#if !isStoreItem}
				{#if themeId}
					<IconButton
						icon="openInNew"
						onClick={(e) => {
							e.stopPropagation();
							window.open(`${NEWTUBE_STORE_THEMES_URL}/${themeId}`, "_blank");
						}}
						size={18}
						className="link-btn"
					/>
				{/if}
				<IconButton
					icon="export"
					onClick={(e) => {
						e.stopPropagation();
						onExport?.(id);
					}}
					size={18}
					className="export-btn"
				/>
				<IconButton
					icon="delete"
					onClick={(e) => {
						e.stopPropagation();
						onDelete?.(id);
					}}
					size={18}
					className="delete-btn"
				/>
			{:else}
				{#if isInstalled}
					<div class="installed-indicator">
						<Icon name="check_circle" size={16} />
						<span>Installed</span>
					</div>
				{:else}
					<IconButton
						icon="save"
						onClick={(e) => {
							e.stopPropagation();
							onSave?.(id);
						}}
						size={18}
						className="save-btn"
					/>
				{/if}
				<IconButton
					icon="download"
					onClick={(e) => {
						e.stopPropagation();
						onApply(id);
					}}
					size={18}
					className="apply-btn"
				/>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.theme-card-wrapper {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		animation: card-entry 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		overflow: visible;
		margin-bottom: 5px;

		&:hover {
			.theme-card {
				border-color: var(--fg-opacity-20);
				box-shadow: 0 8px 25px var(--shadow-color);
			}

			.card-actions-drawer {
				transform: translateY(0);
				opacity: 1;
				pointer-events: auto;
				box-shadow: 0 8px 20px var(--shadow-color);
			}

			.theme-name {
				white-space: normal;
				word-break: break-word;
				text-overflow: clip;
			}

			.accent-bar {
				height: 4px;
				filter: drop-shadow(0 0 8px var(--theme-0));
			}
		}
	}

	.theme-card {
		position: relative;
		z-index: 2;
		width: 100%;
		aspect-ratio: 16 / 9;
		height: auto;
		background: var(--fg-opacity-05);
		border-radius: 16px;
		border: 1px solid var(--fg-opacity-10);
		overflow: hidden;
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;
		display: flex;
		flex-direction: column;

		&.active {
			border: 2px solid var(--theme-0);
			box-shadow: 0 0 15px var(--theme-0);

			.active-badge {
				position: absolute;
				top: 10px;
				right: 10px;
				background: var(--theme-0);
				color: var(--fg-opacity-100);
				padding: 4px 8px;
				border-radius: 6px;
				font-size: 10px;
				font-weight: 800;
				z-index: 10;
				box-shadow: 0 2px 8px var(--shadow-color);
			}
		}

		&.loading {
			pointer-events: none;

			.preview-area {
				filter: grayscale(0.2);
			}
		}
	}

	.loading-overlay {
		position: absolute;
		inset: 0;
		background: var(--bg-overlay-30);
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--fg-opacity-10);
		border-top-color: var(--theme-0);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		box-shadow: 0 0 15px var(--shadow-color);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes card-entry {
		from {
			opacity: 0;
			transform: translateY(20px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.preview-area {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;

		.overlay {
			position: absolute;
			inset: 0;
			z-index: 1;
			background: linear-gradient(to bottom, var(--bg-overlay-10) 0%, var(--bg-overlay-30) 100%);
			pointer-events: none;
		}

		.slideshow-container {
			position: relative;
			z-index: 2;
			width: 100%;
			height: 100%;
			overflow: hidden;
		}

		.slideshow-track {
			display: flex;
			width: 100%;
			height: 100%;
			transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
		}

		.slide-item {
			min-width: 100%;
			height: 100%;
			background-size: contain;
			background-repeat: no-repeat;
			background-position: center;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.slide-indicators {
			position: absolute;
			top: 10px;
			left: 10px;
			z-index: 4;
			display: flex;
			gap: 4px;
			background: rgba(0, 0, 0, 0.5);
			backdrop-filter: blur(4px);
			padding: 3px 8px;
			border-radius: 10px;

			.indicator-dot {
				width: 5px;
				height: 5px;
				border-radius: 50%;
				background: rgba(255, 255, 255, 0.4);
				transition: all 0.2s ease;

				&.active {
					background: var(--theme-0, #00ffcc);
					transform: scale(1.3);
				}
			}
		}

		.title-overlay {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 5;
			padding: 28px 12px 10px;
			background: linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.5) 60%, transparent 100%);
			pointer-events: none;
		}

		.accent-bar {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 3px;
			z-index: 6;
			opacity: 0.9;
			transition:
				height 0.3s ease,
				filter 0.3s ease;
		}
	}

	.title-container {
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;

		.theme-name {
			font-weight: 600;
			color: #ffffff;
			font-size: 14px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			width: 100%;
			text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
		}
	}

	.card-actions-drawer {
		position: relative;
		z-index: 1;
		margin-top: -24px;
		padding: 32px 12px 10px;
		background: var(--bg-overlay-80, rgba(20, 20, 25, 0.95));
		backdrop-filter: blur(12px);
		border-radius: 0 0 16px 16px;
		border: 1px solid var(--fg-opacity-10);
		border-top: none;
		display: flex;
		justify-content: center;
		align-items: center;
		transform: translateY(-100%);
		opacity: 0;
		pointer-events: none;
		transition:
			transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1),
			opacity 0.25s ease;
	}

	.card-actions {
		display: flex;
		gap: 8px;
		align-items: center;
		justify-content: center;
		width: 100%;

		:global(.preview-btn) {
			background: var(--fg-opacity-10) !important;
			border-radius: 8px !important;

			&:hover {
				background: var(--theme-0) !important;
				color: #000 !important;
				opacity: 0.9;
			}
		}

		:global(.apply-btn) {
			background: var(--fg-opacity-10) !important;
			border-radius: 8px !important;

			&:hover {
				background: var(--theme-0) !important;
				opacity: 0.8;
			}
		}

		:global(.save-btn) {
			background: var(--fg-opacity-10) !important;
			border-radius: 8px !important;

			&:hover {
				background: var(--theme-0) !important;
				opacity: 0.8;
			}
		}

		:global(.export-btn) {
			background: var(--fg-opacity-10) !important;
			border-radius: 8px !important;

			&:hover {
				background: var(--theme-0) !important;
				opacity: 0.8;
			}
		}

		:global(.delete-btn) {
			background: var(--theme-error-10) !important;
			border-radius: 8px !important;

			&:hover {
				background: var(--theme-error-50) !important;
			}
		}
	}

	.installed-indicator {
		display: flex;
		align-items: center;
		gap: 6px;
		color: var(--theme-success);
		font-size: 13px;
		font-weight: 600;
		padding: 0 8px;
		opacity: 0.9;

		:global(.styleshift-icon) {
			margin: 0;
		}
	}
</style>
