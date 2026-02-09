<script lang="ts">
	import type { Setting } from "@styleshift/types/store";
	import { settings_ui } from "@ui/settings/setting-components";
	import { fly, fade } from "svelte/transition";
	import CapsuleTabs from "../../../components/general/CapsuleTabs.svelte";
	import { refresh_extension_state } from "@/styleshift/run";

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
			Name: "name",
			Description: "description",
		};

		const type = setting.type;

		switch (type) {
			case "text":
				Object.assign(mainProps, {
					HTML: "html",
					"Font Size": "font_size",
					Align: ["align", ["left", "center", "right"]],
				});
				break;
			case "sub_text":
				Object.assign(mainProps, {
					Text: "text",
					Color: "color",
					"Font Size": "font_size",
					Align: ["align", ["left", "center", "right"]],
				});
				break;
			case "button":
				Object.assign(mainProps, {
					Icon: "icon",
					Color: "color",
					"Font Size": "font_size",
					Align: ["align", ["left", "center", "right"]],
				});
				break;
			case "checkbox":
				Object.assign(mainProps, {
					Default: "value",
				});
				break;
			case "number_slide":
				Object.assign(mainProps, {
					Default: "value",
					Min: "min",
					Max: "max",
					Step: "step",
					Unit: "unit",
				});
				break;
			case "dropdown":
				Object.assign(mainProps, {
					Default: "value",
					Options: [
						"options",
						(val) => {
							try {
								setting.options = JSON.parse(val);
							} catch (e) {
								console.error("Invalid JSON for options", e);
							}
						},
					],
				});
				break;
			case "color":
				Object.assign(mainProps, {
					Default: "value",
					"Show Alpha": "show_alpha_slider",
				});
				break;
			case "text_input":
				Object.assign(mainProps, {
					Default: "value",
				});
				break;
			case "image_input":
				Object.assign(mainProps, {
					Default: "value",
					"Max MB": "max_file_size",
				});
				break;
			case "preview_image":
			case "custom":
				delete mainProps.Name;
				delete mainProps.Description;
				break;
			case "combine_settings":
				mainProps["Sync IDs"] = [
					"sync_id",
					(val) => {
						try {
							setting.sync_id = JSON.parse(val);
						} catch (e) {
							setting.sync_id = val.split(",").map((s) => s.trim());
						}
					},
				];
				break;
		}

		await settings_ui["Config_Main_Section"](mainSectionContainer, setting, mainProps, refresh_extension_state);
	}

	async function mountSub() {
		if (!subSectionContainer) return;
		subSectionContainer.innerHTML = "";
		const subProps: any = {
			update_config: refresh_extension_state,
		};

		const type = setting.type;

		switch (type) {
			case "checkbox":
			case "dropdown":
				Object.assign(subProps, { constant: 2, setup: 3, update: 3, enable: 0, disable: 0 });
				break;
			case "button":
				Object.assign(subProps, { click: 3 });
				break;
			case "number_slide":
			case "color":
			case "text_input":
				Object.assign(subProps, { var: 2, constant: 2, setup: 3, update: 3 });
				break;
			case "custom":
				Object.assign(subProps, { constant: 2, setup: 3, ui: ["function"] });
				break;
			case "combine_settings":
				Object.assign(subProps, { update: 3 });
				break;
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
		font-size: 15px;
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
