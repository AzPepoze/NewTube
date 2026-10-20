export type SearchableSetting = {
	id?: string;
	name?: string;
	description?: string;
};

const NAME_WORD_START_SCORE = 4;
const NAME_SCORE = 3;
const ID_SCORE = 2;
const LABEL_SCORE = 1;
const DESCRIPTION_SCORE = 1;

function normalizeText(text: string): string {
	return text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
}

/** Lowercase text without separators, so "Auto-Hide" and "autohide" compare equal. */
function compactText(text: string): string {
	return normalizeText(text).replace(/[^\p{L}\p{N}]/gu, "");
}

function splitWords(text: string): string[] {
	return normalizeText(text)
		.split(/[^\p{L}\p{N}]+/u)
		.filter(Boolean);
}

function nameScore(token: string, name: string): number {
	if (!compactText(name).includes(token)) return 0;
	return splitWords(name).some((word) => word.startsWith(token)) ? NAME_WORD_START_SCORE : NAME_SCORE;
}

function fieldScore(token: string, text: string | undefined, score: number): number {
	return text && compactText(text).includes(token) ? score : 0;
}

function tokenScore(token: string, setting: SearchableSetting, label: string): number {
	return Math.max(
		nameScore(token, setting.name ?? ""),
		fieldScore(token, setting.id, ID_SCORE),
		fieldScore(token, label, LABEL_SCORE),
		fieldScore(token, setting.description, DESCRIPTION_SCORE),
	);
}

/**
 * Scores a setting against every query word. A setting matches only when each word
 * is found somewhere in its name, id, category label or description.
 * @returns The total score, or 0 when the setting does not match.
 */
function scoreSetting(tokens: string[], setting: SearchableSetting, label: string): number {
	let total = 0;
	for (const token of tokens) {
		const score = tokenScore(token, setting, label);
		if (score === 0) return 0;
		total += score;
	}
	return total;
}

/**
 * Filters settings by a fuzzy query, best matches first.
 * Word order does not matter, and "autohide" finds "Auto-Hide Bar".
 * @param query The text typed in the search box.
 * @param settings The settings of one category.
 * @param label The category name, also searched.
 */
export function searchSettings<T extends SearchableSetting>(query: string, settings: T[], label: string): T[] {
	const tokens = splitWords(query).map(compactText);
	if (tokens.length === 0) return settings;

	return settings
		.map((setting) => ({ setting, score: scoreSetting(tokens, setting, label) }))
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score)
		.map(({ setting }) => setting);
}
