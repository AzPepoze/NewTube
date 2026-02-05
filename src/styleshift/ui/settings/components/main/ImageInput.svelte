<script lang="ts">
	import type { Setting } from "@styleshift/types/store";
	import PreviewImage from "./PreviewImage.svelte";
	import Button from "./Button.svelte";
	import { getAssetUrl } from "@ui/utils";

	import Description from "./Description.svelte";

	let {
		setting,
		onFileSelect,
		onUrlUpdate,
		value = $bindable(""),
		placeholder = "https://example.com/image.png",
	}: {
		setting: Extract<Setting, { type: "image_input" }>;
		onFileSelect: (file: File) => void;
		onUrlUpdate: (val: string) => void;
		value: string;
		placeholder?: string;
	} = $props();

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

	function handleFileChange(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			fileName = file.name;
			onFileSelect(file);
			if (fileInput) fileInput.value = "";
		}
	}

	function handleUrlInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		onUrlUpdate(val);
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
			fileName = file.name;
			onFileSelect(file);
		}
	}

	function openImage() {
		if (value) {
			window.open(value);
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

<div class="STYLESHIFT-Image-Input-Container">
	<div class="STYLESHIFT-Image-Input-Header">
		<Description name={setting.name} description={setting.description} />
	</div>

	<div class="STYLESHIFT-Image-Input-Controls">
		<div
			class="STYLESHIFT-Upload-Zone"
			class:dragging={isDragging}
			onclick={() => fileInput?.click()}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === "Enter" && fileInput?.click()}
			title="Click or Drag & Drop image to upload"
		>
			<img class="STYLESHIFT-Upload-Icon" src={getAssetUrl("asset/upload.svg")} alt="Upload" />
			<span class="STYLESHIFT-Upload-Text">Upload</span>
		</div>

		<input
			type="file"
			bind:this={fileInput}
			onchange={handleFileChange}
			accept="image/*"
			style="display: none;"
		/>

		<div class="STYLESHIFT-Url-Input-Wrapper">
			<input type="text" {value} {placeholder} oninput={handleUrlInput} class="STYLESHIFT-Url-Input" />
		</div>
	</div>

	{#if value}
		<div class="STYLESHIFT-Image-Preview-Wrapper">
			<PreviewImage src={value} />
			{#if fileName}
				<span class="STYLESHIFT-File-Name" title={fileName}>{fileName}</span>
			{/if}
			<div class="STYLESHIFT-Button-Center-Wrapper">
				<Button
					name="View Original Image"
					onClick={openImage}
					font_size={12}
					style="padding: 5px 10px; width: auto; margin-top: 5px; height: 25px; border-radius: 15px;"
				/>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.STYLESHIFT-Button-Center-Wrapper {
		display: flex;
		justify-content: center;
		width: 100%;
	}
	.STYLESHIFT-Image-Input-Header {
		display: flex;
		padding-left: 10px;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		margin-bottom: 10px;
	}

	.STYLESHIFT-Label-Container {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.STYLESHIFT-Label {
		font-size: 15px;
		opacity: 0.9;
		font-weight: 600;
	}

	.STYLESHIFT-Description {
		font-size: 12px;
		opacity: 0.5;
	}

	.STYLESHIFT-File-Name {
		font-size: 11px;
		opacity: 0.6;
		background: var(--White-05);
		padding: 4px 12px;
		border-radius: 10px;
		max-width: 90%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 5px;
		border: 1px solid var(--White-10);
	}

	.STYLESHIFT-Image-Input-Controls {
		display: flex;
		gap: 15px;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
	}

	.STYLESHIFT-Upload-Zone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		width: 80px;
		height: 80px;
		background: var(--White-05);
		border: 1px dashed var(--White-20);
		border-radius: 15px;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		flex-shrink: 0;
		position: relative;
		overflow: hidden;

		&:hover,
		&.dragging {
			border-color: var(--Theme-0, #7f5db7);
			background: var(--Theme-0-10);
			transform: translateY(-2px);
		}

		&.dragging {
			transform: scale(1.05);
			box-shadow: 0 0 20px var(--Theme-0-30);
		}
	}

	.STYLESHIFT-Upload-Icon {
		width: 28px;
		height: 28px;
		opacity: 0.7;
		filter: drop-shadow(0 2px 4px var(--Black-20));
		transition: all 0.2s;

		.STYLESHIFT-Upload-Zone:hover & {
			opacity: 1;
			transform: translateY(-2px);
		}
	}

	.STYLESHIFT-Upload-Text {
		font-size: 11px;
		font-weight: 500;
		opacity: 0.6;
	}

	.STYLESHIFT-Url-Input-Wrapper {
		flex: 1;
		min-width: 0;
	}

	.STYLESHIFT-Url-Input {
		width: 100%;
		padding: 8px 15px;
		background: var(--Black-30);
		border: 1px grey solid;
		border-radius: 20px;
		color: white;
		font-size: 13px;
		outline: none;
		transition: all 0.2s;
		overflow: hidden;
		text-overflow: ellipsis;
		box-sizing: border-box;

		&:focus {
			border-color: var(--Theme-0, #7f5db7);
			background: var(--Black-50);
		}

		&::placeholder {
			color: var(--White-30);
		}
	}

	.STYLESHIFT-Image-Preview-Wrapper {
		margin-top: 15px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
</style>
