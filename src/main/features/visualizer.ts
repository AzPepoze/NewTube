import { get_ytd_app } from "../modules/main";

let audio_ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let source: MediaElementAudioSourceNode | null = null;
let canvas: HTMLCanvasElement | null = null;
let canvas_ctx: CanvasRenderingContext2D | null = null;
let animation_frame: number | null = null;

export function setup_audio_visualizer() {
	const init = async () => {
		if (audio_ctx) return; // Already running

		const video = document.querySelector("video");
		if (!video) return;

		if (!video.crossOrigin) {
			video.crossOrigin = "anonymous";
		}

		try {
			audio_ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
			analyser = audio_ctx.createAnalyser();
			analyser.fftSize = 512;

			source = audio_ctx.createMediaElementSource(video);
			source.connect(analyser);
			analyser.connect(audio_ctx.destination);

			await create_canvas();
			visualize();
		} catch (e) {
			// console.warn("Visualizer setup failed", e);
		}
	};

	const create_canvas = async () => {
		if (document.getElementById("newtube-visualizer")) return;

		const ytd_app = await get_ytd_app();

		canvas = document.createElement("canvas");
		canvas.id = "newtube-visualizer";
		canvas.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 250px;
            z-index: 500; 
            pointer-events: none;
            filter: drop-shadow(0px 0px 3px white);
        `;
		canvas.width = window.innerWidth;
		canvas.height = 250;

		if (ytd_app) {
			ytd_app.appendChild(canvas);
		} else {
			document.body.appendChild(canvas);
		}

		canvas_ctx = canvas.getContext("2d");
	};

	const visualize = () => {
		if (!analyser || !canvas || !canvas_ctx) return;

		const buffer_length = analyser.frequencyBinCount;
		const data_array = new Uint8Array(buffer_length);

		// Cap logic
		const cap_y_positions: number[] = [];
		const cap_height = 2;
		const cap_style = "#fff";

		const draw = () => {
			if (!analyser || !canvas_ctx || !canvas) return;

			animation_frame = requestAnimationFrame(draw);
			analyser.getByteFrequencyData(data_array);

			canvas_ctx.clearRect(0, 0, canvas.width, canvas.height);

			const bar_width = (canvas.width / buffer_length) * 2.5;
			let x = 0;

			for (let i = 0; i < buffer_length; i++) {
				// Calculate bar height, scaling it to look nice
				// Value is 0-255
				let bar_height = ((data_array[i] * data_array[i]) / 500); 
                if(bar_height < 0) bar_height = 0;

				// Initialize cap position
				if (cap_y_positions.length < buffer_length) {
					cap_y_positions.push(bar_height);
				}

				const current_cap_y = cap_y_positions[i];

				// Draw Cap
				canvas_ctx.fillStyle = cap_style;

				if (bar_height < current_cap_y) {
					// Drop cap (Gravity)
					cap_y_positions[i] = Math.max(0, current_cap_y - 1.5);
					canvas_ctx.fillRect(x, canvas.height - cap_y_positions[i], bar_width, cap_height);
				} else {
					// Push cap up
					cap_y_positions[i] = bar_height;
					canvas_ctx.fillRect(x, canvas.height - bar_height, bar_width, cap_height);
				}

				// Draw Bar with Gradient
				const gradient = canvas_ctx.createLinearGradient(0, canvas.height, 0, canvas.height - bar_height);
				gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
				gradient.addColorStop(1, "rgba(255, 255, 255, 0.8)");
				canvas_ctx.fillStyle = gradient;

				// Draw bar slightly below cap
				canvas_ctx.fillRect(x, canvas.height - bar_height + cap_height + 4, bar_width, bar_height);

				x += bar_width + 1;
			}
		};

		draw();
	};

	setTimeout(init, 2000);
	window.addEventListener("yt-navigate-finish", () => setTimeout(init, 1000));

	window.addEventListener("resize", () => {
		if (canvas) {
			canvas.width = window.innerWidth;
		}
	});
}