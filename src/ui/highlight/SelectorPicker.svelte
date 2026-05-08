<script lang="ts">
	import { generateSelectors } from "./selectorUtils";
	import { logger } from "@shared/logger";
	import { onMount, onDestroy } from "svelte";
	import { showUserConfirmation } from "@ui/window/windowFactory";

	let { onSelect, onClose } = $props<{
		onSelect: (selector: string) => void;
		onClose: () => void;
	}>();

	let picking = $state(true);
	let hoveredElement = $state<HTMLElement | null>(null);
	let suggestedSelectors = $state<string[]>([]);
	let showSuggestions = $state(false);
	let menuPosition = $state({ x: 0, y: 0 });

	let overlay = $state<HTMLDivElement | null>(null);

	function teleport(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				node.remove();
			}
		};
	}

	function handleMouseMove(e: MouseEvent) {
		if (!picking || showSuggestions) return;

		const elements = document.elementsFromPoint(e.clientX, e.clientY);
		let target: HTMLElement | null = null;

		for (const el of elements) {
			const htmlEl = el as HTMLElement;
			const isInternal = htmlEl.closest(".STYLESHIFT-Main") || 
							   htmlEl.closest(".STYLESHIFT-Window-Container") ||
							   htmlEl.classList.contains("selection-overlay") ||
							   htmlEl.classList.contains("STYLESHIFT-Highlight");

			if (!isInternal) {
				target = htmlEl;
				break;
			}
		}
		
		if (target !== hoveredElement) {
			hoveredElement = target;
			if (target) {
				setTimeout(() => updateOverlay(), 0);
			}
		}
	}

	function updateOverlay() {
		if (!hoveredElement || !overlay) return;
		const rect = hoveredElement.getBoundingClientRect();
		overlay.style.top = `${rect.top}px`;
		overlay.style.left = `${rect.left}px`;
		overlay.style.width = `${rect.width}px`;
		overlay.style.height = `${rect.height}px`;
	}

	function handleClick(e: MouseEvent) {
		if (!picking || !hoveredElement || showSuggestions) return;
		
		e.preventDefault();
		e.stopPropagation();

		let x = e.clientX;
		let y = e.clientY;
		const menuWidth = 280;
		const menuHeight = 350;

		if (x + menuWidth > window.innerWidth) {
			x = window.innerWidth - menuWidth - 20;
		}
		if (y + menuHeight > window.innerHeight) {
			y = window.innerHeight - menuHeight - 20;
		}

		menuPosition = { x, y };
		suggestedSelectors = generateSelectors(hoveredElement);
		showSuggestions = true;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			if (showSuggestions) {
				showSuggestions = false;
			} else {
				exit();
			}
		}
	}

	async function selectSelector(s: string) {
		showSuggestions = false;
		const wasPicking = picking;
		picking = false; 
		
		const confirmed = await showUserConfirmation(
			`Do you want to use this selector?\n\n${s}`,
			"Confirm Selector",
			{
				confirmLabel: "Use Selector",
				confirmColor: "var(--Theme-0)"
			}
		);

		if (confirmed) {
			exit();
			onSelect(s);
		} else {
			// Back to picking
			picking = wasPicking;
			showSuggestions = false;
		}
	}

	function exit() {
		picking = false;
		window.dispatchEvent(new CustomEvent("STYLESHIFT-Picker-State", { detail: { picking: false } }));
		onClose();
	}

	let previewElements = $state<HTMLElement[]>([]);

	function handleSuggestionHover(selector: string) {
		try {
			const elements = document.querySelectorAll(selector);
			previewElements = Array.from(elements).slice(0, 50) as HTMLElement[];
		} catch {
			previewElements = [];
		}
	}

	function handleSuggestionLeave() {
		previewElements = [];
	}

	function getRect(el: HTMLElement) {
		return el.getBoundingClientRect();
	}

	onMount(() => {
		logger.debug("Picker", "SelectorPicker mounted");
		window.dispatchEvent(new CustomEvent("STYLESHIFT-Picker-State", { detail: { picking: true } }));
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mousedown", handleClick, true);
		window.addEventListener("keydown", handleKeyDown);
	});

	onDestroy(() => {
		logger.debug("Picker", "SelectorPicker destroyed");
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mousedown", handleClick, true);
		window.removeEventListener("keydown", handleKeyDown);
		window.dispatchEvent(new CustomEvent("STYLESHIFT-Picker-State", { detail: { picking: false } }));
	});
</script>

{#if showSuggestions}
	<div 
		use:teleport
		class="suggestions-list context-menu" 
		style="top: {menuPosition.y}px; left: {menuPosition.x}px;"
	>
		<div class="suggestions-header">
			Select Selector:
			<button class="close-suggestions" onclick={() => showSuggestions = false}>✕</button>
		</div>
		<div class="suggestions-content">
			{#each suggestedSelectors as s (s)}
				<button 
					class="suggestion-item" 
					onclick={() => selectSelector(s)}
					onmouseenter={() => handleSuggestionHover(s)}
					onmouseleave={handleSuggestionLeave}
				>
					{s}
				</button>
			{/each}
		</div>
	</div>
{/if}

{#each previewElements as el, i (i)}
	{@const rect = getRect(el)}
	<div 
		use:teleport 
		class="selection-overlay preview" 
		style="top: {rect.top}px; left: {rect.left}px; width: {rect.width}px; height: {rect.height}px;"
	></div>
{/each}

{#if picking && hoveredElement && !showSuggestions}
	<div use:teleport bind:this={overlay} class="selection-overlay">
		<div class="selector-tooltip">
			{generateSelectors(hoveredElement)[0] || "No selector found"}
		</div>
	</div>
{/if}

<style lang="scss">
	.selector-picker-container {
		display: flex;
		flex-direction: column;
		gap: 15px;
		padding: 20px;
		color: #e0e0e0;
		transition: opacity 0.2s, transform 0.2s;

		&.hidden {
			opacity: 0;
			pointer-events: none;
			transform: scale(0.95);
		}
	}

	.description {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.6);
		line-height: 1.4;
	}

	.input-group {
		display: flex;
		gap: 8px;
	}

	.selector-input {
		flex: 1;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: white;
		padding: 8px 12px;
		border-radius: 6px;
		font-size: 14px;
		font-family: monospace;
		transition: border-color 0.2s;

		&:focus {
			outline: none;
			border-color: #7f5db7;
			background: rgba(255, 255, 255, 0.1);
		}
	}

	.pick-btn {
		background: #7f5db7;
		color: white;
		border: none;
		padding: 0 15px;
		border-radius: 6px;
		cursor: pointer;
		font-size: 14px;
		display: flex;
		align-items: center;
		gap: 6px;
		transition: all 0.2s;
		font-weight: 500;

		.icon {
			font-size: 18px;
		}

		&.active {
			background: #f44336;
		}

		&:hover {
			filter: brightness(1.1);
			transform: translateY(-1px);
		}

		&:active {
			transform: translateY(0);
		}
	}

	.suggestions-list {
		background: #252525;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
		z-index: 2147483647;

		&.context-menu {
			position: fixed;
			width: 280px;
			animation: menuFadeIn 0.15s ease-out;
		}
	}

	@keyframes menuFadeIn {
		from { opacity: 0; transform: translateY(-5px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.suggestions-header {
		padding: 10px 12px;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-weight: bold;
		color: rgba(255, 255, 255, 0.5);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.03);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.close-suggestions {
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		padding: 2px 5px;
		opacity: 0.5;
		&:hover { opacity: 1; }
	}

	.suggestions-content {
		max-height: 300px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		padding: 4px;
	}

	.suggestion-item {
		background: transparent;
		color: #bbb;
		border: none;
		padding: 8px 12px;
		text-align: left;
		cursor: pointer;
		font-family: 'Fira Code', monospace;
		font-size: 12px;
		border-radius: 4px;
		transition: all 0.1s;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		&:hover {
			background: #7f5db7;
			color: white;
		}
	}

	.actions {
		display: flex;
		gap: 10px;
		margin-top: 5px;
	}

	.action-btn {
		flex: 1;
		background: rgba(255, 255, 255, 0.05);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 10px;
		border-radius: 6px;
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
		transition: all 0.2s;

		&:hover {
			background: rgba(255, 255, 255, 0.1);
		}

		&.primary {
			background: #7f5db7;
			border-color: transparent;

			&:hover {
				filter: brightness(1.1);
			}
		}
	}

	.selection-overlay {
		position: fixed;
		pointer-events: none;
		border: 2px solid #7f5db7;
		background: rgba(127, 93, 183, 0.1);
		z-index: 2147483646;
		box-sizing: border-box;
		border-radius: 4px;
		transition: all 0.05s ease-out;
		box-shadow: 0 0 15px rgba(127, 93, 183, 0.3), 0 0 0 9999px rgba(0, 0, 0, 0.4);

		&.preview {
			border-style: dashed;
			background: rgba(127, 93, 183, 0.2);
			box-shadow: 0 0 15px rgba(127, 93, 183, 0.6);
			z-index: 2147483645;
		}
	}

	.selector-tooltip {
		position: absolute;
		bottom: calc(100% + 10px);
		left: 0;
		background: #7f5db7;
		color: white;
		padding: 6px 12px;
		font-size: 12px;
		border-radius: 6px;
		white-space: nowrap;
		font-family: 'Fira Code', monospace;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
		font-weight: 600;
		animation: tooltipFadeIn 0.1s ease-out;

		&::after {
			content: '';
			position: absolute;
			top: 100%;
			left: 10px;
			border: 6px solid transparent;
			border-top-color: #7f5db7;
		}
	}

	@keyframes tooltipFadeIn {
		from { opacity: 0; transform: translateY(5px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
