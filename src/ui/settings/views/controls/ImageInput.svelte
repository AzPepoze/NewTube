<script lang="ts">
	import { logger } from "@/shared/logger";
	import { getFromStorage } from "@core/storage/manager";
	import { triggerSettingUpdate } from "@settings/engine/functions";
	import type { Setting } from "@settings/types/styleshiftTypes";
	import { setAndSave } from "@ui/settings/settingsApi";
	import { showUserConfirmation } from "@ui/window/windowFactory";
	import PreviewImage from "../controls/PreviewImage.svelte";
	import Description from "../base/Description.svelte";
	import Icon from "../base/Icon.svelte";

	let {
		setting,
		placeholder = "https://example.com/image.png",
	}: {
		setting: Extract<Setting, { type: "imageInput" }>;
		placeholder?: string;
	} = $props();

	let value = $state("");

	async function init() {
		if (setting.id) {
			value = await getFromStorage(setting.id);
		} else {
			value = setting.value;
		}
	}
	init();

	const _name = $derived(setting.name);
	const _description = $derived(setting.description);
	const isBase64 = $derived(value?.startsWith("data:") ?? false);
	const inputValue = $derived(isBase64 ? "" : value);
	const inputPlaceholder = $derived(isBase64 ? "Stored Image (Base64 Data)" : placeholder);

	let fileInput = $state<HTMLInputElement | null>(null);
	let fileName = $state("");
	let isDragging = $state(false);

	function getFileNameFromUrl(urlStr: string) {
		if (!urlStr) return "";
		if (urlStr.startsWith("data:")) return "Stored Image (Base64)";
		try {
			// Try to parse as URL
			const urlStrSafe = urlStr.includes("://") ? urlStr : "http://" + urlStr;
			const url = new URL(urlStrSafe);
			const name = url.pathname.split("/").pop();
			return name && name.includes(".") ? name : "Remote Image";
		} catch {
			return "Remote Image";
		}
	}

	async function handleUpdate(newValue: string) {
		value = newValue;
		if (setting.id) {
			await setAndSave(setting, value);
			triggerSettingUpdate(setting.id);
		}
	}

	const getWarningMessage = (fileSize: number, maxSize: number) => {
		const fileSizeMB = (fileSize / 1024 / 1024).toFixed(1);
		const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);

		return (
			`Your file size : ${fileSize.toLocaleString()} bytes. (${fileSizeMB} MB)\n` +
			`Recommend file size : lower than ${maxSize.toLocaleString()} bytes. (${maxSizeMB} MB)\n\n` +
			`Your file is quite large. (It may cause lag!)\n\n` +
			`I recommend do one of these.\n` +
			`- compress file\n` +
			`- (image) resize it\n` +
			`- (image) Use image URL instead \n` +
			`- Use Upload api (Make this is the last choice)\n\n` +
			`Are you want to continue?`
		);
	};

	async function processFile(file: File) {
		const fileName = file.name;
		const fileSize = file.size;
		const fileType = file.type;
		const maxSize = setting.maxFileSize || 10000000;

		logger.info("UI", `File selected: ${fileName} (${fileSize.toLocaleString()} bytes, type: ${fileType})`);

		if (fileSize > maxSize) {
			logger.info("UI", `File size exceeds limit (${maxSize} bytes). Showing confirmation.`);

			const warningTitle = "WARNING!";
			const warningMessage = getWarningMessage(fileSize, maxSize);
			const confirmOptions = {
				confirmLabel: "Continue anyway",
				cancelLabel: "Cancel",
				confirmColor: "#7f5db7",
				align: "left" as const,
			};

			const confirmed = await showUserConfirmation(warningMessage, warningTitle, confirmOptions);

			if (confirmed) {
				logger.info("UI", "User confirmed large file upload.");
				uploadFile(file);
			} else {
				logger.info("UI", "User cancelled large file upload.");
			}
			return;
		}

		uploadFile(file);
	}

	function uploadFile(file: File) {
		fileName = file.name;
		const reader = new FileReader();
		reader.onload = async (e) => {
			const result = e.target?.result as string;
			await handleUpdate(result);
			logger.info("UI", `File uploaded successfully: ${file.name}`);
		};
		reader.readAsDataURL(file);
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			processFile(file);
			target.value = ""; // Clear to allow re-selection of same file
		}
	}

	async function handleUrlInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		await handleUpdate(val);
		fileName = getFileNameFromUrl(val);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer?.files?.[0];
		if (file && file.type.startsWith("image/")) {
			processFile(file);
		}
	}

	function openImage() {
		if (value) {
			window.open(value);
		}
	}

	async function removeImage() {
		const confirmed = await showUserConfirmation("Are you sure you want to remove this image?", "Remove Image", {
			confirmLabel: "Remove",
			cancelLabel: "Cancel",
			confirmColor: "#f44336",
		});

		if (confirmed) {
			await handleUpdate("");
			fileName = "";
			logger.info("UI", "Image removed by user");
		}
	}

	$effect(() => {
		if (value && !fileName) {
			fileName = getFileNameFromUrl(value);
		} else if (!value) {
			fileName = "";
		}
	});
</script>

<div class="styleshift-image-input-container">
	<div class="styleshift-image-input-header">
		<Description name={setting.name} description={setting.description} />
	</div>

	<div
		class="styleshift-image-source"
		class:dragging={isDragging}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		role="group"
	>
		<Icon name="link" size={18} className="styleshift-image-source-icon" />
		<input
			type="text"
			value={inputValue}
			placeholder={inputPlaceholder}
			oninput={handleUrlInput}
			class="styleshift-url-input"
			aria-label="Image URL"
		/>
		<input type="file" bind:this={fileInput} onchange={handleFileChange} accept="image/*" style="display: none;" />
		<button
			type="button"
			class="styleshift-upload-button"
			onclick={() => fileInput?.click()}
			title="Upload an image, or drag and drop one here"
		>
			<Icon name="upload" size={16} />
			<span>Upload</span>
		</button>
	</div>

	{#if value}
		<div class="styleshift-image-preview-card">
			<PreviewImage src={value} />
			<div class="styleshift-image-preview-bar">
				<span class="styleshift-image-preview-name" title={fileName}>{fileName || "Image"}</span>
				<div class="styleshift-image-preview-actions">
					<button type="button" class="styleshift-preview-action" title="View original image" onclick={openImage}>
						<Icon name="open_in_new" size={18} />
					</button>
					<button type="button" class="styleshift-preview-action danger" title="Remove image" onclick={removeImage}>
						<Icon name="delete" size={18} />
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.styleshift-image-input-header {
		display: flex;
		padding-left: 10px;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		margin-bottom: 10px;
	}

	.styleshift-image-source {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		height: 44px;
		padding: 0 5px 0 14px;
		box-sizing: border-box;
		border-radius: 14px;
		background: var(--bg-overlay-30);
		border: 1px solid var(--fg-opacity-10);
		transition:
			border-color 0.2s,
			background 0.2s,
			box-shadow 0.2s;

		&:focus-within,
		&.dragging {
			border-color: var(--theme-0);
			background: var(--bg-overlay-50);
		}

		&.dragging {
			box-shadow: 0 0 20px var(--theme-0-30);
		}

		:global(.styleshift-image-source-icon) {
			flex-shrink: 0;
			opacity: 0.5;
		}
	}

	.styleshift-url-input {
		flex: 1;
		min-width: 0;
		height: 100%;
		padding: 0;
		background: transparent;
		border: none;
		color: var(--font-color);
		font-size: 13px;
		outline: none;

		&::placeholder {
			color: var(--fg-opacity-30);
		}
	}

	.styleshift-upload-button {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-shrink: 0;
		height: 34px;
		padding: 0 14px;
		border-radius: 10px;
		border: 1px solid var(--theme-0);
		background: var(--theme-0-10);
		color: var(--font-color);
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			background: var(--theme-0);
			color: #ffffff;
		}
	}

	.styleshift-image-preview-card {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-top: 15px;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid var(--fg-opacity-10);
		background: var(--bg-overlay-40);
		box-shadow: 0 10px 30px var(--bg-overlay-30);

		/* The preview's own frame would double up inside the card. */
		:global(.styleshift-preview-image-container.preset-default) {
			min-width: 0;
			max-height: none;
			width: 100%;
			border: none;
			border-radius: 0;
			box-shadow: none;
			background: transparent;
		}
	}

	.styleshift-image-preview-bar {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 8px 8px 16px;
		border-top: 1px solid var(--fg-opacity-10);
		background: linear-gradient(to right, var(--theme-0-10), transparent);
	}

	.styleshift-image-preview-name {
		flex: 1;
		min-width: 0;
		font-size: 13px;
		font-weight: 600;
		color: var(--font-color);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.styleshift-image-preview-actions {
		display: flex;
		gap: 6px;
		flex-shrink: 0;
	}

	.styleshift-preview-action {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		padding: 0;
		border-radius: 50%;
		border: 1px solid var(--fg-opacity-10);
		background: var(--fg-opacity-05);
		color: var(--font-color);
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			border-color: var(--theme-0);
			background: var(--theme-0-10);
		}

		&.danger:hover {
			border-color: #f44336;
			background: rgba(244, 67, 54, 0.15);
			color: #f44336;
		}
	}
</style>
