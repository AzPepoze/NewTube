import { wait_one_frame } from "../../styleshift/build-in-functions/normal";
import { get_from_storage, get_user_setting } from "../../styleshift/core/storage-manager";
import { register_setting_listener } from "../../styleshift/settings/functions";

let video: HTMLVideoElement | null = null;
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let animation_id: number | null = null;
let vfc_id: number | null = null;
let last_height = 0;
let enabled = false;
let is_checking = false;

const ultra_wide_ratio = (21 / 9).toFixed(2);
let is_ultra_wide_mode = false;

function check_pixel_diff(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, threshold: number) {
	return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) > threshold;
}

function calculate_vdo_height(heights: (number | "inf")[], current_last_height: number) {
	let max_frequency = 0;
	let most_common_height: number | "inf" = "inf";

	for (let i = 0; i < heights.length; i++) {
		let frequency = 0;
		const candidate = heights[i];
		for (let j = i; j < heights.length; j++) {
			const target = heights[j];
			if (
				candidate === target ||
				(typeof candidate === "number" && typeof target === "number" && Math.abs(candidate - target) < 5)
			) {
				frequency++;
			}
		}

		if (
			frequency > max_frequency ||
			(frequency === max_frequency &&
				typeof candidate === "number" &&
				(typeof most_common_height !== "number" || candidate > most_common_height))
		) {
			max_frequency = frequency;
			most_common_height = candidate;
		}
	}

	if (max_frequency < 3 || most_common_height === "inf") {
		return current_last_height;
	}

	return most_common_height;
}

async function check_black_bars() {
	if (!enabled || !video || is_checking) return;

	if (video.ended || video.paused) {
		if ("requestVideoFrameCallback" in video) {
			vfc_id = video.requestVideoFrameCallback(check_black_bars);
		} else {
			animation_id = requestAnimationFrame(check_black_bars);
		}
		return;
	}

	is_checking = true;

	const debug = await get_user_setting("DelBarDebug");

	if (!canvas) {
		canvas = document.createElement("canvas");
		canvas.width = 5;
		ctx = canvas.getContext("2d", { alpha: false });
		canvas.id = "NewtubeVDOCanvas";
	}

	if (debug) {
		const video_rect = video.getBoundingClientRect();
		if (!canvas.parentElement) {
			const container = video.parentElement;
			if (container) {
				container.appendChild(canvas);
				canvas.style.position = "absolute";
				canvas.style.top = "0px";
				canvas.style.left = "0px";
				canvas.style.width = "50px";
				canvas.style.zIndex = "1000";
				canvas.style.imageRendering = "pixelated";
				canvas.style.pointerEvents = "none";
			}
		}
		if (canvas.style.height !== `${video_rect.height}px`) {
			canvas.style.height = `${video_rect.height}px`;
		}
		canvas.style.display = "block";
	} else {
		canvas.style.display = "none";
	}

	const v_height = video.videoHeight;
	if (v_height === 0) {
		is_checking = false;
		if ("requestVideoFrameCallback" in video) {
			video.requestVideoFrameCallback(check_black_bars);
		} else {
			animation_id = requestAnimationFrame(check_black_bars);
		}
		return;
	}

	if (canvas.height !== v_height) {
		canvas.height = v_height;
	}

	ctx.drawImage(video, 0, 0, 5, v_height);

	// Sample 5 columns
	const heights_found: (number | "inf")[] = [];
	const sample_color = ctx.getImageData(1, 3, 1, 1).data;
	const [s_r, s_g, s_b] = [sample_color[0], sample_color[1], sample_color[2]];
	const threshold = 20;

	const drop_frame = await get_user_setting("DropFrame");
	const lazy_amount = await get_user_setting("LazyAmount");
	const check_step = drop_frame ? Math.max(1, Math.floor(lazy_amount / 10)) : 1;

	for (let x = 0; x < 5; x++) {
		const img_data = ctx.getImageData(x, 0, 1, v_height).data;
		let top = -1;
		let bottom = -1;

		// Top scan
		for (let i = 5; i < v_height / 2; i += check_step) {
			if (
				check_pixel_diff(
					img_data[i * 4],
					img_data[i * 4 + 1],
					img_data[i * 4 + 2],
					s_r,
					s_g,
					s_b,
					threshold,
				)
			) {
				top = i;
				break;
			}
			if (debug) {
				ctx.fillStyle = "red";
				ctx.fillRect(x, i, 1, 1);
			}
		}

		// Bottom scan
		for (let i = v_height - 5; i > v_height / 2; i -= check_step) {
			if (
				check_pixel_diff(
					img_data[i * 4],
					img_data[i * 4 + 1],
					img_data[i * 4 + 2],
					s_r,
					s_g,
					s_b,
					threshold,
				)
			) {
				bottom = v_height - i;
				break;
			}
			if (debug) {
				ctx.fillStyle = "red";
				ctx.fillRect(x, i, 1, 1);
			}
		}

		if (top !== -1 && bottom !== -1) {
			heights_found.push(Math.max(top, bottom));
		} else {
			heights_found.push("inf");
		}
	}

	const final_detected_height = calculate_vdo_height(heights_found, last_height);

	if (Math.abs(final_detected_height - last_height) > 10 || (final_detected_height > 10 && last_height === 0)) {
		const player = document.querySelector(".html5-video-container") as HTMLElement;
		if (player) {
			if (final_detected_height > last_height) {
				player.style.transition = "none";
			} else {
				player.style.transition = "all 0.5s ease-out";
			}
		}
		last_height = final_detected_height;
		apply_crop(final_detected_height, v_height);
	}

	if (debug) {
		ctx.fillStyle = "yellow";
		ctx.fillRect(0, 10, 5, 1);
		ctx.fillStyle = "green";
		ctx.fillRect(0, last_height, 5, 1);
		ctx.fillRect(0, v_height - last_height, 5, 1);
	}

	const ultra_wide_enabled = await get_user_setting("UltraWide");
	if (ultra_wide_enabled) {
		check_ultra_wide();
	} else {
		disable_ultra_wide();
	}

	is_checking = false;
	const cooldown = drop_frame ? lazy_amount : 0;

	const next_call = () => {
		if (video && enabled) {
			if ("requestVideoFrameCallback" in video) {
				vfc_id = video.requestVideoFrameCallback(check_black_bars);
			} else {
				animation_id = requestAnimationFrame(check_black_bars);
			}
		}
	};

	if (cooldown > 0) {
		setTimeout(next_call, cooldown);
	} else {
		next_call();
	}
}

function check_ultra_wide() {
	if (!video || !video.parentElement) return;
	const parent = video.parentElement;
	const rect = parent.getBoundingClientRect();
	const current_ratio = rect.width / rect.height;

	if (Math.abs(parseFloat(ultra_wide_ratio) - current_ratio) < 0.15) {
		enable_ultra_wide(current_ratio);
	} else {
		disable_ultra_wide();
	}
}

function enable_ultra_wide(ratio: number) {
	if (is_ultra_wide_mode) return;
	is_ultra_wide_mode = true;
	if (!video || !video.parentElement) return;

	const container = video.parentElement;
	const main_container = container.parentElement;
	if (!main_container) return;

	const main_rect = main_container.getBoundingClientRect();
	const imagine_width = ratio * main_rect.height;

	if (imagine_width > main_rect.width) {
		container.style.width = "100%";
		container.style.height = "auto";
	} else {
		container.style.width = "auto";
		container.style.height = "100%";
	}
	container.style.aspectRatio = `${ratio} / 1`;
	video.style.width = "100%";
}

function disable_ultra_wide() {
	if (!is_ultra_wide_mode) return;
	is_ultra_wide_mode = false;
	if (!video || !video.parentElement) return;

	const container = video.parentElement;
	container.style.width = "";
	container.style.height = "";
	container.style.aspectRatio = "";
	video.style.width = "";
}

function apply_crop(bar_height: number, total_height: number) {
	const player = document.querySelector(".html5-video-container") as HTMLElement;
	if (!player || !video) return;

	if (bar_height <= 10) {
		player.style.transform = "";
		player.style.height = "";
		video.style.transform = "";
		disable_ultra_wide();
	} else {
		const content_height = total_height - bar_height * 2;
		const scale = total_height / content_height;
		player.style.transform = `scale(${scale})`;
		player.style.height = "100%";

		// Ensure the video is centered within the scaled container
		video.style.position = "absolute";
		video.style.top = "50%";
		video.style.left = "50%";
		video.style.transform = "translate(-50%, -50%)";
	}
}

export async function setup_remove_black_bars() {
	if ((await get_from_storage("Enable_Extension")) === false) return;
	if (enabled) return;
	enabled = true;
	const find_video = async () => {
		video = document.querySelector("video");
		if (video) {
			check_black_bars();
		} else {
			if (enabled) {
				await wait_one_frame();
				find_video();
			}
		}
	};
	find_video();
	window.addEventListener("yt-navigate-finish", find_video);
}

export function destroy_remove_black_bars() {
	enabled = false;
	if (animation_id) cancelAnimationFrame(animation_id);
	if (vfc_id && video && "cancelVideoFrameCallback" in video) {
		video.cancelVideoFrameCallback(vfc_id);
	}

	const player = document.querySelector(".html5-video-container") as HTMLElement;
	if (player) {
		player.style.transform = "";
		player.style.height = "";
		player.style.transition = "";
	}
	if (video) {
		video.style.transform = "";
		video.style.top = "";
		video.style.left = "";
		video.style.position = "";
	}
	if (canvas) canvas.style.display = "none";
	last_height = 0;
	disable_ultra_wide();
}

register_setting_listener("Enable_Extension", (val) => {
	if (!val) {
		destroy_remove_black_bars();
	} else {
		get_user_setting("DelBar").then((enabled) => {
			if (enabled) {
				setup_remove_black_bars();
			}
		});
	}
});
