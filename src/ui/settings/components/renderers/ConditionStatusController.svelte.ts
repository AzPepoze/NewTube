import { isConditionMet } from "@settings/engine/functions";

export class ConditionStatusController {
	conditionsMet = $state(false);
	condition = $state<Record<string, any>>({});
	requiredSettings = $state<Record<string, { name: string; value: any; type: string; options?: any }>>({});

	constructor(props: {
		conditionsMet: boolean;
		condition: Record<string, any>;
		requiredSettings: Record<string, { name: string; value: any; type: string; options?: any }>;
	}) {
		this.conditionsMet = props.conditionsMet;
		this.condition = props.condition;
		this.requiredSettings = props.requiredSettings;
	}

	get conditionItems() {
		return Object.keys(this.condition).map(id => {
			const targetValue = this.condition[id];
			const info = this.requiredSettings[id];
			const actualValue = info?.value;
			const met = isConditionMet(targetValue, actualValue);

			return {
				id,
				name: info?.name || id,
				type: info?.type,
				targetValue,
				actualValue,
				met,
				options: info?.options
			};
		});
	}

	formatCondition(item: any) {
		if (item.type === "checkbox") {
			return item.targetValue ? "to be enabled" : "to be disabled";
		}
		
		const values = Array.isArray(item.targetValue) ? item.targetValue : [item.targetValue];
		const names = values.map(v => item.options?.[v]?.name || v);
		
		if (names.length === 1) return `to be ${names[0]}`;
		return `to be ${names.slice(0, -1).join(", ")} or ${names.slice(-1)}`;
	}
}
