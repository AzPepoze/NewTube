<script lang="ts">
	import type { Setting } from "@styleshift/types/store";
	import { settings_ui } from "@ui/settings/setting-components";
	import { onMount } from "svelte";

	let { setting, parent }: { setting: Setting; parent: HTMLElement } = $props();

	onMount(async () => {
		if (setting.type === "checkbox") {
			await settings_ui["Config_Main_Section"](parent, setting, {
				Id: "id",
				name: ["name"],
				Description: "description",
			});
			await settings_ui["Config_Sub_Section"](parent, setting, {
				constant: 2,
				setup: 3,
				enable: 0,
				disable: 0,
			});
		} else if (setting.type === "button") {
			await settings_ui["Config_Main_Section"](parent, setting, {
				Id: "id",
				name: ["name"],
				Description: "description",
				icon: "icon",
				color: "color",
			});
			await settings_ui["Config_Sub_Section"](parent, setting, {
				click: 3,
			});
		} else if (setting.type === "number_slide") {
			await settings_ui["Config_Main_Section"](parent, setting, {
				Id: "id",
				name: ["name"],
				Description: "description",
				Min: "min",
				Max: "max",
				Step: "step",
			});
			await settings_ui["Config_Sub_Section"](parent, setting, {
				var: 2,
				constant: 2,
				setup: 3,
				update: 3,
			});
		} else if (setting.type === "color") {
			await settings_ui["Config_Main_Section"](parent, setting, {
				Id: "id",
				name: "name",
				Description: "description",
			});
			await settings_ui["Config_Sub_Section"](parent, setting, {
				var: 2,
				constant: 2,
				setup: 3,
				update: 3,
			});
		} else if (setting.type === "dropdown") {
			await settings_ui["Config_Main_Section"](parent, setting, {
				Id: "id",
				name: ["name"],
				Description: "description",
			});
			await settings_ui["Config_Sub_Section"](parent, setting, {
				constant: 2,
				setup: 3,
				enable: 0,
				disable: 0,
			});
		} else if (setting.type === "text_input") {
			await settings_ui["Config_Main_Section"](parent, setting, {
				Id: "id",
				name: ["name"],
				Description: "description",
			});
			await settings_ui["Config_Sub_Section"](parent, setting, {
				var: 2,
				constant: 2,
				setup: 3,
				update: 3,
			});
		} else if (setting.type === "image_input" || setting.type === "preview_image") {
			await settings_ui["Config_Main_Section"](parent, setting, {
				["Soruce setting Id"]: "id",
			});
		} else if (setting.type === "custom") {
			await settings_ui["Config_Main_Section"](parent, setting, {
				Id: "id",
			});
			await settings_ui["Config_Sub_Section"](parent, setting, {
				constant: 2,
				setup: 3,
				ui: ["function"],
			});
		} else if (setting.type === "combine_settings") {
			await settings_ui["Config_Main_Section"](parent, setting, {
				Id: "id",
				name: "name",
				Description: "description",
				["Sync IDs"]: ["sync_id"],
			});
			await settings_ui["Config_Sub_Section"](parent, setting, {
				update: 3,
			});
		}
	});
</script>

<div class="STYLESHIFT-Config-Editor-Renderer"></div>
