import { getVideoElement } from "../../modules/youtube";
import { logger } from "@/shared/logger";

let pipHandler: ((ev: Event) => any) | null = null;
let pipExitHandler: ((ev: Event) => any) | null = null;

export function enableAutoPip() {
	if (pipHandler) {
		logger.debug("pip", "Auto PiP already enabled");
		return;
	}

	pipHandler = async () => {
		try {
			logger.debug("pip", "Visibility changed, checking conditions...");
			const video = await getVideoElement();

			if (!video) {
				logger.debug("pip", "Video element not found");
				return;
			}

			const isHidden = document.hidden;
			const isNotPaused = !video.paused;
			const notInPip = !document.pictureInPictureElement;

			logger.debug("pip", `State - Hidden: ${isHidden}, Playing: ${isNotPaused}, NotInPiP: ${notInPip}`);

			if (isHidden && isNotPaused && notInPip) {
				logger.debug("pip", "Entering PiP mode");
				await video.requestPictureInPicture();
				logger.debug("pip", "Successfully entered PiP mode");
			} else {
				logger.debug("pip", "Conditions not met for PiP entry");
			}
		} catch (error) {
			if (error instanceof Error && error.name !== "NotSupportedError") {
				logger.error("pip", "AutoPiP Error:", error instanceof Error ? error.message : String(error));
			}
		}
	};

	document.addEventListener("visibilitychange", pipHandler);
	logger.debug("pip", "Auto PiP enabled");
}

export function disableAutoPip() {
	if (pipHandler) {
		document.removeEventListener("visibilitychange", pipHandler);
		pipHandler = null;
		logger.debug("pip", "Auto PiP disabled");
	}
}

export function enableAutoExitPip() {
	if (pipExitHandler) {
		logger.debug("pip", "Auto Exit PiP already enabled");
		return;
	}

	pipExitHandler = async () => {
		try {
			logger.debug("pip", "Visibility changed, checking exit conditions...");
			const isNotHidden = !document.hidden;
			const inPip = !!document.pictureInPictureElement;

			logger.debug("pip", `Exit State - Visible: ${isNotHidden}, InPiP: ${inPip}`);

			if (isNotHidden && inPip) {
				logger.debug("pip", "Exiting PiP mode");
				await document.exitPictureInPicture();
				logger.debug("pip", "Successfully exited PiP mode");
			} else {
				logger.debug("pip", "Conditions not met for PiP exit");
			}
		} catch (error) {
			if (error instanceof Error && error.name !== "NotSupportedError") {
				logger.error("pip", "AutoExitPiP Error:", error instanceof Error ? error.message : String(error));
			}
		}
	};

	document.addEventListener("visibilitychange", pipExitHandler);
	logger.debug("pip", "Auto Exit PiP enabled");
}

export function disableAutoExitPip() {
	if (pipExitHandler) {
		document.removeEventListener("visibilitychange", pipExitHandler);
		pipExitHandler = null;
		logger.debug("pip", "Auto Exit PiP disabled");
	}
}
