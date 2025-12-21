import { get_element_center_position } from "../build-in-functions/normal";
import { Category } from "../types/store";
import { start_highlighter } from "./highlight";
import { create_main_settings_ui } from "./settings/settings";

const editor_width = 400;
export let editor_ui: Awaited<ReturnType<typeof create_main_settings_ui>>;
const current_edit_obj = {};
let animation_frame_id: number | null = null;
let resize_observer: ResizeObserver | null = null;

(async () => {
	editor_ui = await create_main_settings_ui({
		show_category_list: false,
		on_create: function (styleshift_window) {
			styleshift_window.window_element.style.width = editor_width + "px";
			styleshift_window.window_element.style.minWidth = "300px";

			const target_element = current_edit_obj["target"];

			function update_position() {
				const target_element_center_position = get_element_center_position(target_element);
				let cal_position;

				if (target_element_center_position.x < window.innerWidth / 2) {
					cal_position = target_element.getBoundingClientRect().right + 10;
				} else {
					cal_position = target_element.getBoundingClientRect().left - editor_width - 20 - 10;
				}

				if (cal_position + editor_width > window.innerWidth) {
					cal_position = window.innerWidth - editor_width - 20 - 20;
				}

				styleshift_window.window_element.style.left = `${cal_position}px`;

				// Continue animation loop
				animation_frame_id = requestAnimationFrame(update_position);
			}

			update_position();

			resize_observer = new ResizeObserver(() => {
				if (animation_frame_id) {
					cancelAnimationFrame(animation_frame_id);
					animation_frame_id = null;
				}
				if (resize_observer) {
					resize_observer.disconnect();
					resize_observer = null;
				}
			});
			resize_observer.observe(target_element);

			styleshift_window.drag_top.addEventListener("mousedown", () => {
				if (animation_frame_id) {
					cancelAnimationFrame(animation_frame_id);
					animation_frame_id = null;
				}
			});

			styleshift_window.close.addEventListener("click", () => {
				if (animation_frame_id) {
					cancelAnimationFrame(animation_frame_id);
					animation_frame_id = null;
				}
				if (resize_observer) {
					resize_observer.disconnect();
					resize_observer = null;
				}
				start_highlighter();
			});
		},
	});
})();

export async function create_editor_ui(target_element, this_category: Category) {
	current_edit_obj["target"] = target_element;
	current_edit_obj["Category"] = this_category;
	editor_ui.set_get_category(() => [this_category]);
	editor_ui.create_ui();
}
