import { getFromStorage } from "@core/storage/manager";

/**
 * Checks if a specific condition is met.
 * @param {any} requiredValue 
 * @param {any} currentValue 
 * @returns {boolean}
 */
export function isConditionMet(requiredValue: any, currentValue: any): boolean {
	if (Array.isArray(requiredValue)) {
		return requiredValue.includes(currentValue);
	}
	return currentValue === requiredValue;
}

/**
 * Evaluates whether a set of conditions (requirements) are met based on current values.
 * @param {Record<string, any>} condition - The required values { id: value | value[] }.
 * @param {Record<string, { value: any }>} valuesMap - Map of current values.
 * @returns {boolean}
 */
export function evaluateCondition(
	condition: Record<string, any> | undefined,
	valuesMap: Record<string, { value: any } | undefined>,
): boolean {
	if (!condition) return true;
	return Object.keys(condition).every((id) => {
		return isConditionMet(condition[id], valuesMap[id]?.value);
	});
}

/**
 * Evaluates whether a set of conditions are met by fetching current values from storage.
 * @param {Record<string, any>} condition 
 * @returns {Promise<boolean>}
 */
export async function evaluateConditionAsync(condition: Record<string, any> | undefined): Promise<boolean> {
	if (!condition) return true;
	for (const id in condition) {
		const currentValue = await getFromStorage(id);
		if (!isConditionMet(condition[id], currentValue)) return false;
	}
	return true;
}
