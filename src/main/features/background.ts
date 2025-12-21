import { get_document_body } from "../../styleshift/build-in-functions/normal";
import { load_setting } from "../../styleshift/core/save";
import { on_setting_update } from "../../styleshift/settings/functions";

const bg_tint_id = "newtube-bg-tint";
const bg_image_id = "newtube-bg-image";

let bg_tint_element: HTMLElement | null = null;
let bg_image_element: HTMLElement | null = null;
const bg_image = new Image();

export const enable_background_css = `
ytd-app {
	background : transparent;
}

#${bg_tint_id},
#${bg_image_id} {
	width : 100%;
	height : 100%;
	position : fixed;
	left : 0;
	top : 0;
	z-index : -1;
}

#${bg_tint_id}{
	background: var(--newtube-bg-tint-color);
}

#${bg_image_id} {
	z-index: -10000;
    background-position-x: var(--newtube-bg-position-x);
	background-position-y: var(--newtube-bg-position-y);
	background-repeat: var(--newtube-bg-repeat);
	filter: blur(var(--newtube-bg-blur));
}
`;

function get_element() {
	bg_tint_element = document.getElementById(bg_tint_id);
	bg_image_element = document.getElementById(bg_image_id);
}

export async function enable_bg() {
	get_element();

	if (!bg_tint_element) {
		bg_tint_element = document.createElement("div");
		bg_tint_element.id = bg_tint_id;
	}

	if (!bg_image_element) {
		bg_image_element = document.createElement("div");
		bg_image_element.id = bg_image_id;
	}

	(await get_document_body()).appendChild(bg_tint_element);
	(await get_document_body()).appendChild(bg_image_element);
	window.addEventListener("resize", update_bg_img_size);
}

export async function disable_bg() {
	get_element();

	if (bg_tint_element) {
		bg_tint_element.remove();
		bg_tint_element = null;
	}
	if (bg_image_element) {
		bg_image_element.remove();
		bg_image_element = null;
	}
	window.removeEventListener("resize", update_bg_img_size);
}

export async function update_bg_img() {
	console.log("BG updated");
	const url = await load_setting("BGIMG");
	bg_image.src = url;
}

export async function update_bg_img_size() {
	const bg_bound = bg_image_element.getBoundingClientRect();
	const imagine_background_height = (bg_image.height / bg_image.width) * window.innerWidth;
	const zoom_value = await load_setting("BackgroundS");

	if (imagine_background_height < bg_bound.height) {
		bg_image_element.style.backgroundSize = `${(bg_bound.height / imagine_background_height) * zoom_value}%`;
	} else {
		bg_image_element.style.backgroundSize = `${zoom_value}%`;
	}
}

export async function update_bg_img_position() {
	bg_image_element.style.backgroundPositionX = (await load_setting("BackgroundX")) + "%";
	bg_image_element.style.backgroundPositionY = (await load_setting("BackgroundY")) + "%";
}

bg_image.onload = function () {
	if (bg_image_element) bg_image_element.style.backgroundImage = `url("${bg_image.src}")`;

	update_bg_img_size();
};

on_setting_update("BGIMG", update_bg_img, true);
