<script lang="ts">
	import DevCard from "./DevCard.svelte";
	import { settings_ui } from "../../setting-components";
	import { fly, fade } from "svelte/transition";
	import { untrack } from "svelte";
	import CapsuleTabs from "../../../components/general/CapsuleTabs.svelte";
	import { execute_script_string } from "@/styleshift/core/runtime-controller";
	import Icon from "../main/Icon.svelte";

	let {
		setting,
		runType,
		extArray = ["function", "css"],
		onUpdateConfig,
		isWorkspace = false,
	} = $props();

	const runTypeNameMap = {
		var: "Variable",
		click: "On Click",
		constant: "Constant CSS",
		ui: "UI Script",
		setup: "Startup Script",
		enable: "On Enable",
		disable: "On Disable",
		update: "On Change",
	};

	const colorMap = {
		var: "#FFA500",
		click: "#00DFFF",
		constant: "#09ff00",
		ui: "#3232FF",
		setup: "#3232FF",
		enable: "#32CD32",
		disable: "#FF3232",
		update: "#FF00F5",
	};

	let activeExt = $state(untrack(() => extArray[0]));
	const extOptions = $derived(extArray.map(ext => ({
		id: ext,
		label: ext === "function" ? "JS" : ext === "css" ? "CSS" : ext
	})));
	
	$effect(() => {
		if (!extArray.includes(activeExt)) {
			activeExt = extArray[0];
		}
	});
	
	let title = $derived(runTypeNameMap[runType as keyof typeof runTypeNameMap] || runType);
	let color = $derived(colorMap[runType as keyof typeof colorMap] || "#999999");

	function handleRunScript() {
		const property = `${runType}_${activeExt}`;
		const script = setting[property];
		if (script) {
			execute_script_string({
				script_content: script,
				should_sanitize: true,
				source_identifier: `Manual Run: ${property}`,
			});
		}
	}

	function renderEditor(node: HTMLElement, ext: string) {
		const div = node as HTMLDivElement;
		let typeName = ext === "function" ? "JS" : ext === "css" ? "CSS" : ext;
		const typeLangMap: Record<string, string> = { JS: "javascript", CSS: "css" };

		(async () => {
			div.innerHTML = "";
			const editor = await settings_ui["code_editor"](
				div,
				setting,
				runType + "_" + ext,
				typeLangMap[typeName] || typeLangMap[ext] || typeName,
				isWorkspace ? 550 : runType == "var" ? 100 : 400,
			);
			if (onUpdateConfig) {
				editor.additinal_onchange(onUpdateConfig);
			}
		})();
	}

	function renderLegacyContent(node: HTMLElement) {
		const div = node as HTMLDivElement;
		(async () => {
			for (const ext of extArray) {
				let typeName = ext === "function" ? "JS" : ext === "css" ? "CSS" : ext;
				const item = document.createElement("div");
				item.style.marginBottom = "20px";
				div.appendChild(item);
				
				const typeLangMap: Record<string, string> = { JS: "javascript", CSS: "css" };
				const editor = await settings_ui["code_editor"](
					item,
					setting,
					runType + "_" + ext,
					typeLangMap[typeName] || typeLangMap[ext] || typeName,
					runType == "var" ? 100 : 400,
				);
				if (onUpdateConfig) {
					editor.additinal_onchange(onUpdateConfig);
				}
			}
		})();
	}
</script>

{#if isWorkspace}
	<div class="STYLESHIFT-Dev-Modern-Section" style:--section-color={color}>
		<header class="section-header">
			<div class="section-title-group">
				<span class="section-title">{title}</span>
				<div class="section-status-dot"></div>
				{#if activeExt === "function"}
					<button class="run-script-btn" onclick={handleRunScript} title="Run Script">
						<Icon name="code" size={14} />
						Run
					</button>
				{/if}
			</div>
			
			{#if extArray.length > 1}
				<CapsuleTabs options={extOptions} bind:activeId={activeExt} />
			{:else}
				<span class="section-lang-hint">
					{activeExt === "function" ? "JavaScript" : activeExt === "css" ? "CSS" : activeExt}
				</span>
			{/if}
		</header>
		
		<div class="section-editor-area">
			{#each extArray as ext}
				{#if activeExt === ext}
					<div 
						class="editor-mount" 
						use:renderEditor={ext}
						in:fly={{ y: 5, duration: 200, delay: 100 }}
						out:fade={{ duration: 100 }}
					></div>
				{/if}
			{/each}
		</div>
	</div>
{:else}
	<DevCard {title} {color}>
		{#snippet children()}
			<div use:renderLegacyContent></div>
		{/snippet}
	</DevCard>
{/if}

<style lang="scss">
	.STYLESHIFT-Dev-Modern-Section {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		padding-inline: 5px;
	}

	.section-title-group {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.section-title {
		font-size: 18px;
		font-weight: 700;
		color: var(--Font-Color);
		letter-spacing: -0.5px;
	}

	.run-script-btn {
		margin-left: 10px;
		background: var(--Theme-0-20);
		border: 1px solid var(--Theme-0);
		color: var(--Theme-1);
		padding: 4px 12px;
		border-radius: 6px;
		font-size: 12px;
		font-weight: 700;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 6px;
		transition: all 0.2s;

		&:hover {
			background: var(--Theme-0);
			color: white;
			box-shadow: 0 0 10px var(--Theme-0);
		}

		&:active {
			transform: scale(0.95);
		}
	}

	.section-status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--section-color);
		box-shadow: 0 0 10px var(--section-color);
	}

	.section-lang-hint {
		font-size: 11px;
		font-weight: 700;
		color: var(--Font-Color-Dim);
		text-transform: uppercase;
		letter-spacing: 1px;
		background: var(--BG-Surface);
		padding: 4px 10px;
		border-radius: 6px;
	}

	.section-editor-area {
		width: 100%;
	}

	.editor-mount {
		width: 100%;
		
		:global(.STYLESHIFT-Code-Editor-Container) {
			border: 1px solid var(--Border-Color) !important;
			background: var(--BG-Input) !important;
			border-radius: 16px !important;
			margin-top: 0 !important;
			box-shadow: 0 4px 20px var(--Shadow-Color);

			&:focus-within {
				border-color: var(--section-color) !important;
				background: var(--BG-Input) !important;
				box-shadow: 0 8px 40px var(--Shadow-Color);
			}
		}
	}
</style>
