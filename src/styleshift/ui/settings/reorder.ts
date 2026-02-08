import { insert_after } from "../../build-in-functions/normal";
import { logger } from "../../build-in-functions/logger";
import { save_any } from "../../core/save";
import { update_all } from "../../run";
import { get_setting_category, get_custom_items } from "../../settings/items";
import type { Category, Setting } from "../../types/store";

let draging_setting: { size: number; Data: Setting | Category } | null = null;
const drop_targets = new Map<HTMLElement, { data: Setting | Category; data_type: string }>();

interface Placeholder {
	show: () => void;
	hide: () => void;
	element: HTMLElement;
}

let current_placeholder: Placeholder | null = null;

function clear_current_placeholder() {
	if (current_placeholder) {
		current_placeholder.hide();
		current_placeholder = null;
	}
}

function create_placeholder(size: number) {
	const space = document.createElement("div");
	space.className = "STYLESHIFT-drag-Hint";
	space.style.height = "0px";
	space.style.opacity = "0";

	function show() {
		requestAnimationFrame(() => {
			space.classList.add("show");
			space.style.height = size + "px";
			space.style.opacity = "1";
		});
	}

	function hide() {
		space.classList.remove("show");
		space.style.height = "0px";
		space.style.opacity = "0";
		setTimeout(() => {
			if (space.parentNode) space.remove();
		}, 300);
	}

	return {
		show,
		hide,
		element: space,
	};
}

export function clear_drop_targets() {
	drop_targets.clear();
}

export async function add_drag(
	drag_handle: HTMLElement,
	frame: HTMLElement | null,
	_parent: HTMLElement | null,
	this_data: Setting | Category,
) {
	drag_handle.addEventListener("mousedown", async function (event) {
		event.preventDefault();

		const target_frame = frame || (drag_handle.closest(".STYLESHIFT-Setting-Frame") as HTMLElement);
		if (!target_frame) return;

		const current_parent = target_frame.parentElement;
		if (!current_parent) return;

		const scroller = current_parent.closest(".STYLESHIFT-Scrollable") as HTMLElement;
		if (!scroller) return;

		const frame_bound = target_frame.getBoundingClientRect();
		const offset_y = event.clientY - frame_bound.top;

		draging_setting = {
			size: frame_bound.height,
			Data: this_data,
		};

		logger.info("drag", "Started:", draging_setting);

		const scroller_rect = scroller.getBoundingClientRect();
		const initial_top = frame_bound.top - scroller_rect.top + scroller.scrollTop;
		const initial_left = frame_bound.left - scroller_rect.left;

		clear_current_placeholder();
		current_placeholder = create_placeholder(draging_setting.size);
		current_parent.insertBefore(current_placeholder.element, target_frame);
		current_placeholder.show();

		target_frame.style.width = `${frame_bound.width}px`;
		target_frame.style.height = `${frame_bound.height}px`;
		target_frame.style.boxSizing = "border-box";
		target_frame.style.position = "absolute";
		target_frame.style.pointerEvents = "none";
		target_frame.style.zIndex = "10000";
		target_frame.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
		target_frame.style.left = `${initial_left}px`;
		target_frame.style.top = `${initial_top}px`;
		target_frame.style.margin = "0";
		target_frame.style.transition = "none";

		const handle = target_frame.querySelector(".drag-handle") as HTMLElement;
		if (handle) handle.style.display = "none";

		scroller.setAttribute("draging", "");

		let current_mouse_event = event;
		let render_drag = true;

		let last_hit_el: HTMLElement | null = null;
		let last_hit_is_after = false;

		function update_drag_function() {
			if (!render_drag) return;

			const target_y = current_mouse_event.clientY - scroller_rect.top + scroller.scrollTop - offset_y;
			target_frame!.style.top = `${target_y}px`;

			const x = current_mouse_event.clientX;
			const y = current_mouse_event.clientY;

			let hit_info = null;
			let is_after = false;
			let closest_dist = Infinity;

			for (const [target_el, info] of drop_targets.entries()) {
				if (info.data === this_data && info.data_type === "setting") continue;

				const target_category: Category | 0 =
					info.data_type === "category"
						? (info.data as Category)
						: get_setting_category(info.data as Setting);
				if (!target_category || !target_category.editable) continue;

				const rect = target_el.getBoundingClientRect();
				if (x >= rect.left && x <= rect.right) {
					const center_y = rect.top + rect.height / 2;
					const dist = Math.abs(y - center_y);

					const range = info.data_type === "category" ? rect.height : rect.height + 10;

					if (y >= rect.top - range / 2 && y <= rect.bottom + range / 2) {
						if (dist < closest_dist) {
							closest_dist = dist;
							hit_info = { target_el, ...info };
							is_after = info.data_type === "category" ? true : y > center_y;
						}
					}
				}
			}

			if (hit_info && (hit_info.target_el !== last_hit_el || is_after !== last_hit_is_after)) {
				clear_current_placeholder();

				current_placeholder = create_placeholder(draging_setting!.size);

				if (is_after) {
					insert_after(
						current_placeholder.element,
						hit_info.target_el,
						hit_info.target_el.parentElement!,
					);
				} else {
					hit_info.target_el.parentElement!.insertBefore(
						current_placeholder.element,
						hit_info.target_el,
					);
				}

				current_placeholder.show();

				last_hit_el = hit_info.target_el;
				last_hit_is_after = is_after;
			}

			requestAnimationFrame(update_drag_function);
		}
		update_drag_function();

		function on_drag(event: MouseEvent) {
			current_mouse_event = event;
		}

		document.addEventListener("mousemove", on_drag);

		document.addEventListener(
			"mouseup",
			async function () {
				document.removeEventListener("mousemove", on_drag);
				render_drag = false;

				scroller.removeAttribute("draging");
				clear_current_placeholder();

				if (last_hit_el) {
					const info = drop_targets.get(last_hit_el);
					if (info) {
						const item_to_move = draging_setting!.Data as Setting;
						const source_category = get_setting_category(item_to_move);
						if (source_category !== 0) {
							const idx = source_category.settings.indexOf(item_to_move);
							if (idx > -1) source_category.settings.splice(idx, 1);
						}

						const target_category: Category | 0 =
							info.data_type === "category"
								? (info.data as Category)
								: get_setting_category(info.data as Setting);

						if (target_category !== 0 && target_category.editable) {
							let drop_index = 0;
							if (info.data_type !== "category") {
								drop_index =
									target_category.settings.indexOf(info.data as Setting) +
									(last_hit_is_after ? 1 : 0);
							}
							target_category.settings.splice(drop_index, 0, item_to_move);

							await save_any("custom_styleshift_items", get_custom_items());
						}
					}
				}

				draging_setting = null;
				logger.info("drag", "Ended");
				update_all();
			},
			{ once: true },
		);
	});
}

export async function add_drop_target(
	frame: HTMLElement,
	_parent: HTMLElement,
	this_data: Setting | Category,
	data_type: string,
) {
	drop_targets.set(frame, { data: this_data, data_type });
}
