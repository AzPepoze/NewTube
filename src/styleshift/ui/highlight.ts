import { create_unique_id, once_element_remove, wait_document_loaded } from "../build-in-functions/normal";
import { get_styleshift_items } from "../settings/items";
import { create_editor_ui, editor_ui } from "./editor";
import { show_confirm } from "./extension";

let highlight_elements = {};
let debounce_timer: NodeJS.Timeout;
const debounce_delay = 150;

function debounce(callback: Function) {
	if (debounce_timer) {
		clearTimeout(debounce_timer);
	}
	debounce_timer = setTimeout(() => {
		callback();
		debounce_timer = null;
	}, debounce_delay);
}

function add_highlight(target_element: HTMLElement, selector_value) {
	console.log(highlight_elements);

	const exist_unique_id = target_element.getAttribute("StyleShift-unique_id");
	if (exist_unique_id) {
		const obj = highlight_elements[exist_unique_id];
		console.log(obj.target_element, target_element);
		obj.stop();
	}

	const unique_id = create_unique_id(10);

	target_element.setAttribute("StyleShift-unique_id", unique_id);

	const color = `rgba(${selector_value.Highlight_color}`;

	const highlighter = document.createElement("div");
	highlighter.className = "STYLESHIFT-Highlight";
	highlighter.setAttribute("Selector", selector_value.Selector);

	highlighter.style.background = `${color},0.3)`;
	highlighter.style.borderColor = `${color},0.8)`;

	const computed_style = window.getComputedStyle(target_element);
	highlighter.style.width = `calc(100% - 
	${computed_style.getPropertyValue("padding-left")} - 
	${computed_style.getPropertyValue("padding-right")} - 2px
	)`;
	highlighter.style.height = `calc(100% - 
	${computed_style.getPropertyValue("padding-top")} - 
	${computed_style.getPropertyValue("padding-bottom")} - 2px
	)`;

	target_element.append(highlighter);

	highlighter.onclick = function () {
		create_editor_ui(target_element, selector_value);
		stop_highlighter();
	};

	const old_style = target_element.style.position;
	target_element.style.position = "relative";

	function stop() {
		if (target_element) {
			target_element.style.position = old_style;
		}
		highlighter.remove();
		target_element.removeAttribute("StyleShift-unique_id");
		delete highlight_elements[unique_id];
	}

	once_element_remove(target_element, function () {
		stop();
	});

	const return_obj = {
		highlighter: highlighter,
		target_element: target_element,
		stop: stop,
	};

	highlight_elements[unique_id] = return_obj;

	return return_obj;
}

let watch_body: MutationObserver;

export async function start_highlighter() {
	await wait_document_loaded();
	const editable_items = await get_styleshift_items();
	console.log("editable_items", editable_items);
	const exept_items = [];

	const containers = document.querySelectorAll(".dynamic-content, .user-content, main, #content");

	watch_body = new MutationObserver((mutations_list) => {
		debounce(async () => {
			for (const mutation of mutations_list) {
				if (mutation.type === "childList") {
					for (const node of mutation.addedNodes as any) {
						if (node.nodetype === Node.ELEMENT_NODE) {
							for (const selector_value of [...editable_items.Default, ...editable_items.Custom]) {
								if (
									selector_value.selector != "" &&
									node.matches(selector_value.selector) &&
									!exept_items.some((item) => item === selector_value.selector)
								) {
									console.log("Add New Node", selector_value.selector);
									add_highlight(node, selector_value);
									break;
								}
							}
						}
					}
				}
			}
		});
	});

	if (containers.length > 0) {
		containers.forEach((container) => {
			watch_body.observe(container, {
				childList: true,
				subtree: true,
				attributeFilter: ["class", "id"],
			});
		});
	} else {
		watch_body.observe(document.body, {
			childList: true,
			subtree: true,
			attributeFilter: ["class", "id"],
		});
	}

	for (const selector_value of [...editable_items.Default, ...editable_items.Custom]) {
		if (selector_value.selector == "") continue;

		const selector_found = document.querySelectorAll(selector_value.selector);

		if (
			selector_found.length >= 1000 &&
			!(await show_confirm(
				`StyleShift : I found ${selector_found.length} elements on selector "${selector_value.selector}"\n\nAre you wish to continue??`
			))
		) {
			exept_items.push(selector_value.selector);
			continue;
		}

		console.log("selector_found", selector_value.selector, selector_found);

		// Process elements in chunks to avoid blocking the main thread
		const chunk_size = 50;
		for (let i = 0; i < selector_found.length; i += chunk_size) {
			const chunk = Array.from(selector_found).slice(i, i + chunk_size);
			setTimeout(() => {
				chunk.forEach((element) => {
					add_highlight(element as HTMLElement, selector_value);
				});
			}, 0);
		}
	}
}

function stop_highlighter() {
	if (watch_body) {
		watch_body.disconnect();
	}

	for (const highlight_elements_obj of Object.values(highlight_elements) as any) {
		highlight_elements_obj.stop();
	}

	highlight_elements = [];
}

let running_customize = false;

export async function start_customize() {
	if (running_customize) {
		return;
	}
	running_customize = true;
	start_highlighter();
}

export function stop_customize() {
	if (!running_customize) {
		return;
	}
	running_customize = false;
	stop_highlighter();
}

export async function toggle_customize() {
	if (running_customize) {
		stop_customize();
		editor_ui.remove_ui(false);
	} else {
		start_customize();
	}
}
