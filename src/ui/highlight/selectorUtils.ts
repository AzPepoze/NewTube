/**
 * Generates a list of potential CSS selectors for a given element.
 */
export function generateSelectors(element: HTMLElement): string[] {
	const selectors: string[] = [];

	// Filter out StyleShift internal classes from class list
	const classes = Array.from(element.classList).filter((c) => !c.startsWith("styleshift-") && !c.includes("svelte-"));

	// 1. ID Selector
	if (element.id && !element.id.startsWith("styleshift-")) {
		selectors.push(`#${element.id}`);
	}

	// 2. Class Selectors (individual and combined)
	if (classes.length > 0) {
		classes.forEach((c) => selectors.push(`.${c}`));
		if (classes.length > 1) {
			selectors.push(`.${classes.join(".")}`);
		}
	}

	// 3. Tag name with classes
	if (classes.length > 0) {
		selectors.push(`${element.tagName.toLowerCase()}.${classes[0]}`);
	}

	// 4. Tag name only
	selectors.push(element.tagName.toLowerCase());

	// 5. Data attributes
	for (const attr of Array.from(element.attributes)) {
		if (attr.name.startsWith("data-") && !attr.name.startsWith("data-v-") && !attr.name.includes("svelte")) {
			selectors.push(`[${attr.name}="${attr.value}"]`);
			selectors.push(`[${attr.name}]`);
		}
	}

	// 6. Path-based selector (structural)
	const parent = element.parentElement;
	if (parent && parent !== document.body) {
		const parentClasses = Array.from(parent.classList).filter((c) => !c.startsWith("styleshift-"));
		const parentDesc = parent.id
			? `#${parent.id}`
			: parentClasses.length > 0
				? `${parent.tagName.toLowerCase()}.${parentClasses[0]}`
				: parent.tagName.toLowerCase();

		selectors.push(`${parentDesc} > ${element.tagName.toLowerCase()}`);

		// nth-child if it's not unique among siblings
		const siblings = Array.from(parent.children);
		if (siblings.length > 1) {
			const index = siblings.indexOf(element) + 1;
			selectors.push(`${parentDesc} > ${element.tagName.toLowerCase()}:nth-child(${index})`);
		}
	}

	// Remove duplicates and empty strings, and ensure they are valid selectors
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
