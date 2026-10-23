import { logger } from "@shared/logger";

/** Command names from `src/entrypoints/manifest.json`. */
export const SHORTCUT_COMMANDS = ["toggle_enable", "toggle_settings", "toggle_customize", "toggle_dev_mode"] as const;

export type ShortcutCommand = (typeof SHORTCUT_COMMANDS)[number];
export type ShortcutMap = Record<ShortcutCommand, string | undefined>;

export async function loadShortcuts(): Promise<ShortcutMap> {
	const shortcuts: ShortcutMap = {
		toggle_enable: undefined,
		toggle_settings: undefined,
		toggle_customize: undefined,
		toggle_dev_mode: undefined,
	};
	try {
		const response = await chrome.runtime.sendMessage({ Command: "getCommands" });
		if (!Array.isArray(response)) return shortcuts;
		for (const command of response) {
			if (isShortcutCommand(command.name) && command.shortcut) {
				shortcuts[command.name] = command.shortcut;
			}
		}
	} catch (error) {
		logger.warn("tutorial", "Failed to load shortcuts", error);
	}
	return shortcuts;
}

function isShortcutCommand(name: string): name is ShortcutCommand {
	return (SHORTCUT_COMMANDS as readonly string[]).includes(name);
}

export function shortcutKeys(shortcuts: ShortcutMap, command: ShortcutCommand): string[] {
	const shortcut = shortcuts[command];
	return shortcut ? shortcut.split("+") : [];
}
