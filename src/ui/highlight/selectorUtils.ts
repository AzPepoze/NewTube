/**
 * Generates a list of potential CSS selectors for a given element.
 */
export function generateSelectors(element: HTMLElement): string[] {
	const selectors: string[] = [];

	const classes = Array.from(element.classList).filter((c) => !c.startsWith("styleshift-") && !c.includes("svelte-"));

	if (element.id && !element.id.startsWith("styleshift-")) {
		selectors.push(`#${element.id}`);
	}

	if (classes.length > 0) {
		classes.forEach((c) => selectors.push(`.${c}`));
		if (classes.length > 1) {
			selectors.push(`.${classes.join(".")}`);
		}
	}

	if (classes.length > 0) {
		selectors.push(`${element.tagName.toLowerCase()}.${classes[0]}`);
	}

	selectors.push(element.tagName.toLowerCase());

	for (const attr of Array.from(element.attributes)) {
		if (attr.name.startsWith("data-") && !attr.name.startsWith("data-v-") && !attr.name.includes("svelte")) {
			selectors.push(`[${attr.name}="${attr.value}"]`);
			selectors.push(`[${attr.name}]`);
		}
	}

	const parent = element.parentElement;
	if (parent && parent !== document.body) {
		const parentClasses = Array.from(parent.classList).filter((c) => !c.startsWith("styleshift-"));
		const parentDesc = parent.id
			? `#${parent.id}`
			: parentClasses.length > 0
				? `${parent.tagName.toLowerCase()}.${parentClasses[0]}`
				: parent.tagName.toLowerCase();

		selectors.push(`${parentDesc} > ${element.tagName.toLowerCase()}`);

		const siblings = Array.from(parent.children);
		if (siblings.length > 1) {
			const index = siblings.indexOf(element) + 1;
			selectors.push(`${parentDesc} > ${element.tagName.toLowerCase()}:nth-child(${index})`);
		}
	}

	return Array.from(
		new Set(
			selectors.filter((s) => {
				try {
					if (!s || s === "") return false;
					document.querySelector(s);
					return true;
				} catch (_e) {
					return false;
				}
			}),
		),
	);
}
