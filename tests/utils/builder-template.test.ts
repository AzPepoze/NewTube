// @ts-nocheck -- Bun's test globals are not part of the extension TypeScript program.
import { expect, test } from "bun:test";
import * as path from "path";
import { extractMetadata } from "../../utils/builder-template";

const FIXTURE = path.join(import.meta.dir, "fixtures/sampleFunctions.ts");
const entries = extractMetadata([FIXTURE]);
const byLabel = (label) => entries.find((entry) => entry.label === label);

test("only exported functions are extracted", () => {
	expect(entries.map((entry) => entry.label)).toEqual(["add", "wait", "notify", "onDone", "callsHidden"]);
});

test("detail uses the written types and return type", () => {
	expect(byLabel("add").detail).toBe("(a: number, b: number) => number");
	expect(byLabel("onDone").detail).toBe("(callback: (value: string) => void) => void");
});

test("optional parameters with defaults are marked optional and get inferred types", () => {
	expect(byLabel("wait").detail).toBe("(ms?: number) => Promise<void>");
});

test("destructured parameters are named options with the written type", () => {
	expect(byLabel("notify").detail).toBe("(options: { title?: string; content?: string }) => void");
});

test("info keeps the JSDoc text without comment markers", () => {
	const info = byLabel("add").info;
	expect(info.startsWith("Adds two numbers.")).toBe(true);
	expect(info).toContain("@example\nadd(1, 2); // 3");
	expect(info).not.toContain("*");
});

test("functions without JSDoc get empty info", () => {
	expect(byLabel("notify").info).toBe("");
});

test("file names are recorded per entry", () => {
	expect(byLabel("add").file).toBe("sampleFunctions.ts");
});
