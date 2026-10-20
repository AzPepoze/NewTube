import { mkdirSync } from "fs";
import path from "path";

export const REPO = path.resolve(import.meta.dir, "../..");

/** Fixed localhost debug ports. Only these two are ever opened. */
export const PORTS = { chromium: 9222, firefox: 9223 } as const;

export type BrowserName = keyof typeof PORTS;

/** A new empty profile folder under out/, so each run starts from a clean state. */
export function freshProfileDir(browser: BrowserName): string {
	const dir = path.join(REPO, "out/browser-profiles", `${browser}-${Date.now()}`);
	mkdirSync(dir, { recursive: true });
	return dir;
}

export async function portOpen(port: number): Promise<boolean> {
	try {
		const response = await fetch(`http://127.0.0.1:${port}/json/version`, { signal: AbortSignal.timeout(500) });
		return response.ok || response.status === 404;
	} catch {
		return false;
	}
}
