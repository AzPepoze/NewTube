export function unhighlight(node: HTMLElement) {
	node.querySelectorAll("mark").forEach((mark) => {
		const text = document.createTextNode(mark.textContent || "");
		mark.parentNode?.replaceChild(text, mark);
	});
	node.normalize();
}

export function highlight(node: HTMLElement, query: string) {
	function applyHighlight(q: string) {
		unhighlight(node);
		const trimmedQuery = q.trim();
		if (!trimmedQuery) return;

		const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const regex = new RegExp(`(${escapedQuery})`, "gi");

		const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
		const textNodes: Node[] = [];
		let current: Node | null;
		while ((current = walker.nextNode())) {
			if (
				current.parentNode &&
				current.parentNode.nodeName !== "MARK" &&
				current.parentNode.nodeName !== "SCRIPT" &&
				current.parentNode.nodeName !== "STYLE" &&
				(current.textContent || "").toLowerCase().includes(trimmedQuery.toLowerCase())
			) {
				textNodes.push(current);
			}
		}

		for (const textNode of textNodes) {
			if (!textNode.parentNode) continue;
			const text = textNode.textContent || "";
			const span = document.createElement("span");
			span.innerHTML = text.replace(regex, "<mark>$1</mark>");
			const parent = textNode.parentNode;
			while (span.firstChild) {
				parent.insertBefore(span.firstChild, textNode);
			}
			parent.removeChild(textNode);
		}
	}

	applyHighlight(query);

	return {
		update(newQuery: string) {
			applyHighlight(newQuery);
		},
		destroy() {
			unhighlight(node);
		},
	};
}
