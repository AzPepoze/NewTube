<script lang="ts">
	import type { Setting } from "@styleshift/types/store";
	import { settings_ui } from "@ui/settings/setting-components";
	import { fly, fade } from "svelte/transition";
	import Icon from "../main/Icon.svelte";
	import CapsuleTabs from "../../../components/general/CapsuleTabs.svelte";

	let { setting }: { setting: Setting } = $props();

	let activeTab = $state("general");
	let mainSectionContainer = $state<HTMLElement | null>(null);
	let subSectionContainer = $state<HTMLElement | null>(null);

	const tabs = [
		{ id: "general", label: "General", icon: "settings" },
		{ id: "logic", label: "Logic & Code", icon: "code" },
	];

	async function mountMain() {
		if (!mainSectionContainer) return;
		mainSectionContainer.innerHTML = "";
		const mainProps: any = {
			Id: "id",
			name: ["name"],
			Description: "description",
		};

		if (setting.type === "button") {
			Object.assign(mainProps, { icon: "icon", color: "color" });
		} else if (setting.type === "number_slide") {
			Object.assign(mainProps, { Min: "min", Max: "max", Step: "step" });
		} else if (setting.type === "image_input" || setting.type === "preview_image") {
			delete mainProps.name;
			delete mainProps.Description;
			mainProps["Soruce setting Id"] = "id";
		} else if (setting.type === "custom") {
			delete mainProps.name;
			delete mainProps.Description;
		} else if (setting.type === "combine_settings") {
			mainProps["Sync IDs"] = ["sync_id"];
		}

		await settings_ui["Config_Main_Section"](mainSectionContainer, setting, mainProps);
	}

	async function mountSub() {
		if (!subSectionContainer) return;
		subSectionContainer.innerHTML = "";
		const subProps: any = {};

		if (setting.type === "checkbox") {
			Object.assign(subProps, { constant: 2, setup: 3, enable: 0, disable: 0 });
		} else if (setting.type === "button") {
			Object.assign(subProps, { click: 3 });
		} else if (setting.type === "number_slide") {
			Object.assign(subProps, { var: 2, constant: 2, setup: 3, update: 3 });
		} else if (setting.type === "color") {
			Object.assign(subProps, { var: 2, constant: 2, setup: 3, update: 3 });
		} else if (setting.type === "dropdown") {
			Object.assign(subProps, { constant: 2, setup: 3, enable: 0, disable: 0 });
		} else if (setting.type === "text_input") {
			Object.assign(subProps, { var: 2, constant: 2, setup: 3, update: 3 });
		} else if (setting.type === "custom") {
			Object.assign(subProps, { constant: 2, setup: 3, ui: ["function"] });
		} else if (setting.type === "combine_settings") {
			Object.assign(subProps, { update: 3 });
		}

		await settings_ui["Config_Sub_Section"](subSectionContainer, setting, subProps);
	}

	$effect(() => {
		if (activeTab === "general" && mainSectionContainer) {
			mountMain();
		}
	});

	$effect(() => {
		if (activeTab === "logic" && subSectionContainer) {
			mountSub();
		}
	});
</script>

<div class="STYLESHIFT-Config-Editor-Layout">
	<header class="STYLESHIFT-Config-Header">
		<div class="STYLESHIFT-Config-Setting-Info">
			<div class="STYLESHIFT-Config-Type-Badge">{setting.type.replace("_", " ")}</div>
			<h2 class="STYLESHIFT-Config-Title">
				{(setting as any).name || "New Setting"} <span class="setting-id">- {setting.id}</span>
			</h2>
		</div>

		<nav class="STYLESHIFT-Config-Tabs">
			<CapsuleTabs options={tabs} bind:activeId={activeTab} />
		</nav>
	</header>

	<main class="STYLESHIFT-Config-Main-Content">
		{#if activeTab === "general"}
			<div
				class="STYLESHIFT-Config-Tab-Content"
				in:fly={{ y: 10, duration: 300, delay: 150 }}
				out:fade={{ duration: 150 }}
			>
				<div bind:this={mainSectionContainer}></div>
			</div>
		{:else if activeTab === "logic"}
			<div
				class="STYLESHIFT-Config-Tab-Content logic-tab"
				in:fly={{ y: 10, duration: 300, delay: 150 }}
				out:fade={{ duration: 150 }}
			>
				<div bind:this={subSectionContainer} class="logic-container-wrapper"></div>
			</div>
		{/if}
	</main>
</div>

<style lang="scss">
	.STYLESHIFT-Config-Editor-Layout {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow: hidden;
		color: var(--Font-Color);
	}

	.STYLESHIFT-Config-Header {
		padding: 20px 25px;
		background: var(--BG-Surface);
		border-bottom: 1px solid var(--Border-Color);
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.STYLESHIFT-Config-Setting-Info {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.STYLESHIFT-Config-Type-Badge {
		font-size: 9px;
		text-transform: uppercase;
		background: var(--Theme-0);
		color: white;
		padding: 2px 8px;
		border-radius: 10px;
		width: fit-content;
		font-weight: 800;
		letter-spacing: 0.5px;
	}

	.STYLESHIFT-Config-Title {
		margin: 0;
		font-size: 20px;
		font-weight: 700;
		color: var(--Font-Color);
		display: flex;
		align-items: center;
		gap: 10px;

		.setting-id {
			font-size: 14px;
			font-weight: 400;
			color: var(--Font-Color-Dim);
		}
	}

	.STYLESHIFT-Config-Tabs {
		display: flex;
		flex-direction: row;
		align-items: center; // Center in Y
		gap: 10px;
	}

	.STYLESHIFT-Config-Main-Content {
		flex: 1;
		height: 100%;
		overflow: hidden;
	}

	.STYLESHIFT-Config-Tab-Content {
		height: 100%;
		padding: 30px;
		box-sizing: border-box;
		overflow-y: auto;
		background: transparent !important;

		&.logic-tab {
			padding: 0;
		}
	}

	.logic-container-wrapper {
		height: 100%;
	}

	.STYLESHIFT-Config-Main-Content {
		&::-webkit-scrollbar {
			width: 6px;
		}
		&::-webkit-scrollbar-thumb {
			background: var(--Border-Color);
			border-radius: 10px;
		}
	}
</style>
