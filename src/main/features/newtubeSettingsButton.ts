import { extensionSettingsUi, extensionSettingsUiPromise } from "../../styleshift/ui/extensionSettings";
import { waitForElement } from "../../styleshift/shared/normal";
import { onYoutubeNavigate } from "../modules/youtube";

let navigateCleanup: (() => void) | null = null;

/**
 * Injects the NewTube settings button (✦) into the YouTube top bar.
 */
export async function injectSettingsButton() {
	const target = await waitForElement(
		"ytmusic-nav-bar #right-content, #masthead-container #end, ytd-masthead #end, #end.ytd-masthead, #container > #end",
	);
	if (!target) {
		return;
	}

	// Avoid duplicate injection
	if (document.getElementById("NEWTUBESET")) return;

	const btn = document.createElement("button");
	btn.id = "NEWTUBESET";
	btn.innerHTML = "<span>✦</span>";
	btn.setAttribute("aria-label", "NewTube Settings");
	btn.title = "NewTube Settings";

	// Match legacy style exactly
	btn.style.cssText = `
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		border: transparent;
		color: var(--yt-spec-text-primary, white);
		text-align: center;
		font-size: 20px;
		transition: all 0.5s;
		margin: 5px;
		width: 50px;
		height: 40px;
		cursor: pointer;
		padding: 0;
		position: relative;
		flex-shrink: 0;
	`;

	// Add the legacy hover-arrow style via a temporary style tag or inline if possible
	// For simplicity and matching the user's request "don't change style",
	// let's ensure the span and after elements have the right properties.
	const span = btn.querySelector("span");
	if (span) {
		Object.assign(span.style, {
			display: "inline-block",
			position: "relative",
			transition: "0.5s",
		});
	}

	// We can't easily do :after in inline style, so we'll inject a small style block if not present
	if (!document.getElementById("NEWTUBESET_STYLE")) {
		const style = document.createElement("style");
		style.id = "NEWTUBESET_STYLE";
		style.textContent = `
			#NEWTUBESET {
				outline: none !important;
                box-shadow: none !important;
			}
			#NEWTUBESET span:after {
				content: '«';
				position: absolute;
				opacity: 0;
				top: 0;
				right: -20px;
				transition: 0.5s;
			}
			#NEWTUBESET:hover {
				color: var(--nt-theme-color, #6495ED) !important;
			}
			#NEWTUBESET:hover span {
				padding-right: 20px;
			}
			#NEWTUBESET:hover span:after {
				opacity: 1;
				right: 0;
			}
		`;
		document.head.appendChild(style);
	}

	btn.onclick = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		await extensionSettingsUiPromise;
		if (extensionSettingsUi) {
			extensionSettingsUi.toggle();
		}
	};

	target.appendChild(btn);
}

export function enableSettingsButton() {
	navigateCleanup = onYoutubeNavigate(injectSettingsButton);
	injectSettingsButton();
}

export function disableSettingsButton() {
	if (navigateCleanup) {
		navigateCleanup();
		navigateCleanup = null;
	}
	const btn = document.getElementById("NEWTUBESET");
	if (btn) btn.remove();
	const style = document.getElementById("NEWTUBESET_STYLE");
	if (style) style.remove();
}
