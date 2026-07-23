export const playerEnhancementsCss = `
.ytp-gradietop{
	border-radius: var(--nt-player-radius) var(--nt-player-radius) 0px 0px;
}

.ytp-right-controls{
	flex-wrap: nowrap;
	display: flex;
}

.ytp-large-play-button.ytp-button:hover path.ytp-large-play-button-bg{
	filter: drop-shadow(0px 0px 6px black);
}

.ytp-large-play-button.ytp-button *{
	overflow: visible !important;
}

.ytp-progress-list,
.YtProgressBarLineProgressBarBackground
{
	background: var(--nt-timeline-bg) !important;
}

.ytp-load-progress,
.YtProgressBarLineProgressBarLoaded
{
	background: var(--nt-timeline-load) !important;
}

#play
{
	display:none !important; 
}

.ytp-gradient-bottom
{
	display: block !important;
	padding: 0px !important;
}

div.ended-mode video,
div.unstarted-mode:not(.ytp-small-mode) video.html5-main-video{
	background: black;
}

div.ytp-cued-thumbnail-overlay{
	overflow:hidden !important;
}

div.unstarted-mode .ytp-cued-thumbnail-overlay .ytp-large-play-button .ytp-large-play-button-bg,
div.unstarted-mode .ytp-cued-thumbnail-overlay .ytp-large-play-button:hover path[d="M 45,24 27,14 27,34"]
{
	fill:black !important;
}

.ytp-autonav-toggle-button,
.ytp-autonav-toggle-button[aria-checked="true"]::after{
	background-image: none !important;
}

.ytp-autonav-toggle-button[aria-checked="true"]::after{
	-webkit-mask-box-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxNyAxNyIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNyA4LjVhOC41IDguNSAwIDExLTE3IDAgOC41IDguNSAwIDExMTcgMHptLTUgMEw2LjUgNXY3TDEyIDguNXptLTEuODYgMEw3LjUgNi44MnYzLjM2bDIuNjQtMS42OHpNOC41IDE2YTcuNSA3LjUgMCAxMDAtMTUgNy41IDcuNSAwIDAwMCAxNXoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjE1IiAvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTYgOC41YTcuNSA3LjUgMCAxMS0xNSAwIDcuNSA3LjUgMCAwMTE1IDB6bS00IDBMNi41IDEyVjVMMTIgOC41eiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=")
}

.ytp-autonav-toggle-button[aria-checked="false"]::after{
	background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxNyAxNyIgZmlsbD0ibm9uZSI+PGRlZnMgLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTguNSAxNmE3LjUgNy41IDAgMTAwLTE1IDcuNSA3LjUgMCAwMDAgMTV6IiBmaWxsPSIjNzE3MTcxIiAvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTcgOC41YTguNSA4LjUgMCAxMS0xNyAwIDguNSA4LjUgMCAwMTE3IDB6bS0xIDBhNy41IDcuNSAwIDExLTE1IDAgNy41IDcuNSAwIDAxMTUgMHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjE1IiAvPjxwYXRoIGQ9Ik01LjUgMTJoMlY1aC0ydjd6TTkuNSA1djdoMlY1aC0yeiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=")
}

.ytp-autonav-endscreen-countdown-overlay {
	position: absolute;
	height: 100%;
	top: 0;
}

.videowall-endscreen{
	background: black;
	height: 100%;
}

.video.ytd-miniplayer{
	background:black;
}

.ytp-chapter-title-content{
	display: flex;
	align-items: center;
}

.ytp-chapter-title.ytp-button:hover::after{
	background: transparent !important;
}
`;
