<script lang="ts">
	import { fade } from "svelte/transition";
	import IconButton from "@ui/settings/components/advance/IconButton.svelte";
	import ThemePreviewUi from "./ThemePreviewUi.svelte";
	import { NEWTUBE_STORE_THEMES_URL } from "@/main/constants";
	import Icon from "@ui/settings/components/main/Icon.svelte";

	let {
		id,
		name,
		preview,
		themeId,
		isActive,
		isLoading = false,
		isStoreItem = false,
		isInstalled = false,
		animationDelay = 0,
		onApply,
		onSave,
		onExport,
		onDelete,
	}: {
		id: string;
		name: string;
		preview: { bgImg: string; bgColor: string };
		themeId?: string;
		isActive: boolean;
		isLoading?: boolean;
		isStoreItem?: boolean;
		isInstalled?: boolean;
		animationDelay?: number; // New animationDelay prop
		onApply: (id: string) => void;
		onSave?: (id: string) => void;
		onExport?: (id: string) => void;
		onDelete?: (id: string) => void;
	} = $props();
</script>

<div
	class="theme-card"
	class:active={isActive}
	class:loading={isLoading}
	style:animation-delay="{animationDelay}ms"
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

	<div
		class="preview-area"
		style:background-image={preview.bgImg
			? `url(${preview.bgImg})`
			: "none"}
		style:background-color={preview.bgColor}
	>
		<div class="overlay"></div>
		<ThemePreviewUi />
		<div
			class="accent-bar"
			style:background-color={preview.bgColor}
		></div>
	</div>
	<div class="card-footer">
		<span class="theme-name">{name}</span>
		<div class="card-actions">
			{#if !isStoreItem}
				{#if themeId}
					<IconButton
						icon="openInNew"
						onClick={(e) => {
							e.stopPropagation();
							window.open(
								`${NEWTUBE_STORE_THEMES_URL}/${themeId}`,
								"_blank",
							);
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
	.theme-card {
		position: relative;
		background: var(--White-05);
		border-radius: 16px;
		border: 1px solid var(--White-10);
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		flex-direction: column;
		animation: card-entry 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;

		&:hover {
			border-color: var(--White-20);
			box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);

			.preview-area {
				transform: scale(1.05);
			}
		}

		&.active {
			border: 2px solid var(--Theme-0);
			box-shadow: 0 0 15px var(--Theme-0);

			.active-badge {
				position: absolute;
				top: 10px;
				right: 10px;
				background: var(--Theme-0);
				color: var(--White-100);
				padding: 4px 8px;
				border-radius: 6px;
				font-size: 10px;
				font-weight: 800;
				z-index: 10;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
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
		background: rgba(0, 0, 0, 0.3);
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--White-10);
		border-top-color: var(--Theme-0);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
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
		height: 130px;
		background-size: cover;
		background-position: center;
		position: relative;
		transition: transform 0.5s ease;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;

		.overlay {
			position: absolute;
			inset: 0;
			z-index: 1;
			background: linear-gradient(
				to bottom,
				rgba(0, 0, 0, 0.1) 0%,
				rgba(0, 0, 0, 0.3) 100%
			);
		}

		.accent-bar {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 3px;
			z-index: 3;
			opacity: 0.9;
		}
	}

	.card-footer {
		padding: 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: rgba(0, 0, 0, 0.5);
		border-top: 1px solid var(--White-05);
		pointer-events: auto;
	}

	.theme-name {
		font-weight: 600;
		color: var(--White-100, white);
		font-size: 14px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
		margin-right: 10px;
	}

	.card-actions {
		display: flex;
		gap: 8px;

		:global(.apply-btn) {
			background: rgba(255, 255, 255, 0.1) !important;
			border-radius: 8px !important;

			&:hover {
				background: var(--Theme-0) !important;
				opacity: 0.8;
			}
		}

		:global(.save-btn) {
			background: var(--White-10) !important;
			border-radius: 8px !important;

			&:hover {
				background: var(--Theme-0) !important;
				opacity: 0.8;
			}
		}

		:global(.export-btn) {
			background: var(--White-10) !important;
			border-radius: 8px !important;

			&:hover {
				background: var(--Theme-0) !important;
				opacity: 0.8;
			}
		}

		:global(.delete-btn) {
			background: var(--Red-10, rgba(255, 0, 0, 0.1)) !important;
			border-radius: 8px !important;

			&:hover {
				background: var(--Red-40, rgba(255, 0, 0, 0.4)) !important;
			}
		}
	}

	.installed-indicator {
		display: flex;
		align-items: center;
		gap: 6px;
		color: #4caf50;
		font-size: 13px;
		font-weight: 600;
		padding: 0 8px;
		opacity: 0.9;

		:global(.STYLESHIFT-Icon) {
			margin: 0;
		}
	}
</style>
