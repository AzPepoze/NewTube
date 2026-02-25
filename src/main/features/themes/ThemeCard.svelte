<script lang="ts">
	import { fade } from "svelte/transition";
	import IconButton from "@ui/settings/components/advance/IconButton.svelte";
	import ThemePreviewUi from "./ThemePreviewUi.svelte";

	let {
		name,
		preview,
		isActive,
		isLoading = false,
		onApply,
		onExport,
		onDelete,
	}: {
		name: string;
		preview: { bgImg: string; bgColor: string };
		isActive: boolean;
		isLoading?: boolean;
		onApply: (name: string) => void;
		onExport: (name: string) => void;
		onDelete: (name: string) => void;
	} = $props();
</script>

<div
	class="theme-card"
	class:active={isActive}
	class:loading={isLoading}
	onclick={() => !isLoading && onApply(name)}
	onkeydown={(e) => e.key === "Enter" && !isLoading && onApply(name)}
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
		<div
			class="overlay"
			style:background-color={preview.bgColor + "55"}
		></div>
		<ThemePreviewUi />
		<div class="accent-bar" style:background-color={preview.bgColor}></div>
	</div>
	<div class="card-footer">
		<span class="theme-name">{name}</span>
		<div class="card-actions">
			<IconButton
				icon="export"
				onClick={(e) => {
					e.stopPropagation();
					onExport(name);
				}}
				size={18}
				className="export-btn"
			/>
			<IconButton
				icon="delete"
				onClick={(e) => {
					e.stopPropagation();
					onDelete(name);
				}}
				size={18}
				className="delete-btn"
			/>
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

	.preview-area {
		height: 120px;
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
		}

		.accent-bar {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 4px;
			z-index: 3;
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
</style>
