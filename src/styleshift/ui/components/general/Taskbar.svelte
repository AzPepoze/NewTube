<script lang="ts">
	import { fade, scale } from "svelte/transition";
	import { get_asset_url } from "@ui/utils";
	import { window_manager } from "../../window-manager.svelte";

	function handle_restore(id: string, restore: () => void) {
		restore();
		window_manager.remove_window(id);
	}
</script>

{#if window_manager.minimized_windows.length > 0}
	<div class="STYLESHIFT-Taskbar" in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
		{#each window_manager.minimized_windows as window (window.id)}
			<button
				class="taskbar-item"
				onclick={() => handle_restore(window.id, window.restore)}
				in:scale={{ duration: 400, start: 0.8 }}
			>
				<img src={get_asset_url("icon/32.png")} alt="" />
				<span>{window.title}</span>
			</button>
		{/each}
	</div>
{/if}

<style lang="scss">
	.STYLESHIFT-Taskbar {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		height: 50px;
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(10px);
		border: 1px solid var(--White-10);
		border-radius: 15px;
		padding: 5px;
		display: flex;
		align-items: center;
		gap: 8px;
		z-index: 10001;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
		pointer-events: auto;
	}

	.taskbar-item {
		height: 100%;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 15px;
		background: transparent;
		border: none;
		border-radius: 10px;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
		pointer-events: auto;
		white-space: nowrap;

		&:hover {
			background: var(--White-10);
		}

		img {
			width: 24px;
			height: 24px;
		}

		span {
			font-size: 13px;
			font-weight: 500;
		}
	}
</style>
