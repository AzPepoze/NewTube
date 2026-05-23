import { SvelteSet } from "svelte/reactivity";
import { enterPrompt } from "@core/shared/dialogs";
import { createNotification } from "@core/shared/notifications";
import { getRootValue, persistCachedDataToStorage } from "@core/storage/manager";
import { exportThemeWithSelection } from "@core/theme/exporter";
import { exportCurrentSettingsObject, importPresetToSettings, importThemeWorkflow } from "@core/theme/importer";
import {
	applyTheme as applyThemeManager,
	deleteTheme as deleteThemeManager,
	saveTheme as saveThemeManager,
	type Theme,
} from "@core/theme/manager";
import { STYLESHIFT_STORE_API_URL } from "@core/theme/config";

export class ThemeManagerController {
	themes = $state<Theme[]>([]);
	storeThemes = $state<Theme[]>([]);
	activeThemeId = $state<string | null>(null);
	loadingThemeId = $state<string | null>(null);
	isLoadingStore = $state(false);
	wasThemeModified = $state(false);

	private backupSettings: any = null;
	private originalActiveTheme: string | null = null;
	private closeWindow?: () => void;

	constructor(options: { closeWindow?: () => void }) {
		this.closeWindow = options.closeWindow;
	}

	installedThemeIds = $derived(new SvelteSet(this.themes.map((t) => t.themeId)));

	async loadThemes() {
		this.themes = (await getRootValue("themes")) || [];
		this.backupSettings = JSON.parse(JSON.stringify(await getRootValue("currentSettings")));
		this.originalActiveTheme = await getRootValue("activeTheme");
		await this.refreshActiveTheme();
	}

	async refreshActiveTheme() {
		this.activeThemeId = await getRootValue("activeTheme");
	}

	async fetchStoreThemes(query = "") {
		this.isLoadingStore = true;
		try {
			const res = await fetch(`${STYLESHIFT_STORE_API_URL}/themes?q=${encodeURIComponent(query)}&sort=popular`);
			if (res.ok) {
				const data = await res.json();
				this.storeThemes = data.map((t: any) => {
					const s = t.settings;
					let currentSettings: Record<string, unknown> | undefined;
					let addOnStyleShiftItems: Theme["addOnStyleShiftItems"];
					if (s && typeof s === "object" && !Array.isArray(s)) {
						if (
							"currentSettings" in s &&
							s.currentSettings &&
							typeof s.currentSettings === "object" &&
							!Array.isArray(s.currentSettings)
						) {
							currentSettings = s.currentSettings as Record<string, unknown>;
							addOnStyleShiftItems = Array.isArray(s.addOnStyleShiftItems) ? s.addOnStyleShiftItems : undefined;
						} else {
							currentSettings = s as Record<string, unknown>;
						}
					}
					return {
						themeId: t.themeId,
						themeName: t.themeName,
						currentSettings,
						addOnStyleShiftItems,
					};
				});
			}
		} catch (e) {
			console.error("Store fetch failed", e);
		} finally {
			this.isLoadingStore = false;
		}
	}

	async saveCurrentAsTheme() {
		const name = await enterPrompt({ title: "Save Current Theme", placeholder: "Enter theme name..." });
		if (!name?.trim()) return;

		const currentSettings = await exportCurrentSettingsObject();
		if (await saveThemeManager(name, { currentSettings } as Theme, "EXTENSION")) {
			await this.loadThemes();
			this.wasThemeModified = true;
		}
	}

	async applyTheme(id: string, currentView: "installed" | "store") {
		const source = currentView === "installed" ? this.themes : this.storeThemes;
		const theme = source.find((t) => t.themeId === id);
		if (!theme) return;

		const displayName = theme.themeName || id;
		this.loadingThemeId = id;

		if (currentView === "store") {
			const saved = await saveThemeManager(displayName, $state.snapshot(theme), "EXTENSION", id);
			if (!saved) {
				this.loadingThemeId = null;
				return false;
			}
			await this.loadThemes();
			createNotification({
				icon: "download_done",
				title: "Theme Installed",
				content: `"${displayName}" added to collection.`,
			});
		}

		if (await applyThemeManager(id, displayName, "EXTENSION")) {
			this.activeThemeId = id;
			this.wasThemeModified = true;
		}
		this.loadingThemeId = null;
		return true;
	}

	async saveStoreTheme(id: string) {
		const theme = this.storeThemes.find((t) => t.themeId === id);
		if (!theme) return;

		this.loadingThemeId = id;
		if (await saveThemeManager(theme.themeName || id, $state.snapshot(theme), "EXTENSION", id)) {
			await this.loadThemes();
			createNotification({ icon: "save", title: "Theme Saved", content: `"${theme.themeName}" added to collection.` });
		}
		this.loadingThemeId = null;
	}

	async deleteTheme(id: string) {
		const theme = this.themes.find((t) => t.themeId === id);
		if (!theme) return;

		if (await deleteThemeManager(id, theme.themeName || id, "EXTENSION")) {
			this.themes = this.themes.filter((t) => t.themeId !== id);
			createNotification({ icon: "delete", title: "Theme Deleted", content: `"${theme.themeName}" removed.` });
		}
	}

	async exportTheme(id: string) {
		const theme = this.themes.find((t) => t.themeId === id);
		if (theme) {
			await exportThemeWithSelection(id, theme.themeName, $state.snapshot(theme));
		}
	}

	async openStore() {
		const { openThemeStore } = await import("@core/theme/storeIntegration");
		openThemeStore();
	}

	async importTheme() {
		await importThemeWorkflow();
		await this.loadThemes();
	}

	async handleOk() {
		await persistCachedDataToStorage();
		this.closeWindow?.();
	}

	async handleCancel() {
		if (this.wasThemeModified && this.backupSettings) {
			await importPresetToSettings(
				$state.snapshot(this.backupSettings),
				false,
				this.originalActiveTheme || "Previous Settings",
			);
		}
		this.closeWindow?.();
	}

	getThemePreview(theme: Theme) {
		const settings = theme.currentSettings || {};
		let bgColor = settings["MainThemeColor"] || settings["MainThemeColorC"] || "var(--theme-0)";
		if (bgColor.startsWith("#") && bgColor.length > 7) bgColor = bgColor.slice(0, 7);
		return { bgColor, bgImg: settings["BackgroundImageUrl"] || "", themeId: theme.themeId };
	}
}
