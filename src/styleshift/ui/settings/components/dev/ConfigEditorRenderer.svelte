<script lang="ts">
	import type { Setting } from "@styleshift/types/store";
	import { fly, fade } from "svelte/transition";
	import CapsuleTabs from "../../../components/general/CapsuleTabs.svelte";
	import { refreshExtensionState } from "@/styleshift/run";
	import ConfigMainSection from "./ConfigMainSection.svelte";
	import ConfigSubSection from "./ConfigSubSection.svelte";

	let { setting }: { setting: Setting } = $props();

	let activeTab = $state("general");

	const tabs = [
		{ id: "general", label: "General", icon: "settings" },
		{ id: "logic", label: "Logic & Code", icon: "code" },
	];

	const mainProps = $derived.by(() => {
		const props: any = {
			Id: "id",
			Name: "name",
			Description: "description",
		};

		const type = setting.type;

		switch (type) {
			case "text":
				Object.assign(props, {
					HTML: "html",
					"Font Size": "fontSize",
					Align: ["align", ["left", "center", "right"]],
				});
				break;
			case "subText":
				Object.assign(props, {
					Text: "text",
					Color: "color",
					"Font Size": "fontSize",
					Align: ["align", ["left", "center", "right"]],
				});
				break;
			case "button":
				Object.assign(props, {
					Icon: "icon",
					Color: "color",
					"Font Size": "fontSize",
					Align: ["align", ["left", "center", "right"]],
				});
				break;
			case "checkbox":
				Object.assign(props, {
					Default: "value",
				});
				break;
			case "numberSlide":
				Object.assign(props, {
					Default: "value",
					Min: "min",
					Max: "max",
					Step: "step",
					Unit: "unit",
				});
				break;
			case "dropdown":
				Object.assign(props, {
					Default: "value",
					Options: [
						"options",
						(val: string) => {
							try {
								setting.options = JSON.parse(val);
							} catch (_e) {
								console.error("Invalid JSON for options");
							}
						},
					],
				});
				break;
			case "color":
				Object.assign(props, {
					Default: "value",
					"Show Alpha": "showAlphaSlider",
				});
				break;
			case "textInput":
				Object.assign(props, {
					Default: "value",
				});
				break;
			case "imageInput":
				Object.assign(props, {
					Default: "value",
					"Max File Size (Bytes)": "maxFileSize",
				});
				break;
			case "previewImage":
			case "custom":
				delete props.Name;
				delete props.Description;
				break;
			case "combineSettings":
				props["Sync IDs"] = [
					"syncId",
					(val: string) => {
						try {
							setting.syncId = JSON.parse(val);
						} catch (_e) {
							setting.syncId = val.split(",").map((s) => s.trim());
						}
					},
				];
				break;
		}
		return props;
	});

	const subProps = $derived.by(() => {
		const props: any = {
			updateConfig: refreshExtensionState,
		};

		const type = setting.type;

		switch (type) {
			case "checkbox":
			case "dropdown":
				Object.assign(props, { constant: 2, setup: 3, update: 3, enable: 0, disable: 0 });
				break;
			case "button":
				Object.assign(props, { click: 3 });
				break;
			case "numberSlide":
			case "color":
			case "textInput":
				Object.assign(props, { var: 2, constant: 2, setup: 3, update: 3 });
				break;
			case "custom":
				Object.assign(props, { constant: 2, setup: 3, ui: ["function"] });
				break;
			case "combineSettings":
				Object.assign(props, { update: 3 });
				break;
		}
		return props;
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
				<ConfigMainSection {setting} props={mainProps} updateUi={refreshExtensionState} />
			</div>
		{:else if activeTab === "logic"}
			<div
				class="STYLESHIFT-Config-Tab-Content logic-tab"
				in:fly={{ y: 10, duration: 300, delay: 150 }}
				out:fade={{ duration: 150 }}
			>
				<div class="logic-container-wrapper">
					<ConfigSubSection {setting} props={subProps} />
				</div>
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
		border-radius: 10px;
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
