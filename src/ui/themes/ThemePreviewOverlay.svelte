<script lang="ts">
	import { STYLESHIFT_STORE_PREVIEW_URL } from "@core/theme/config";
	import type { Theme } from "@core/theme/manager";
	import { NEWTUBE_STORE_THEMES_URL } from "@extensions/youtube/constants";
	import Button from "@ui/settings/components/controls/Button.svelte";
	import CapsuleTabs from "@ui/window/components/CapsuleTabs.svelte";
	import { fade, scale } from "svelte/transition";

	let {
		theme,
		isStoreItem = false,
		isInstalled = false,
		isOpen = false,
		onClose,
		onApply,
		onApplyLivePreview,
		onSave,
	}: {
		theme: Theme | null;
		isStoreItem?: boolean;
		isInstalled?: boolean;
		isOpen: boolean;
		onClose: () => void;
		onApply: (theme: Theme) => void;
		onApplyLivePreview: (theme: Theme) => void;
		onSave?: (theme: Theme) => void;
	} = $props();

	let iframeEl = $state<HTMLIFrameElement | null>(null);
	let isLoading = $state(true);
	let previewSource = $state<"store" | "mockup">("store");

	let applyIcon = $derived(
		isStoreItem ? (isInstalled ? "check_circle" : "download") : "check_circle"
	);

	let applyTitle = $derived(
		isStoreItem ? (isInstalled ? "Installed" : "Install") : "Apply Theme"
	);

	$effect(() => {
		if (theme?.themeId && isStoreItem) {
			previewSource = "store";
		} else {
			previewSource = "mockup";
		}
	});

	const sourceTabOptions = [
		{ id: "store", label: "Store Web Page", icon: "storefront" },
		{ id: "mockup", label: "Mockup Stage", icon: "palette" },
	];

	const baseUrl = STYLESHIFT_STORE_PREVIEW_URL || "https://newtube.azpepoze.com/themes/preview";

	let previewUrl = $derived.by(() => {
		if (!theme) return `${baseUrl}?embedded=true`;

		let url = "";
		if (previewSource === "store" && theme.themeId) {
			url = `${NEWTUBE_STORE_THEMES_URL}/${encodeURIComponent(theme.themeId)}`;
		} else if (isStoreItem && theme.themeId) {
			url = `${baseUrl}?id=${encodeURIComponent(theme.themeId)}`;
		} else {
			try {
				const payload = {
					themeId: theme.themeId || "local-preview",
					themeName: theme.themeName || "Local Theme",
					settings: theme.currentSettings || (theme as any).settings || {},
					addOnStyleShiftItems: theme.addOnStyleShiftItems || [],
				};
				const jsonStr = JSON.stringify(payload);
				const base64 = btoa(encodeURIComponent(jsonStr));
				url = `${baseUrl}?data=${base64}`;
			} catch (e) {
				console.error("Failed to encode theme preview payload", e);
				url = baseUrl;
			}
		}

		return url.includes("?") ? `${url}&embedded=true` : `${url}?embedded=true`;
	});

	$effect(() => {
		if (previewUrl) {
			isLoading = true;
		}
	});

	function handleIframeLoad() {
		isLoading = false;
		if (!iframeEl || !theme || previewSource === "store") return;
		try {
			const payload = {
				themeId: theme.themeId || "local-preview",
				themeName: theme.themeName || "Local Theme",
				settings: theme.currentSettings || (theme as any).settings || {},
				addOnStyleShiftItems: theme.addOnStyleShiftItems || [],
			};
			iframeEl.contentWindow?.postMessage(
				{
					type: "SET_THEME_PREVIEW",
					theme: payload,
				},
				"*",
			);
		} catch (e) {
			console.warn("Could not postMessage to preview iframe", e);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if isOpen && theme}
	<div class="styleshift-main top-level-preview-overlay" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
		<div class="preview-modal-wrapper" in:scale={{ duration: 250, start: 0.96 }} out:scale={{ duration: 200, start: 0.96 }}>
			<!-- Top Header Bar with Theme Title and Capsule Slider -->
			<div class="preview-header-bar">
				<div class="header-left">
					<h2 class="theme-title">{theme.themeName || "Untitled Theme"}</h2>
					<span class="type-badge">{isStoreItem ? "Store Theme" : "Local Collection"}</span>
				</div>

				<div class="header-center">
					{#if theme.themeId}
						<CapsuleTabs options={sourceTabOptions} bind:activeId={previewSource} />
					{/if}
				</div>

				<div class="header-right"></div>
			</div>

			<!-- Content Container with border-radius and border -->
			<div class="preview-content-card">
				{#if isLoading}
					<div class="stage-loading">
						<div class="spinner"></div>
						<span>Loading {previewSource === "store" ? "Store Theme Page" : "Mockup Stage"}...</span>
					</div>
				{/if}
				<iframe
					bind:this={iframeEl}
					src={previewUrl}
					title="Theme Preview"
					class="preview-iframe"
					onload={handleIframeLoad}
				></iframe>
			</div>

			<!-- Floating Footer with shared Button components -->
			<div class="floating-footer-bar">
				<div class="footer-actions">
					<Button
						class="preview-footer-btn primary-live-btn"
						fontSize={12.5}
						iconSize={16}
						setting={{
							type: "button",
							name: "Apply as Live Preview",
							icon: "visibility",
							color: "var(--theme-0)",
							clickFunction: () => onApplyLivePreview(theme),
						}}
					/>

					<div title={applyTitle}>
						<Button
							class="preview-footer-btn apply-btn icon-only-btn"
							fontSize={0}
							iconSize={18}
							setting={{
								type: "button",
								name: "",
								icon: applyIcon,
								color: "var(--theme-0)",
								clickFunction: () => onApply(theme),
							}}
						/>
					</div>

					{#if isStoreItem && onSave}
						<div title="Save Theme">
							<Button
								class="preview-footer-btn save-btn icon-only-btn"
								fontSize={0}
								iconSize={18}
								setting={{
									type: "button",
									name: "",
									icon: "save",
									color: "var(--font-color)",
									clickFunction: () => onSave(theme),
								}}
							/>
						</div>
					{/if}

					{#if theme.themeId}
						<div title="Open Store Page">
							<Button
								class="preview-footer-btn store-btn icon-only-btn"
								fontSize={0}
								iconSize={18}
								setting={{
									type: "button",
									name: "",
									icon: "open_in_new",
									color: "var(--font-color-dim)",
									clickFunction: () => {
										const targetId = theme?.themeId;
										const storeUrl = targetId
											? `${NEWTUBE_STORE_THEMES_URL}/${encodeURIComponent(targetId)}`
											: NEWTUBE_STORE_THEMES_URL;
										window.open(storeUrl, "_blank");
									},
								}}
							/>
						</div>
					{/if}

					<div title="Close Preview (Esc)">
						<Button
							class="preview-footer-btn close-btn icon-only-btn"
							fontSize={0}
							iconSize={18}
							setting={{
								type: "button",
								name: "",
								icon: "close",
								color: "var(--theme-error)",
								clickFunction: () => onClose(),
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.top-level-preview-overlay {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		z-index: 999999;
		background: var(--bg-overlay-80, rgba(8, 8, 12, 0.85));
		backdrop-filter: blur(16px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		box-sizing: border-box;
	}

	.preview-modal-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 1420px;
		height: 92vh;
		max-height: 900px;
		box-sizing: border-box;
	}

	.preview-header-bar {
		margin-bottom: 12px;
		padding: 10px 20px;
		background: var(--bg-overlay-90, rgba(18, 18, 24, 0.92));
		backdrop-filter: blur(20px);
		border: 1px solid var(--fg-opacity-15, rgba(255, 255, 255, 0.15));
		border-radius: 18px;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 16px;
		box-shadow: 0 10px 30px var(--shadow-color, rgba(0, 0, 0, 0.5));

		.header-left {
			display: flex;
			align-items: center;
			gap: 12px;
			justify-content: flex-start;

			.theme-title {
				font-size: 16px;
				font-weight: 700;
				color: var(--font-color, #ffffff);
				margin: 0;
				max-width: 320px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.type-badge {
				font-size: 11px;
				font-weight: 600;
				padding: 3px 8px;
				border-radius: 6px;
				background: var(--fg-opacity-08, rgba(255, 255, 255, 0.08));
				color: var(--font-color-dim, rgba(255, 255, 255, 0.7));
				white-space: nowrap;
			}
		}

		.header-center {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.header-right {
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}
	}

	.preview-content-card {
		position: relative;
		flex: 1;
		width: 100%;
		height: 100%;
		background: var(--bg-main, #0f0f14);
		border: 1px solid var(--fg-opacity-15, rgba(255, 255, 255, 0.12));
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 20px 50px var(--shadow-color, rgba(0, 0, 0, 0.65));

		.preview-iframe {
			width: 100%;
			height: 100%;
			border: none;
			display: block;
		}

		.stage-loading {
			position: absolute;
			inset: 0;
			background: var(--bg-secondary, #0e0e12);
			z-index: 10;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 12px;
			color: var(--font-color-dim, #999);
			font-size: 13.5px;

			.spinner {
				width: 36px;
				height: 36px;
				border: 3px solid var(--fg-opacity-10, rgba(255, 255, 255, 0.1));
				border-top-color: var(--theme-0);
				border-radius: 50%;
				animation: spin 0.8s linear infinite;
			}
		}
	}

	.floating-footer-bar {
		margin-top: 14px;
		padding: 10px 20px;
		background: var(--bg-overlay-90, rgba(18, 18, 24, 0.92));
		backdrop-filter: blur(20px);
		border: 1px solid var(--fg-opacity-15, rgba(255, 255, 255, 0.15));
		border-radius: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		box-shadow: 0 10px 30px var(--shadow-color, rgba(0, 0, 0, 0.5));

		.footer-actions {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 10px;
		}
	}

	:global(.preview-footer-btn) {
		height: 38px;
		padding: 0 16px !important;
		border-radius: 11px !important;
		width: auto !important;
		font-size: 13px !important;
		font-weight: 700 !important;
		box-shadow: none;
		transition: all 0.2s ease !important;
		cursor: pointer;
		box-sizing: border-box;

		:global(.styleshift-main-description .setting-name) {
			font-weight: 700 !important;
		}
	}

	:global(.preview-footer-btn.icon-only-btn) {
		width: 38px !important;
		height: 38px !important;
		padding: 0 !important;
		display: flex !important;
		justify-content: center !important;
		align-items: center !important;
		border-radius: 11px !important;

		:global(.styleshift-button-icon) {
			margin-right: 0 !important;
		}

		:global(.styleshift-main-description) {
			display: none !important;
		}
	}

	:global(.preview-footer-btn.primary-live-btn) {
		background: transparent !important;
		border: 1px solid var(--theme-0, #00ffcc) !important;
		color: var(--theme-0, #00ffcc) !important;

		&:hover {
			background: var(--theme-0, #00ffcc) !important;
			color: #ffffff !important;
			transform: translateY(-1px);
			box-shadow: 0 4px 15px rgba(0, 255, 204, 0.3) !important;
		}
	}

	:global(.preview-footer-btn.apply-btn) {
		background: var(--theme-0, #00ffcc) !important;
		border: 1px solid var(--theme-0, #00ffcc) !important;
		color: #ffffff !important;

		&:hover {
			filter: brightness(1.15);
			transform: translateY(-1px);
		}
	}

	:global(.preview-footer-btn.save-btn) {
		background: var(--fg-opacity-08, rgba(255, 255, 255, 0.08)) !important;
		border: 1px solid var(--fg-opacity-15, rgba(255, 255, 255, 0.15)) !important;
		color: var(--font-color, #ffffff) !important;

		&:hover {
			background: var(--fg-opacity-15, rgba(255, 255, 255, 0.15)) !important;
			transform: translateY(-1px);
		}
	}

	:global(.preview-footer-btn.store-btn) {
		background: var(--fg-opacity-05, rgba(255, 255, 255, 0.06)) !important;
		border: 1px solid var(--fg-opacity-10, rgba(255, 255, 255, 0.12)) !important;
		color: var(--font-color-dim, rgba(255, 255, 255, 0.85)) !important;

		&:hover {
			background: var(--fg-opacity-12, rgba(255, 255, 255, 0.12)) !important;
			border-color: var(--fg-opacity-20, rgba(255, 255, 255, 0.25)) !important;
			color: var(--font-color, #ffffff) !important;
			transform: translateY(-1px);
		}
	}

	:global(.preview-footer-btn.close-btn) {
		background: var(--theme-error-10, rgba(255, 60, 60, 0.15)) !important;
		border: 1px solid var(--theme-error-30, rgba(255, 60, 60, 0.3)) !important;
		color: var(--theme-error, #ff6666) !important;

		&:hover {
			background: var(--theme-error-50, rgba(255, 60, 60, 0.4)) !important;
			color: #ffffff !important;
			transform: translateY(-1px);
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
