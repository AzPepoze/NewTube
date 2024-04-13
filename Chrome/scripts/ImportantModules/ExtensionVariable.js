var Ver = chrome.runtime.getManifest().version
var DebugMode = false

var isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

var inIframe
try {
     inIframe = window.self !== window.top;
} catch (e) {
     inIframe = true;
}

var DefaultYouTubeLogo = `https://www.youtube.com/s/desktop/6588612c/img/favicon.ico`
var DefaultNewTubeLogo = `https://i.ibb.co/tD2VTyg/1705431438657.png`

var RunAfterLoaded = {
     NormalYoutube : [],
     MiniPlayerYoutube : [],
     AllYoutubeMode : [],
     RunFirst:[],
}

var ExtensionID = chrome.runtime.getURL('').slice(19, -1)