let DebugPerformace = false

// Vertex shader program
const vsSource = `
attribute vec2 a_position;
varying vec2 v_texCoord;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_position*.5+.5;
    v_texCoord.y = 1.-v_texCoord.y;
}`

// Fragment shader program
const fsSource = `
precision mediump float;

uniform sampler2D u_image;
varying vec2 v_texCoord;

const float BlurQua = 30.0;
const float Pi = 6.28318530718;//pi * 2
uniform vec2 u_BlurAm;
uniform float u_Smooth;
uniform vec2 canvasRes;

vec4 applyBlur(sampler2D image,vec2 BlurDirection) {
    if (u_BlurAm == vec2(0,0)) {
        return texture2D(image, v_texCoord);
    }
    vec2 CalBlur = BlurDirection/canvasRes;
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

    return color/total;
}

void main() {
    gl_FragColor = applyBlur(u_image,u_BlurAm) * u_Smooth;
}`;

const fsSource2 = `
precision mediump float;

uniform sampler2D u_image;
varying vec2 v_texCoord;

void main() {
    gl_FragColor = texture2D(u_image, v_texCoord) * vec4(1,1,1,0.5);
}
`;

// Initialize shader program
var shaderProgram
var PreshaderProgram

// look up where the vertex data needs to go.
var positionLocation
var Pre_positionLocation

var u_BlurAm
var u_Smooth

var Pre_u_BlurAm
var Pre_u_Smooth

var textureLoc
var Pre_textureLoc

// Create a vertex buffer
var positionBuffer
var Pre_positionBuffer

var Pre_colorBuffer

// Create texture
var texture
var Pre_texture

const positionData = new Float32Array([
     -1.0, -1.0,
     1.0, -1.0,
     -1.0, 1.0,
     1.0, -1.0,
     1.0, 1.0,
     -1.0, 1.0
]);

// Initialize a shader program, so BackgroundWebGL knows how to draw our data
function WebGLinitShaderProgram(ThisGL, vsSource, fsSource) {
     var ThisshaderProgram = ThisGL.createProgram();
     ThisGL.attachShader(ThisshaderProgram, WebGLloadShader(ThisGL, ThisGL.VERTEX_SHADER, vsSource));
     ThisGL.attachShader(ThisshaderProgram, WebGLloadShader(ThisGL, ThisGL.FRAGMENT_SHADER, fsSource));
     ThisGL.linkProgram(ThisshaderProgram);

     // If creating the shader program failed, alert
     if (!ThisGL.getProgramParameter(ThisshaderProgram, ThisGL.LINK_STATUS)) {
          console.error('Unable to initialize the shader program: ' + ThisGL.getProgramInfoLog(ThisshaderProgram));
          return null;
     }

     return ThisshaderProgram;
}

// creates a shader of the given type, uploads the source and compiles it.
function WebGLloadShader(BackgroundWebGL, type, source) {
     const shader = BackgroundWebGL.createShader(type);
     BackgroundWebGL.shaderSource(shader, source);
     BackgroundWebGL.compileShader(shader);

     // See if it compiled successfully
     if (!BackgroundWebGL.getShaderParameter(shader, BackgroundWebGL.COMPILE_STATUS)) {
          console.error('An error occurred compiling the shaders: ' + BackgroundWebGL.getShaderInfoLog(shader));
          BackgroundWebGL.deleteShader(shader);
          return null;
     }

     return shader;
}

var BackgroundVideoContainer,

     BackgroundVideoCanvas,
     BackgroundVideoContext,
     BackgroundVideoWidth,
     BackgroundVideoHeight,

     Precanvas,
     Precontext,
     Pregl,

     BlackOverlay,
     CanvasContainer,

     YTAPP,
     BGFRAME,

     BackgroundWebGL

var NowCanvasQuality,
     VideoBound,
     CanvasWraperbound,
     VdoHeight,
     CanvasQuality = 0.5

function ChangeCanvasQua() {
     if (VideoBound) {
          if (DebugPerformace) console.log("Change Canvas Quality")

          NowCanvasQuality = CanvasQuality

          BackgroundVideoWidth = Math.floor(Math.floor(VideoBound.width) * NowCanvasQuality)
          BackgroundVideoHeight = Math.floor(Math.floor(VideoBound.height) * NowCanvasQuality)

          Precanvas.width = BackgroundVideoWidth
          Precanvas.height = BackgroundVideoHeight

          BackgroundVideoCanvas.width = BackgroundVideoWidth
          BackgroundVideoCanvas.height = BackgroundVideoHeight

          if (GPURender) {
               BackgroundWebGL.viewport(0, 0, BackgroundVideoWidth, BackgroundVideoHeight);
               BackgroundWebGL.uniform2f(gl_Resolution, BackgroundVideoWidth, BackgroundVideoHeight);

               Pregl.viewport(0, 0, BackgroundVideoWidth, BackgroundVideoHeight);
          }
     }
}

var tempCanvas = null,
     tempCanvas2 = null

function SaveBackgroundFrame() {
     try {
          tempCanvas = Precontext.getImageData(0, 0, BackgroundVideoWidth, BackgroundVideoHeight);
          tempCanvas2 = BackgroundVideoContext.getImageData(0, 0, BackgroundVideoWidth, BackgroundVideoHeight);
     } catch { }
}

function LoadBackgroundFrame() {
     try {
          Precontext.putImageData(tempCanvas, 0, 0)
          BackgroundVideoContext.putImageData(tempCanvas2, 0, 0)
          tempCanvas = null
          tempCanvas2 = null
     } catch { }
}

async function SetCanvas() {
     await FindVideo()
     if (BackgroundVideoCanvas && v.getAttribute("NewtubeFlyout") == null) {
          await GetVideoBound()

          VcenY = VideoBound.top + VideoBound.height / 2
          CanvasWraperbound = CanvasContainer.getBoundingClientRect()

          var Distance = (VcenY) - (CanvasWraperbound.top + CanvasWraperbound.height / 2)

          if (Distance < 0) {
               Distance = Distance * -1
          }

          if (NowCanvasQuality != CanvasQuality) {
               ChangeCanvasQua()
          }

          if (Distance > 1) {
               // console.log("SetCanvasPo")

               CanvasContainer.style.setProperty('margin-top', VideoBound.top + window.pageYOffset + 'px')
               CanvasContainer.style.setProperty('margin-left', VideoBound.left + window.pageXOffset + 'px')
          }

          VdoWith = VideoBound.width + "px"

          if (BackgroundVideoCanvas.style.width != VdoWith) {
               // console.log("SetCanvasSize")

               let KeeplastFrame = true
               if (BackgroundVideoCanvas.style.width == "0px") {
                    KeeplastFrame = false
               }

               VdoHeight = VideoBound.height + "px"

               let cwNotNaN = !isNaN(BackgroundVideoWidth)

               if (KeeplastFrame == true && cwNotNaN && GPURender == false) {
                    SaveBackgroundFrame()
               }

               CanvasContainer.style.width = VdoWith
               CanvasContainer.style.height = VdoHeight

               BackgroundVideoCanvas.style.width = VdoWith
               BackgroundVideoCanvas.style.height = VdoHeight

               ChangeCanvasQua()

               if (tempCanvas && KeeplastFrame == true && cwNotNaN) {
                    LoadBackgroundFrame()
               }

               var CalOverlay
               if (VideoBound.height <= VideoBound.width) {
                    CalOverlay = VideoBound.height * 0.2
               } else {
                    CalOverlay = VideoBound.width * 0.2
               }

               BlackOverlay.style.boxShadow = `inset black 0px 0px ${CalOverlay}px ${CalOverlay}px`
          }
     }
}

async function ContinueBackgroundVideo() {
     console.log("Continue")
     ContinueDrawing = true
     SetCanvas()
     SetBGTran(true)
     StartTime = performance.now()
     NowLaggedFrame = 0
     NoWaitFrame = true
     RenderBackground()
     await sleep(1000)
     if (BackgroundVideoContainer) BackgroundVideoContainer.style.opacity = 1
}

async function PauseBackgroundVideo() {
     console.log("Pause")
     ContinueDrawing = false
     if (BackgroundVideoContainer) BackgroundVideoContainer.style.opacity = 0
     SetBGTran(false)
}

var NewtubeBackground
var Background_Video_StyleSheet = Create_StyleSheet()

async function SetBGTran(Status, attempt) {

     if (attempt == 0) {
          return
     }

     if (!attempt) {
          attempt = 10
     }

     attempt -= 1
     NewtubeBackground = document.getElementById("NewtubeBackground")

     if (!NewtubeBackground) {
          await sleep(100)
          return await SetBGTran(Status, attempt)
     }

     if (Status == true) {
          Background_Video_StyleSheet.textContent = `
          #NewtubeTint{
               background:black !important;
          }`
          NewtubeBackground.style.opacity = 0
     } else {
          Background_Video_StyleSheet.textContent = ``
          NewtubeBackground.style.opacity = 1
     }
}


let StartTime
let NewTime
let GPURender = true
let FrameTime

let MaxLaggedFrame = 10
let NowLaggedFrame = 0

async function FoundBackgroundVideoLag() {
     if (confirm(`
NEWTUBE : I see that you so laggy.
(I guess it cause by Background Video)
                
Solution to fix this laggy:
1.Try enable "Use hardware acceleration when available" in your browser setting.
2.If your graphic card is quite poor try change Background Video to renders by CPU.
3.Try decrease quality of Background Video

Are you want to disable Background Video?
(You can turn it back on later)`)) {
          await Save("VDOBG", false)
     }
}

var NoWaitFrame

async function RenderBackgroundVideoFrame(globalAlpha) {

     NewTime = performance.now()
     FrameTime = NewTime - StartTime

     if (FrameTime > 150 && !await CheckStaticVDO()) {
          console.log("PerFrame", FrameTime)
          if (NowLaggedFrame < MaxLaggedFrame) {
               NowLaggedFrame++
               console.log(NowLaggedFrame)
          } else {
               FoundBackgroundVideoLag()
               NowLaggedFrame = 0
          }
     } else {
          NowLaggedFrame = 0
     }

     if (DebugPerformace) {
          console.log("----------------------------------------")

          console.log("PerFrame", FrameTime)

          console.log("Draw")

          StartTime = performance.now()
     }

     SetCanvas()

     if (DebugPerformace) {
          NewTime = performance.now()
          console.log("SetCanvas", NewTime - StartTime)
     }

     Scale = 1

     if (GPURender) {
          // Pregl.vertexAttribPointer(Pre_colorBuffer, 2, Pregl.UNSIGNED_BYTE, false, 4, 0);
          Pregl.vertexAttribPointer(Pre_positionLocation, 2, Pregl.FLOAT, false, 0, 0);

          Pregl.uniform1f(Pre_u_Smooth, globalAlpha);

          Pregl.texImage2D(Pregl.TEXTURE_2D, 0, Pregl.RGB, Pregl.RGB, Pregl.UNSIGNED_BYTE, v);
          Pregl.drawArrays(Pregl.TRIANGLES, 0, 6);

          //-----------------------------------------------------------------------------------

          BackgroundWebGL.vertexAttribPointer(positionLocation, 2, BackgroundWebGL.FLOAT, false, 0, 0);

          BackgroundWebGL.uniform2f(u_BlurAm, BackgroundVideoBlur, 0);

          BackgroundWebGL.texImage2D(BackgroundWebGL.TEXTURE_2D, 0, BackgroundWebGL.RGB, BackgroundWebGL.RGB, BackgroundWebGL.UNSIGNED_BYTE, Precanvas);
          BackgroundWebGL.drawArrays(BackgroundWebGL.TRIANGLES, 0, 6);


          BackgroundWebGL.uniform2f(u_BlurAm, 0, BackgroundVideoBlur);

          BackgroundWebGL.texImage2D(BackgroundWebGL.TEXTURE_2D, 0, BackgroundWebGL.RGB, BackgroundWebGL.RGB, BackgroundWebGL.UNSIGNED_BYTE, BackgroundVideoCanvas);
          BackgroundWebGL.drawArrays(BackgroundWebGL.TRIANGLES, 0, 6);

          // BackgroundWebGL.uniform2f(u_BlurAm, BackgroundVideoBlur/1000, 0);
          // BackgroundWebGL.texImage2D(BackgroundWebGL.TEXTURE_2D, 0, BackgroundWebGL.RGB, BackgroundWebGL.RGB, BackgroundWebGL.UNSIGNED_BYTE, BackgroundVideoCanvas);
          // drawScene(shaderProgram);
     } else {

          Precontext.globalAlpha = globalAlpha

          try {
               BackgroundVideoContext.filter = `blur(${BackgroundVideoBlur}px)`
          } catch (error) {

          }


          if (globalAlpha == 1) {
               try {
                    BackgroundVideoContext.drawImage(v, (BackgroundVideoWidth * (1 - Scale) / 2), (BackgroundVideoHeight * (1 - Scale) / 2), BackgroundVideoWidth * Scale, BackgroundVideoHeight * Scale);
               } catch (error) {
                    NoWaitFrame = true
                    return
               }
          } else {
               Precontext.drawImage(v, (BackgroundVideoWidth * (1 - Scale) / 2), (BackgroundVideoHeight * (1 - Scale) / 2), BackgroundVideoWidth * Scale, BackgroundVideoHeight * Scale);
               try {
                    BackgroundVideoContext.drawImage(Precanvas, 0, 0, BackgroundVideoWidth, BackgroundVideoHeight);
               } catch (error) {
                    NoWaitFrame = true
                    return
               }
          }
     }

     if (DebugPerformace) {
          NewTime = performance.now()
          console.log("Drawed", NewTime - StartTime)
     }

     // if (BlackMode == true) {
     //      ReBlackctx.drawImage(v, 0, 0, VideoBound.width, VideoBound.height);
     //      frame = ReBlackctx.getImageData(0, 0, VideoBound.width, VideoBound.height)
     //      l = frame.data.length / 4
     //      for (let i = 0; i < l; i++) {
     //           frame.data[i * 4 + 3] = (frame.data[i * 4 + 0] * 10 +
     //                frame.data[i * 4 + 1] * 10 +
     //                frame.data[i * 4 + 2] * 10) / 10
     //      }
     //      ReBlackctx.putImageData(frame, 0, 0)
     // }

     StartTime = performance.now()

     NoWaitFrame = true
}


var ContinueDrawing = false


function SetCanvasEveryFrame() {
     if (CanSetCanvasEveryFrame) {
          SetCanvas()
     }
     if (RunningSetCanvasEveryFrame == true) requestAnimationFrame(SetCanvasEveryFrame)
}

var BackgroundVideoSmooth

var RunningBackgroundVideo
var RunningSetCanvasEveryFrame

var CanDrawOnStatic = true
var CanSetCanvasEveryFrame

async function RenderBackground() {
     if (!RunningBackgroundVideo) {
          RunningBackgroundVideo = await RunFunctionWithVideo(
               async function (StaticVDO) {
                    if (ContinueDrawing) {
                         if (StaticVDO) {
                              await RenderBackgroundVideoFrame(1)
                         } else {
                              await RenderBackgroundVideoFrame(BackgroundVideoSmooth)
                         }
                    }
               },

               PauseBackgroundVideo,

               async function () {
                    if (CanDrawOnStatic) {
                         CanDrawOnStatic = false
                         await RenderBackgroundVideoFrame(1)
                         await sleep(1000)
                         CanDrawOnStatic = true
                    }
               }
          )
     }
     if (!RunningSetCanvasEveryFrame) {
          RunningSetCanvasEveryFrame = true
          SetCanvasEveryFrame()
     }
}

var BackgroundVideoContainer

async function CreateBackgroundCanvas(SkipTweenOpacity) {
     await FindVideo()
     YTAPP = document.getElementsByTagName('ytd-app')[0] || document.getElementsByTagName('ytmusic-app')[0]
     ContinueDrawing = false

     if (BackgroundVideoContainer == null) {
          console.log("CreateNew")
          Precanvas = new OffscreenCanvas(10, 10)
          BackgroundVideoCanvas = document.createElement('canvas');
          BackgroundVideoContainer = document.createElement('div')
          CanvasContainer = document.createElement('div')
          CanvasContainer.style = `position:relative;
          background:black;`
          CanvasContainer.id = `NewtubeCanvasWraper`
          YTAPP.append(BackgroundVideoContainer)
          BackgroundVideoContainer.style = `width: 100%;
                 height: 100%;
                 top: 0px;
                 position: absolute;
                 overflow: hidden;
                 z-index: -1;
                 transition: opacity 0.5s;
                 }`
          BackgroundVideoCanvas.id = "NewtubeBlurBG"
          BackgroundVideoCanvas.style = `
          position:absolute;
          z-index:0;`

          if (SkipTweenOpacity) {
               BackgroundVideoContainer.style.opacity = 1
          } else {
               BackgroundVideoContainer.style.opacity = 0
          }


          BlackOverlay = document.createElement('div')
          BlackOverlay.id = "black-overlay"
          BlackOverlay.style = `
          position:absolute;
          padding: 1px;
          width:100%;
          height:100%;
          z-index:1;`
          BackgroundVideoContainer.append(CanvasContainer)
          CanvasContainer.append(BlackOverlay)
          CanvasContainer.append(BackgroundVideoCanvas)
     }

     if (GPURender) {
          await SetUpWebGL()
     } else {
          BackgroundVideoContext = BackgroundVideoCanvas.getContext('2d', { alpha: false })
          BackgroundVideoContext.imageSmoothingEnabled = false
          Precontext = Precanvas.getContext('2d', { alpha: false })
     }

     ChangeCanvasQua()

     await sleep(0)

     CheckBackgroundVideoState()
}

async function SetUpWebGL() {
     Pregl = Precanvas.getContext("webgl2", { preserveDrawingBuffer: true });

     PreshaderProgram = WebGLinitShaderProgram(Pregl, vsSource, fsSource);

     Pregl.blendFunc(Pregl.ONE, Pregl.ONE_MINUS_SRC_ALPHA);
     Pregl.enable(Pregl.BLEND);

     Pre_positionLocation = Pregl.getAttribLocation(PreshaderProgram, "a_position");
     Pre_textureLoc = Pregl.getUniformLocation(PreshaderProgram, "u_image");

     Pre_u_BlurAm = Pregl.getUniformLocation(PreshaderProgram, "u_BlurAm");
     Pre_u_Smooth = Pregl.getUniformLocation(PreshaderProgram, "u_Smooth");

     Pre_positionBuffer = Pregl.createBuffer();
     Pregl.bindBuffer(Pregl.ARRAY_BUFFER, Pre_positionBuffer);
     Pregl.bufferData(Pregl.ARRAY_BUFFER, positionData, Pregl.STATIC_DRAW);

     // Pre_colorBuffer = Pregl.createBuffer();
     // Pregl.bindBuffer(Pregl.ARRAY_BUFFER, Pre_colorBuffer);
     // Pregl.bufferData(Pregl.ARRAY_BUFFER, new Float32Array(colorData), Pregl.STATIC_DRAW);

     Pregl.enableVertexAttribArray(Pre_positionLocation);
     Pregl.vertexAttribPointer(Pre_positionLocation, 2, Pregl.FLOAT, false, 0, 0);

     Pre_texture = Pregl.createTexture();
     Pregl.bindTexture(Pregl.TEXTURE_2D, Pre_texture);
     Pregl.texImage2D(Pregl.TEXTURE_2D, 0, Pregl.RGB, 1, 1, 0, Pregl.RGB, Pregl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0]));
     Pregl.texParameteri(Pregl.TEXTURE_2D, Pregl.TEXTURE_WRAP_S, Pregl.CLAMP_TO_EDGE);
     Pregl.texParameteri(Pregl.TEXTURE_2D, Pregl.TEXTURE_WRAP_T, Pregl.CLAMP_TO_EDGE);
     Pregl.texParameteri(Pregl.TEXTURE_2D, Pregl.TEXTURE_MIN_FILTER, Pregl.LINEAR);
     // Initialize rendering
     Pregl.viewport(0, 0, Pregl.canvas.width, Pregl.canvas.height);
     Pregl.clearColor(1.0, 0.0, 0.0, 1.0);

     Pregl.useProgram(PreshaderProgram);

     Pregl.uniform2f(Pre_u_BlurAm, 0, 0);

     //-------------------------------------------------------------------

     BackgroundWebGL = BackgroundVideoCanvas.getContext("webgl2");

     // Initialize shader program
     shaderProgram = WebGLinitShaderProgram(BackgroundWebGL, vsSource, fsSource);
     // shaderProgram2 = WebGLinitShaderProgram(BackgroundWebGL, vsSource, fsSource2);

     // look up where the vertex data needs to go.
     positionLocation = BackgroundWebGL.getAttribLocation(shaderProgram, "a_position");
     textureLoc = BackgroundWebGL.getUniformLocation(shaderProgram, "u_image");

     u_BlurAm = BackgroundWebGL.getUniformLocation(shaderProgram, "u_BlurAm");
     u_Smooth = BackgroundWebGL.getUniformLocation(shaderProgram, "u_Smooth");
     gl_Resolution = BackgroundWebGL.getUniformLocation(shaderProgram, "canvasRes");

     // Create a vertex buffer
     positionBuffer = BackgroundWebGL.createBuffer();
     BackgroundWebGL.bindBuffer(BackgroundWebGL.ARRAY_BUFFER, positionBuffer);
     BackgroundWebGL.bufferData(BackgroundWebGL.ARRAY_BUFFER, positionData, BackgroundWebGL.STATIC_DRAW);

     BackgroundWebGL.enableVertexAttribArray(positionLocation);
     BackgroundWebGL.vertexAttribPointer(positionLocation, 2, BackgroundWebGL.FLOAT, false, 0, 0);

     // Create texture
     texture = BackgroundWebGL.createTexture();
     BackgroundWebGL.bindTexture(BackgroundWebGL.TEXTURE_2D, texture);
     BackgroundWebGL.texImage2D(BackgroundWebGL.TEXTURE_2D, 0, BackgroundWebGL.RGB, 1, 1, 0, BackgroundWebGL.RGB, BackgroundWebGL.UNSIGNED_BYTE, new Uint8Array([0, 0, 0]));
     BackgroundWebGL.texParameteri(BackgroundWebGL.TEXTURE_2D, BackgroundWebGL.TEXTURE_WRAP_S, BackgroundWebGL.CLAMP_TO_EDGE);
     BackgroundWebGL.texParameteri(BackgroundWebGL.TEXTURE_2D, BackgroundWebGL.TEXTURE_WRAP_T, BackgroundWebGL.CLAMP_TO_EDGE);
     BackgroundWebGL.texParameteri(BackgroundWebGL.TEXTURE_2D, BackgroundWebGL.TEXTURE_MIN_FILTER, BackgroundWebGL.LINEAR);
     // Initialize rendering
     BackgroundWebGL.viewport(0, 0, BackgroundWebGL.canvas.width, BackgroundWebGL.canvas.height);
     BackgroundWebGL.clearColor(1.0, 0.0, 0.0, 1.0);

     BackgroundWebGL.useProgram(shaderProgram);

     BackgroundWebGL.uniform1f(u_Smooth, 1);
}

async function RemoveBackgroundCanvas() {
     if (BackgroundVideoContainer) {
          var Old = BackgroundVideoContainer
          PauseBackgroundVideo()
          BackgroundVideoContainer = null
          await sleep(2000)
          Old.remove()
     }
}

var EnabledBackgroundVideo = false

async function OnChangeBackgroundVideo() {
     if (await Load("EnableButton")) {
          if (await Load("VDOBG")) {
               if (!EnabledBackgroundVideo) {
                    EnabledBackgroundVideo = true
                    StartBackgroundVideo()
               }
          } else {
               if (EnabledBackgroundVideo) {
                    EnabledBackgroundVideo = false
                    StopBackgroundVideo()
               }
          }
     } else {
          if (EnabledBackgroundVideo) {
               EnabledBackgroundVideo = false
               StopBackgroundVideo()
          }
     }
}

async function StartBackgroundVideo(SkipTweenOpacity) {
     StartWatchVideoChange()
     CreateBackgroundCanvas(SkipTweenOpacity)
}

async function StopBackgroundVideo() {
     if (RunningBackgroundVideo) {
          RunningBackgroundVideo.Stop()
          RunningBackgroundVideo = null
     }
     RunningSetCanvasEveryFrame = false
     StopWatchVideoChange()
     RemoveBackgroundCanvas()
     SetBGTran()
}

async function UpdateBackgroundVideoSmooth() {
     BackgroundVideoSmooth = 1 / (await Load("VDOSmooth"))
     if (BackgroundVideoSmooth > 1) {
          BackgroundVideoSmooth = 1
     }
}

async function CheckBackgroundVideoState() {
     var FoundMainVideo = await FindMainVideo()

     if (ContinueDrawing == true && !FoundMainVideo) {
          PauseBackgroundVideo()
     }

     if (ContinueDrawing == false && FoundMainVideo) {
          ContinueBackgroundVideo()
     }
}

var WatchingVideoChangeClass

async function StartWatchVideoChange() {
     WatchingVideoChangeClass = await VideoChanged(CheckBackgroundVideoState)
     console.log(WatchingVideoChangeClass)
}

async function StopWatchVideoChange() {
     if (WatchingVideoChangeClass) {
          WatchingVideoChangeClass.Observe.disconnect()
     }
}

async function OnUpdateBackgroundVideoBlur() {
     BackgroundVideoBlur = await Load("NVDOB")
}

async function OnUpdateBackgroundVideoQuality() {
     CanvasQuality = (await Load("CanvasQua")) / 100
}

async function OnUpdateBackgroundVideoStick() {
     CanSetCanvasEveryFrame = await Load("BackgroundVDOStick")
}

async function OnUpdateBackgroundVideoRenderEngine() {
     if (await Load("RenderEngine") == "CPU") {
          if (GPURender == true) {
               StopBackgroundVideo()
               GPURender = false
               await sleep(1)
               StartBackgroundVideo(true)
          }
     }

     if (await Load("RenderEngine") == "GPU") {
          if (GPURender == false) {
               StopBackgroundVideo()
               GPURender = true
               await sleep(1)
               StartBackgroundVideo(true)
          }
     }
}

RunAfterLoaded.NormalYoutube.push(function () {
     UpdateBackgroundVideoSmooth()
     AddOnChangeFunction("VDOSmooth", UpdateBackgroundVideoSmooth)

     OnUpdateBackgroundVideoBlur()
     AddOnChangeFunction("NVDOB", OnUpdateBackgroundVideoBlur)

     OnUpdateBackgroundVideoQuality()
     AddOnChangeFunction("CanvasQua", OnUpdateBackgroundVideoQuality)

     OnUpdateBackgroundVideoRenderEngine()
     AddOnChangeFunction("RenderEngine", OnUpdateBackgroundVideoRenderEngine)

     OnUpdateBackgroundVideoStick()
     AddOnChangeFunction("BackgroundVDOStick", OnUpdateBackgroundVideoStick)

     OnChangeButton(
          "VDOBG",
          StartBackgroundVideo,
          StopBackgroundVideo
     )
})