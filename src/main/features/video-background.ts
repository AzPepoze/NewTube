import { get_document_body } from "../../styleshift/build-in-functions/normal";
import { load_setting } from "../../styleshift/core/save";
import { on_setting_update } from "../../styleshift/settings/functions";

let video_bg_enabled = false;
let video_bg_canvas: HTMLCanvasElement | null = null;
let video_bg_ctx: CanvasRenderingContext2D | null = null;
let animation_frame: number | null = null;

// Default values
let bg_blur = 30;
let bg_quality = 0.5;
let bg_brightness = 100;
let bg_contrast = 100;
let bg_scale = 2.2;
let bg_smooth = 1;

// State
let frame_count = 0;
let last_frame_data: Uint8ClampedArray | null = null;
let static_frame_counter = 0;
let is_static = false;

export async function update_video_bg_settings() {
	const blur = await load_setting("VideoBGBlur");
	const qual = await load_setting("VideoBGQuality");
	const brit = await load_setting("VideoBGBrightness");
	const cont = await load_setting("VideoBGContrast");
	const scale = await load_setting("VideoBGSize");
	const smooth = await load_setting("VideoBGSmooth");

	if (blur !== undefined) bg_blur = blur;
	if (qual !== undefined) bg_quality = qual / 100;
	if (brit !== undefined) bg_brightness = brit;
	if (cont !== undefined) bg_contrast = cont;
	if (scale !== undefined) bg_scale = scale;
	if (smooth !== undefined) bg_smooth = smooth;

	if (video_bg_canvas) {
		video_bg_canvas.style.filter = `blur(${bg_blur}px) brightness(${bg_brightness}%) contrast(${bg_contrast}%)`;
		video_bg_canvas.style.transform = `scale(${bg_scale})`;
	}
}

// Simple pixel comparison to check if video is static
function check_static(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
	try {
		// Sample center 10x10 pixels
		const sample_size = 10;
		const center_x = Math.floor(Math.max(0, width / 2 - sample_size / 2));
		const center_y = Math.floor(Math.max(0, height / 2 - sample_size / 2));

		const frame_data = ctx.getImageData(center_x, center_y, sample_size, sample_size).data;

		if (!last_frame_data) {
			last_frame_data = frame_data;
			return false;
		}

		let diff = 0;
		// Check every 4th pixel to save cpu
		for (let i = 0; i < frame_data.length; i += 16) {
			diff += Math.abs(frame_data[i] - last_frame_data[i]);
		}

		last_frame_data = frame_data;

		if (diff < 50) {
			return true;
		}
		return false;
	} catch (e) {
		return false;
	}
}

export function setup_video_background() {
	video_bg_enabled = true;
	update_video_bg_settings();

	const update_canvas = () => {
		if (!video_bg_enabled || !video_bg_canvas || !video_bg_ctx) return;

		animation_frame = requestAnimationFrame(update_canvas);

		frame_count++;
		// Smoothness check
		if (frame_count % bg_smooth !== 0) return;

		const video = document.querySelector("video");
		if (video && !video.paused && !video.ended && video.readyState >= 2) {
			// Static check optimization
			if (is_static) {
				// Re-check occasionally
				if (frame_count % 60 !== 0) return;
			}

			const target_width = Math.max(64, Math.floor(video.videoWidth * bg_quality));
			const target_height = Math.max(36, Math.floor(video.videoHeight * bg_quality));

			if (video_bg_canvas.width !== target_width && target_width > 0) {
				video_bg_canvas.width = target_width;
				video_bg_canvas.height = target_height;
			}

			video_bg_ctx.drawImage(video, 0, 0, video_bg_canvas.width, video_bg_canvas.height);

			if (check_static(video_bg_ctx, video_bg_canvas.width, video_bg_canvas.height)) {
				static_frame_counter++;
				if (static_frame_counter > 30) is_static = true;
			} else {
				static_frame_counter = 0;
				is_static = false;
			}
		}
	};

	const init = async () => {
		if (document.getElementById("newtube-bg-canvas") || !video_bg_enabled) return;

		const app = (await get_document_body()) || document.body;

		video_bg_canvas = document.createElement("canvas");
		video_bg_canvas.id = "newtube-bg-canvas";
		video_bg_canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            object-fit: cover;
            transition: opacity 0.5s;
            pointer-events: none;
        `;
		// Initial style
		video_bg_canvas.style.filter = `blur(${bg_blur}px) brightness(${bg_brightness}%) contrast(${bg_contrast}%)`;
		video_bg_canvas.style.transform = `scale(${bg_scale})`;

		video_bg_canvas.width = 128;
		video_bg_canvas.height = 72;

		video_bg_ctx = video_bg_canvas.getContext("2d", { alpha: false });

		app.appendChild(video_bg_canvas);
		update_canvas();
	};

	init();
	window.addEventListener("yt-navigate-finish", init);
}

export function disable_video_background() {
	video_bg_enabled = false;
	if (animation_frame) cancelAnimationFrame(animation_frame);
	const canvas = document.getElementById("newtube-bg-canvas");
	if (canvas) canvas.remove();
	video_bg_canvas = null;
	video_bg_ctx = null;
	is_static = false;
}

on_setting_update("VideoBGBlur", update_video_bg_settings);
on_setting_update("VideoBGQuality", update_video_bg_settings);
on_setting_update("VideoBGBrightness", update_video_bg_settings);
on_setting_update("VideoBGContrast", update_video_bg_settings);
on_setting_update("VideoBGSize", update_video_bg_settings);
on_setting_update("VideoBGSmooth", update_video_bg_settings);