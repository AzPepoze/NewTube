import { getUserSetting } from "@core/storage/manager";
import { getVideoElement, isYoutubeFullscreen, onYoutubeFullscreen, onYoutubeNavigate } from "@extensions/youtube/modules/youtube";
import { registerSettingListener } from "@settings/engine/functions";
import { logger } from "@shared/logger";

let enabled = false;
let canvas: HTMLCanvasElement | null = null;
let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
let ctx2d: CanvasRenderingContext2D | null = null;
let useCPU = false;
let program: WebGLProgram | null = null;
let videoTexture: WebGLTexture | null = null;

let animationFrame: number | null = null;
let renderTimeout: number | null = null;
let navigateCleanup: (() => void) | null = null;
let fullscreenCleanup: (() => void) | null = null;

const vsSource = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_position * 0.5 + 0.5;
    v_texCoord.y = 1.0 - v_texCoord.y;
}`;

const fsSource = `
precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    float v = max(color.r, max(color.g, color.b));
    gl_FragColor = vec4(color.rgb, v);
}`;

function createShader(gl: WebGLRenderingContext | WebGL2RenderingContext, type: number, source: string) {
	const shader = gl.createShader(type);
	if (!shader) {
		logger.error("black-to-transparent", "Could not create shader object");
		return null;
	}
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		logger.error("black-to-transparent", "Shader compile error:", gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	logger.info(
		"black-to-transparent",
		`Shader of type ${type === gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT"} compiled successfully`,
	);
	return shader;
}

function initWebGL() {
	logger.info("black-to-transparent", "Initializing WebGL");
	if (!canvas) {
		logger.error("black-to-transparent", "Canvas not found in initWebGL");
		return false;
	}

	// Try WebGL 2 first, then fallback to WebGL 1
	gl = (canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: false }) as WebGL2RenderingContext) ||
		(canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false }) as unknown as WebGL2RenderingContext);

	if (!gl) {
		logger.error("black-to-transparent", "WebGL not supported");
		return false;
	}

	const isWebGL2 = gl instanceof (window.WebGL2RenderingContext || Object);
	logger.info("black-to-transparent", `Using ${isWebGL2 ? "WebGL 2" : "WebGL 1"}`);

	const vShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
	const fShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
	if (!vShader || !fShader) {
		logger.error("black-to-transparent", "Failed to create shaders");
		return false;
	}

	program = gl.createProgram();
	if (!program) {
		logger.error("black-to-transparent", "Failed to create program");
		return false;
	}
	gl.attachShader(program, vShader);
	gl.attachShader(program, fShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		logger.error("black-to-transparent", "Program link error:", gl.getProgramInfoLog(program));
		return false;
	}

	gl.useProgram(program);

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

	const positionLoc = gl.getAttribLocation(program, "a_position");
	gl.enableVertexAttribArray(positionLoc);
	gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

	videoTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, videoTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

	logger.info("black-to-transparent", "WebGL initialized successfully");
	return true;
}

async function render() {
	if (!enabled) return;

	const video = await getVideoElement();
	if (!video) {
		animationFrame = requestAnimationFrame(render);
		return;
	}

	const scheduleNext = () => {
		if ("requestVideoFrameCallback" in video) {
			video.requestVideoFrameCallback(render);
		} else {
			renderTimeout = setTimeout(() => {
				animationFrame = requestAnimationFrame(render);
			}, 16) as any; // Try 60fps for WebGL
		}
	};

	if (isYoutubeFullscreen || video.paused || video.ended || video.readyState < 2) {
		if (canvas && canvas.style.display !== "none") {
			logger.info("black-to-transparent", "Hiding canvas due to video state or fullscreen", {
				isYoutubeFullscreen,
				paused: video.paused,
				ended: video.ended,
				readyState: video.readyState,
			});
			canvas.style.display = "none";
			video.style.opacity = "1";
		}
		scheduleNext();
		return;
	}

	if (!canvas) {
		logger.info("black-to-transparent", "Creating canvas");
		canvas = document.createElement("canvas");
		canvas.id = "newtube-black-to-transparent";
		canvas.style.position = "absolute";
		canvas.style.pointerEvents = "none";
		canvas.style.zIndex = "1";
		video.parentElement?.appendChild(canvas);
		if (!initWebGL()) {
			logger.warn("black-to-transparent", "Failed to initialize WebGL, falling back to CPU");
			ctx2d = canvas.getContext("2d", { alpha: true });
			if (!ctx2d) {
				logger.error("black-to-transparent", "Failed to initialize 2D context, stopping render loop");
				return;
			}
			useCPU = true;
		}
	}

	const rect = video.getBoundingClientRect();
	const parentRect = video.parentElement?.getBoundingClientRect() || { top: 0, left: 0 };

	if (canvas.style.display !== "block") {
		logger.info("black-to-transparent", "Showing canvas");
		canvas.style.display = "block";
	}

	Object.assign(canvas.style, {
		width: `${rect.width}px`,
		height: `${rect.height}px`,
		top: `${rect.top - parentRect.top}px`,
		left: `${rect.left - parentRect.left}px`,
	});

	// Match canvas internal resolution to the element size, not the video source
	if (canvas.width !== Math.floor(rect.width) || canvas.height !== Math.floor(rect.height)) {
		canvas.width = Math.floor(rect.width);
		canvas.height = Math.floor(rect.height);
		if (!useCPU) {
			gl?.viewport(0, 0, canvas.width, canvas.height);
		}
	}

	if (!useCPU && gl && program && videoTexture && canvas.width > 0) {
		if (video.style.opacity !== "0") {
			logger.info("black-to-transparent", "Setting video opacity to 0 and starting to draw frames");
			video.style.opacity = "0";
		}
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.bindTexture(gl.TEXTURE_2D, videoTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	} else if (useCPU && ctx2d) {
		if (video.style.opacity !== "0") {
			video.style.opacity = "0";
		}
		ctx2d.drawImage(video, 0, 0, canvas.width, canvas.height);
		const imgData = ctx2d.getImageData(0, 0, canvas.width, canvas.height);
		const data = imgData.data;
		for (let i = 0; i < data.length; i += 4) {
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];
			const v = Math.max(r, g, b);
			data[i + 3] = v;
		}
		ctx2d.putImageData(imgData, 0, 0);
	} else {
		if (video.style.opacity !== "1") {
			logger.warn(
				"black-to-transparent",
				"Missing GL resources or invalid canvas width, reverting to video display",
				{
					gl: !!gl,
					program: !!program,
					videoTexture: !!videoTexture,
					canvasWidth: canvas.width,
				},
			);
			video.style.opacity = "1";
		}
	}

	scheduleNext();
}

export async function setupBlackToTransparent() {
	const isEnabled = await getUserSetting("ExperimentalBlackToTransparent");
	logger.info("black-to-transparent", "Setting up BlackToTransparent. Enabled in settings:", isEnabled);
	if (!isEnabled) return;
	if (enabled) {
		logger.info("black-to-transparent", "Already enabled, skipping setup");
		return;
	}
	enabled = true;

	render();

	navigateCleanup = onYoutubeNavigate(() => {
		logger.info("black-to-transparent", "Youtube navigate detected, resetting canvas");
		if (canvas) {
			canvas.remove();
			canvas = null;
			gl = null;
			program = null;
			videoTexture = null;
		}
		render();
	});

	fullscreenCleanup = onYoutubeFullscreen((fullscreen) => {
		logger.info("black-to-transparent", "Fullscreen changed:", fullscreen);
		if (fullscreen && canvas) {
			canvas.style.display = "none";
			getVideoElement().then((v) => {
				if (v) v.style.opacity = "1";
			});
		}
	});
}

export function destroyBlackToTransparent() {
	logger.info("black-to-transparent", "Destroying BlackToTransparent");
	enabled = false;
	if (animationFrame) cancelAnimationFrame(animationFrame);
	if (renderTimeout) clearTimeout(renderTimeout);
	if (navigateCleanup) navigateCleanup();
	if (fullscreenCleanup) fullscreenCleanup();

	if (canvas) {
		canvas.remove();
		canvas = null;
		gl = null;
		program = null;
		videoTexture = null;
	}

	getVideoElement().then((video) => {
		if (video) video.style.opacity = "1";
	});
}

registerSettingListener("ExperimentalBlackToTransparent", (val) => {
	logger.info("black-to-transparent", "Setting listener triggered:", val);
	if (val) {
		setupBlackToTransparent();
	} else {
		destroyBlackToTransparent();
	}
});
