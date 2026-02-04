<script lang="ts">
	import DevCard from "./DevCard.svelte";
	import { settings_ui } from "../../setting-components";

	let { setting, runType, extArray = ["function", "css"], onUpdateConfig } = $props();

	const runTypeNameMap = {
		var: "Variable",
		click: "On Click",
		constant: "Constant CSS",
		ui: "ui",
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

	let title = $derived(runTypeNameMap[runType as keyof typeof runTypeNameMap] || runType);
	let color = $derived(colorMap[runType as keyof typeof colorMap] || "#999999");

	function renderContent(node: HTMLElement) {
		const div = node as HTMLDivElement;
		(async () => {
			for (const ext of extArray) {
				let typeName = ext === "function" ? "JS" : ext === "css" ? "CSS" : ext;

				const subtitle = settings_ui["Sub_title"](typeName);
				div.appendChild(subtitle);

				const typeLangMap: Record<string, string> = { JS: "javascript", CSS: "css" };
				await settings_ui["code_editor"](
					div,
					setting,
					runType + "_" + ext,
					typeLangMap[typeName] || typeName,
					runType == "var" ? 100 : 400,
				);
			}
		})();
	}
</script>

<DevCard {title} {color}>
	{#snippet children()}
		<div use:renderContent class="STYLESHIFT-Dev-Card-Inner-Content"></div>
	{/snippet}
</DevCard>
