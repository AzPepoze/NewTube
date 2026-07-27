import { createUniqueId } from "@/core/shared/utilities";
import { getFromStorage } from "@core/storage/manager";
import { triggerSettingUpdate } from "@settings/engine/functions";
import type { Setting } from "@settings/types/styleshiftTypes";
import { setAndSave } from "@ui/settings/settingsApi";
import { SvelteSet } from "svelte/reactivity";

export type FontEntry = {
	id: string;
	fontName: string;
	importUrl: string;
	enabled: boolean;
	isDefault?: boolean;
};

export const DEFAULT_FONTS: FontEntry[] = [
	{
		id: "default-youtube",
		fontName: "Default (YouTube)",
		importUrl: "",
		enabled: false,
		isDefault: true,
	},
	{
		id: "default-system-ui",
		fontName: "System UI",
		importUrl: "",
		enabled: false,
		isDefault: true,
	},
	{
		id: "default-sans-serif",
		fontName: "Sans-Serif",
		importUrl: "",
		enabled: false,
		isDefault: true,
	},
	{
		id: "default-serif",
		fontName: "Serif",
		importUrl: "",
		enabled: false,
		isDefault: true,
	},
	{
		id: "default-monospace",
		fontName: "Monospace",
		importUrl: "",
		enabled: false,
		isDefault: true,
	},
];

export function extractFontNames(urlStr: string): string[] {
	try {
		const url = new URL(urlStr);
		const families = url.searchParams.getAll("family");
		if (families.length > 0) {
			return families.map((f) => f.split(":")[0].replace(/\+/g, " "));
		}
	} catch (_e) {}
	return [];
}

export function extractFontsFromText(text: string): FontEntry[] {
	const found: FontEntry[] = [];
	const importRegex = /@import\s+url\(['"]?([^'"]+)['"]?\)/g;
	let match: RegExpExecArray | null;

	while ((match = importRegex.exec(text)) !== null) {
		const urlStr = match[1];
		const names = extractFontNames(urlStr);
		for (const name of names) {
			found.push({
				id: createUniqueId(8),
				fontName: name,
				importUrl: urlStr,
				enabled: true,
			});
		}
	}

	if (found.length === 0 && text.trim().startsWith("http")) {
		const lines = text.trim().split(/\n+/);
		for (const line of lines) {
			const trimmed = line.trim();
			if (trimmed.startsWith("http")) {
				const names = extractFontNames(trimmed);
				for (const name of names) {
					found.push({
						id: createUniqueId(8),
						fontName: name,
						importUrl: trimmed,
						enabled: true,
					});
				}
			}
		}
	}
	return found;
}

export function detectPageFonts(currentFonts: FontEntry[]): FontEntry[] {
	if (typeof document === "undefined" || !document.fonts) return [];

	const newDetected: FontEntry[] = [];
	const existingNames = new SvelteSet(currentFonts.map((f) => f.fontName.toLowerCase()));

	document.fonts.forEach((fontFace) => {
		if (fontFace.family) {
			const cleanName = fontFace.family.replace(/["']/g, "").trim();
			if (cleanName && !existingNames.has(cleanName.toLowerCase())) {
				existingNames.add(cleanName.toLowerCase());
				newDetected.push({
					id: createUniqueId(8),
					fontName: cleanName,
					importUrl: "",
					enabled: false,
					isDefault: false,
				});
			}
		}
	});

	return newDetected;
}

export async function loadFonts(settingId: string): Promise<FontEntry[]> {
	const val = await getFromStorage(settingId);
	if (Array.isArray(val)) {
		const existingIds = new SvelteSet(val.map((f: FontEntry) => f.id));
		const missingDefaults = DEFAULT_FONTS.filter((d) => !existingIds.has(d.id));
		return [
			...val.map((f: FontEntry) => {
				const isDef = DEFAULT_FONTS.some((d) => d.id === f.id);
				return { ...f, isDefault: isDef || f.isDefault };
			}),
			...missingDefaults,
		];
	}
	return [...DEFAULT_FONTS];
}

export async function saveFonts(setting: Setting, fonts: FontEntry[]): Promise<void> {
	const plainFonts = JSON.parse(JSON.stringify(fonts));
	await setAndSave(setting, plainFonts);
	triggerSettingUpdate(setting.id);
}

export function moveFont(fonts: FontEntry[], index: number, direction: "up" | "down"): FontEntry[] {
	const targetIndex = direction === "up" ? index - 1 : index + 1;
	if (targetIndex < 0 || targetIndex >= fonts.length) return fonts;
	const copy = [...fonts];
	[copy[index], copy[targetIndex]] = [copy[targetIndex], copy[index]];
	return copy;
}
