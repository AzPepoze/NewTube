<script lang="ts">
	import SettingFrame from "../SettingFrame.svelte";
	import Description from "./Description.svelte";
	import { scale } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import { tick } from "svelte";

	let {
		id = "",
		name = "",
		description = "",
		value = $bindable(""),
		options = [],
		onUpdate = () => {},
		isOpen = $bindable(false),
		triggerEl = $bindable<HTMLElement | null>(null),
		justMenu = false,
		onClose = () => {},
	} = $props();

	let menuEl = $state<HTMLElement | null>(null);

	function toggleDropdown(e: MouseEvent) {
		e.stopPropagation();
		isOpen = !isOpen;
		if (!isOpen) onClose();
	}

	function handleSelect(option: string) {
		value = option;
		onUpdate(option);
		isOpen = false;
		onClose();
	}

	// Close on click outside
	$effect(() => {
		if (isOpen) {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					menuEl &&
					!menuEl.contains(event.target as Node) &&
					triggerEl &&
					!triggerEl.contains(event.target as Node)
				) {
					isOpen = false;
					onClose();
				}
			};
			window.addEventListener("click", handleClickOutside, true);
			return () => window.removeEventListener("click", handleClickOutside, true);
		}
	});

	// Handle menu positioning and clipping
	let isMenuAbove = $state(false);
	let menuTop = $state(0);
	let menuLeft = $state(0);
	let menuWidth = $state(0);
	let isReady = $state(false);

	function updatePosition() {
		if (!triggerEl) return;

		// Check if trigger is visible in its scrollable container
		const scrollParent = triggerEl.closest(".STYLESHIFT-Scrollable");
		const triggerRect = triggerEl.getBoundingClientRect();

		if (scrollParent) {
			const parentRect = scrollParent.getBoundingClientRect();
			// If trigger is fully outside the scrollable area (with some padding), close it
			if (
				triggerRect.bottom < parentRect.top ||
				triggerRect.top > parentRect.bottom ||
				triggerRect.right < parentRect.left ||
				triggerRect.left > parentRect.right
			) {
				isOpen = false;
				return;
			}
		}

		if (!menuEl) return;

		menuWidth = triggerRect.width;
		menuLeft = triggerRect.left;

		const spaceBelow = window.innerHeight - triggerRect.bottom;
		const menuHeight = menuEl.offsetHeight;

		if (spaceBelow < menuHeight && triggerRect.top > menuHeight) {
			isMenuAbove = true;
			menuTop = triggerRect.top - menuHeight - 8;
		} else {
			isMenuAbove = false;
			menuTop = triggerRect.bottom + 8;
		}
		isReady = true;
	}

	// Portal Action
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		updatePosition();
		return {
			destroy() {
				if (node.parentNode) node.parentNode.removeChild(node);
			},
		};
	}

	$effect(() => {
		if (isOpen) {
			isReady = false;
			tick().then(() => {
				updatePosition();
			});

			window.addEventListener("scroll", updatePosition, true);
			window.addEventListener("resize", updatePosition);

			return () => {
				window.removeEventListener("scroll", updatePosition, true);
				window.removeEventListener("resize", updatePosition);
			};
		}
	});
</script>

<SettingFrame {id} type="dropdown" style={justMenu ? "display: none !important;" : ""}>
	{#if !justMenu}
		<Description {name} {description} />
		<div class="STYLESHIFT-Dropdown-Wrapper">
			<button
				bind:this={triggerEl}
				class="STYLESHIFT-Dropdown-Trigger"
				class:open={isOpen}
				onclick={toggleDropdown}
			>
				<span class="current-value">{value}</span>
				<span class="arrow">▼</span>
			</button>
		</div>
	{/if}

	{#if isOpen}
		<div
			bind:this={menuEl}
			use:portal
			class="STYLESHIFT-Dropdown-Menu"
			style:top="{menuTop}px"
			style:left="{menuLeft}px"
			style:width="{menuWidth}px"
			style:opacity={isReady ? 1 : 0}
			style:pointer-events={isReady ? "all" : "none"}
			class:above={isMenuAbove}
			transition:scale={{ duration: 300, start: 0.9, opacity: 0, easing: quintOut }}
		>
			{#each options as option, i}
				<button
					class="STYLESHIFT-Dropdown-Item"
					class:selected={option === value}
					onclick={() => handleSelect(option)}
					style="animation-delay: {i * 50}ms"
				>
					{option}
				</button>
			{/each}
		</div>
	{/if}
</SettingFrame>

<style lang="scss">
	.STYLESHIFT-Dropdown-Wrapper {
		position: relative;
		min-width: 120px;
	}

	.STYLESHIFT-Dropdown-Trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		background: var(--Black-30);
		border: 1px gray solid;
		color: var(--Theme-0, #7f5db7);
		border-radius: 20px;
		padding: 8px 15px;
		width: 100%;
		font-family: inherit;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		outline: none;

		&:hover {
			border-color: var(--Theme-0, #7f5db7);
			transform: translateY(-1px);
			box-shadow: 0 4px 12px var(--Black-20);
			filter: brightness(1.5);
		}

		&.open {
			border-color: var(--Theme-0, #7f5db7);
			filter: brightness(1.5);

			.arrow {
				transform: rotate(180deg);
			}
		}

		.arrow {
			font-size: 10px;
			transition: transform 0.3s ease;
			opacity: 0.7;
		}
	}

	.STYLESHIFT-Dropdown-Menu {
		position: fixed;
		z-index: 2147483647;
		background: var(--Setting-Frame-BG);
		border: 1px solid var(--White-10);
		border-radius: 15px;
		padding: 6px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		box-shadow: 0 10px 30px var(--Black-50);
		overflow: hidden;
		transform-origin: top center;
		box-sizing: border-box;
		margin-left: -1px;

		&.above {
			transform-origin: bottom center;
		}
	}

	.STYLESHIFT-Dropdown-Item {
		background: transparent;
		border: none;
		color: var(--White-80);
		padding: 10px 14px;
		text-align: left;
		cursor: pointer;
		font-size: 13px;
		font-weight: 500;
		border-radius: 10px;
		transition: all 0.2s ease;
		opacity: 0;
		transform: translateX(-10px);
		animation: itemSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;

		&:hover {
			background: var(--White-10);
			color: white;
			transform: translateX(5px);
		}

		&.selected {
			background: var(--Theme-0, #7f5db7);
			color: white;
		}
	}

	@keyframes itemSlideIn {
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.current-value {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
	}
</style>
