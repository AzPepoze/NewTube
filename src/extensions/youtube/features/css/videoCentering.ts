export const videoCenteringCss = `
div.html5-video-player video {
	position: unset !important;
}

div.html5-video-player,
div.html5-video-player.ytp-fullscreen div.html5-video-container {
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
}

.html5-video-container{
	position: revert !important;
	display: flex;
	align-items: center;
	overflow: hidden;
}

div.html5-video-player:not(.ytp-fullscreen) div.html5-video-container{
	width: fit-content !important;
	margin-top: unset !important;
	height: fit-content;
}
`;
