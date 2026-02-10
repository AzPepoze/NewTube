<script lang="ts">
	let {
		title,
		color = "#999999",
		children = undefined,
		collapsed = $bindable(true),
		onToggle = undefined,
	} = $props();

	function handleToggle() {
		collapsed = !collapsed;
		onToggle?.(collapsed);
	}
</script>

<div class="STYLESHIFT-Dev-Card {collapsed ? 'collapsed' : ''}" style:--card-color={color}>
	<button class="STYLESHIFT-Dev-Card-Header" onclick={handleToggle}>
		<span class="STYLESHIFT-Dev-Card-Title">{title}</span>
		<div class="STYLESHIFT-Dev-Card-Chevrons">
			<span class="STYLESHIFT-Dev-Card-Chevron">{collapsed ? "▼" : "▲"}</span>
		</div>
	</button>

	<div class="STYLESHIFT-Dev-Card-Content">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style lang="scss">
	.STYLESHIFT-Dev-Card {
		width: 100%;
		border-radius: 12px;
		margin-bottom: 16px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid var(--White-10);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

		&.collapsed {
			.STYLESHIFT-Dev-Card-Content {
				max-height: 0;
				padding: 0;
				opacity: 0;
				pointer-events: none;
			}
		}

		&:not(.collapsed) {
			background: rgba(255, 255, 255, 0.04);
			border-color: var(--card-color);
			box-shadow: 0 8px 30px var(--Black-40);
		}
	}

	.STYLESHIFT-Dev-Card-Header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px 18px;
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		font-weight: 600;
		font-size: 14px;
		letter-spacing: 0.5px;
		text-align: left;
		transition: background 0.2s;

		&:hover {
			background: var(--White-05);
		}
	}

	.STYLESHIFT-Dev-Card-Title {
		border-left: 3px solid var(--card-color);
		padding-left: 12px;
		color: var(--White-90);
	}

	.STYLESHIFT-Dev-Card-Content {
		padding: 16px;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		gap: 16px;
		background: rgba(0, 0, 0, 0.15);
	}

	.STYLESHIFT-Dev-Card-Chevron {
		font-size: 10px;
		opacity: 0.5;
		transition: transform 0.3s;
	}
</style>
