import { logger } from "../../styleshift/utils/logger";

// --- Shaders ---
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
const float BlurQua = 30.0;
uniform vec2 u_BlurAm;
uniform float u_Alpha;
uniform vec2 canvasRes;

vec4 applyBlur(sampler2D image, vec2 BlurDirection) {
    if (u_BlurAm == vec2(0,0)) return texture2D(image, v_texCoord);
    vec2 CalBlur = BlurDirection / canvasRes;
    vec4 color = vec4(0.0);
    float total = 0.0;
    for (float i = -BlurQua; i <= BlurQua; i++) {
        float percent = (i - 0.5) / BlurQua;
        float weight = 1.0 - abs(percent);
        vec4 sample = texture2D(image, v_texCoord + CalBlur * percent);
        sample.rgb *= sample.a;
        color += sample * weight;
        total += weight;
    }
    return color / total;
}

void main() {
    vec4 color = applyBlur(u_image, u_BlurAm);
    gl_FragColor = color * u_Alpha;
}`;

const POSITION_DATA = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]);

let canvas: OffscreenCanvas | null = null;
let gl: WebGL2RenderingContext | null = null;
let ctx2d: OffscreenCanvasRenderingContext2D | null = null;

let preCanvas: OffscreenCanvas | null = null;
let preGl: WebGL2RenderingContext | null = null;
let preCtx2d: OffscreenCanvasRenderingContext2D | null = null;

let program: WebGLProgram | null = null;
let preProgram: WebGLProgram | null = null;

let videoTexture: WebGLTexture | null = null;
let blurTexture: WebGLTexture | null = null;

const uniformLocations = {
	mainBlurAmountLocation: null as WebGLUniformLocation | null,
	mainAlphaLocation: null as WebGLUniformLocation | null,
	mainResolutionLocation: null as WebGLUniformLocation | null,
	mainImageLocation: null as WebGLUniformLocation | null,
	preSmoothingAlphaLocation: null as WebGLUniformLocation | null,
	preBlurAmountLocation: null as WebGLUniformLocation | null,
	preResolutionLocation: null as WebGLUniformLocation | null,
	preImageLocation: null as WebGLUniformLocation | null,
};

let settings = {
	blur: 30,
	quality: 0.5,
	smooth: 1,
	engine: "GPU",
};

function loadShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
	const shader = gl.createShader(type);
	if (!shader) return null;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		logger.error("video-bg-worker", "Shader compile error:", gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

function initProgram(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram | null {
	const vShader = loadShader(gl, gl.VERTEX_SHADER, vs);
	const fShader = loadShader(gl, gl.FRAGMENT_SHADER, fs);
	if (!vShader || !fShader) return null;
	const prog = gl.createProgram();
	if (!prog) return null;
	gl.attachShader(prog, vShader);
	gl.attachShader(prog, fShader);
	gl.linkProgram(prog);
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
		logger.error("video-bg-worker", "Program link error:", gl.getProgramInfoLog(prog));
		return null;
	}
	return prog;
}

function init() {
	if (!canvas) return;

	if (settings.engine === "GPU") {
		gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true }) as WebGL2RenderingContext;
		if (gl) {
			preCanvas = new OffscreenCanvas(canvas.width, canvas.height);
			preGl = preCanvas.getContext("webgl2", {
				preserveDrawingBuffer: true,
			}) as WebGL2RenderingContext;
			program = initProgram(gl, vsSource, fsSource);
			preProgram = initProgram(preGl, vsSource, fsSource);

			if (program && preProgram) {
				gl.useProgram(program);
				const positionAttr = gl.getAttribLocation(program, "a_position");
				uniformLocations.mainBlurAmountLocation = gl.getUniformLocation(program, "u_BlurAm");
				uniformLocations.mainAlphaLocation = gl.getUniformLocation(program, "u_Alpha");
				uniformLocations.mainResolutionLocation = gl.getUniformLocation(program, "canvasRes");
				const uImageMain = gl.getUniformLocation(program, "u_image");
				gl.uniform1i(uImageMain, 0);

				const positionBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, POSITION_DATA, gl.STATIC_DRAW);
				gl.enableVertexAttribArray(positionAttr);
				gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);
				blurTexture = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, blurTexture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

				preGl.useProgram(preProgram);
				preGl.blendFunc(preGl.ONE, preGl.ONE_MINUS_SRC_ALPHA);
				preGl.enable(preGl.BLEND);
				const prePos = preGl.getAttribLocation(preProgram, "a_position");
				uniformLocations.preSmoothingAlphaLocation = preGl.getUniformLocation(preProgram, "u_Alpha");
				uniformLocations.preBlurAmountLocation = preGl.getUniformLocation(preProgram, "u_BlurAm");
				uniformLocations.preResolutionLocation = preGl.getUniformLocation(preProgram, "canvasRes");
				const uImagePre = preGl.getUniformLocation(preProgram, "u_image");
				preGl.uniform1i(uImagePre, 0);
				preGl.uniform2f(uniformLocations.preBlurAmountLocation, 0, 0);

				const pBuf = preGl.createBuffer();
				preGl.bindBuffer(preGl.ARRAY_BUFFER, pBuf);
				preGl.bufferData(preGl.ARRAY_BUFFER, POSITION_DATA, preGl.STATIC_DRAW);
				preGl.enableVertexAttribArray(prePos);
				preGl.vertexAttribPointer(prePos, 2, preGl.FLOAT, false, 0, 0);
				videoTexture = preGl.createTexture();
				preGl.bindTexture(preGl.TEXTURE_2D, videoTexture);
				preGl.texParameteri(preGl.TEXTURE_2D, preGl.TEXTURE_WRAP_S, preGl.CLAMP_TO_EDGE);
				preGl.texParameteri(preGl.TEXTURE_2D, preGl.TEXTURE_WRAP_T, preGl.CLAMP_TO_EDGE);
				preGl.texParameteri(preGl.TEXTURE_2D, preGl.TEXTURE_MIN_FILTER, preGl.LINEAR);
				logger.info("video-bg-worker", "WebGL2 initialized successfully");
			} else {
				settings.engine = "CPU";
			}
		} else {
			settings.engine = "CPU";
		}
	}

	if (settings.engine === "CPU") {
		ctx2d = canvas.getContext("2d", { alpha: false });
		preCanvas = new OffscreenCanvas(canvas.width, canvas.height);
		preCtx2d = preCanvas.getContext("2d", { alpha: true });
		logger.info("video-bg-worker", "CPU initialized successfully");
	}
}

function render(bitmap: ImageBitmap) {
	if (!canvas || !preCanvas) return;

	const tw = bitmap.width;
	const th = bitmap.height;

	if (canvas.width !== tw) {
		canvas.width = tw;
		canvas.height = th;
		preCanvas.width = tw;
		preCanvas.height = th;
		if (gl) gl.viewport(0, 0, tw, th);
		if (preGl) preGl.viewport(0, 0, tw, th);
	}

	const alpha = 1.0 / settings.smooth;

	if (settings.engine === "GPU" && gl && preGl) {
		// Pass 0: Smoothing
		preGl.useProgram(preProgram);
		preGl.bindTexture(preGl.TEXTURE_2D, videoTexture);
		preGl.texImage2D(preGl.TEXTURE_2D, 0, preGl.RGB, preGl.RGB, preGl.UNSIGNED_BYTE, bitmap);
		preGl.uniform1f(uniformLocations.preSmoothingAlphaLocation, alpha);
		if (uniformLocations.preBlurAmountLocation) preGl.uniform2f(uniformLocations.preBlurAmountLocation, 0, 0);
		preGl.drawArrays(preGl.TRIANGLES, 0, 6);

		// Pass 1: Horizontal Blur
		gl.useProgram(program);
		gl.bindTexture(gl.TEXTURE_2D, blurTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, preCanvas);
		gl.uniform2f(uniformLocations.mainBlurAmountLocation, settings.blur, 0);
		gl.uniform2f(uniformLocations.mainResolutionLocation, canvas.width, canvas.height);
		gl.uniform1f(uniformLocations.mainAlphaLocation, 1.0);
		gl.drawArrays(gl.TRIANGLES, 0, 6);

		// Pass 2: Vertical Blur
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, canvas);
		gl.uniform2f(uniformLocations.mainBlurAmountLocation, 0, settings.blur);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	} else if (ctx2d && preCtx2d) {
		preCtx2d.globalAlpha = alpha;
		preCtx2d.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
		ctx2d.filter = `blur(${settings.blur}px)`;
		ctx2d.drawImage(preCanvas, 0, 0, canvas.width, canvas.height);
	}

	bitmap.close();
}

self.onmessage = (e) => {
	const { type, data } = e.data;
	switch (type) {
		case "init":
			canvas = data.canvas;
			settings = data.settings;
			init();
			break;
		case "updateSettings":
			settings = { ...settings, ...data };
			break;
		case "render":
			render(data.bitmap);
			break;
	}
};
