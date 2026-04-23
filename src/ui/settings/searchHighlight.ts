export function highlight(node: HTMLElement, query: string) {
	const originalContentMap = new Map<Node, string>();

	function walkAndStore(root: Node) {
		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
		let node;
		while ((node = walker.nextNode())) {
			if (!originalContentMap.has(node)) {
				originalContentMap.set(node, node.textContent || "");
			}
		}
	}

	function applyHighlight() {
		if (!query) {
			originalContentMap.forEach((text, node) => {
				if (node.parentNode) {
					node.textContent = text;
				}
			});
			return;
		}

		// Escape special regex characters
		const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const regex = new RegExp(`(${escapedQuery})`, "gi");

		originalContentMap.forEach((text, node) => {
			if (!node.parentNode) return;

			// Skip if parent is already a mark or inside a script/style
			if (node.parentNode.nodeName === "MARK" || node.parentNode.nodeName === "SCRIPT") return;

			if (text.toLowerCase().includes(query.toLowerCase())) {
				const span = document.createElement("span");
				span.innerHTML = text.replace(regex, "<mark>$1</mark>");

				// Replace text node with the new span content
				// Note: This is a simplified version. For production, we'd use document fragments.
				const parent = node.parentNode;
				while (span.firstChild) {
					parent.insertBefore(span.firstChild, node);
				}
				parent.removeChild(node);
			}
		});
	}

	// Initial store
	walkAndStore(node);
	applyHighlight();

	return {
		update(newQuery: string) {
			// Reset before updating
			node.querySelectorAll("mark").forEach((mark) => {
				const text = document.createTextNode(mark.textContent || "");
				mark.parentNode?.replaceChild(text, mark);
			});
			// Re-walk to capture any dynamic text nodes
			walkAndStore(node);
			query = newQuery;
			applyHighlight();
		},
	};
}
