<script lang="ts">
	import { isConditionMet } from "@settings/functions";
	import Icon from "./Icon.svelte";

	let {
		conditionsMet,
		condition,
		requiredSettings,
	}: {
		conditionsMet: boolean;
		condition: Record<string, any>;
		requiredSettings: Record<
			string,
			{ name: string; value: any; type: string; options?: any }
		>;
	} = $props();
</script>

<div class="STYLESHIFT-Condition-Status-Section" class:all-met={conditionsMet}>
	<div class="status-info">
		<div class="status-messages">
			<div class="condition-header">
				<div
					style="display: flex; align-items: center; gap: 5px; color: #ffffff; font-weight: bold;"
				>
					{conditionsMet
						? "All conditions met:"
						: "Pending conditions:"}
				</div>
				<ul class="condition-list">
					{#each Object.keys(condition) as id (id)}
						{@const met = isConditionMet(
							condition[id],
							requiredSettings[id]?.value,
						)}
						<li class:met>
							<span class="highlight">
								{requiredSettings[id]?.name || id}
							</span>
							{#if requiredSettings[id]?.type === "checkbox"}
								{condition[id]
									? "to be enabled"
									: "to be disabled"}
							{:else}
								to be
								{#if Array.isArray(condition[id])}
									{#each condition[id] as val, i (val)}
										<span class="highlight"
											>{requiredSettings[id]
												?.options?.[val]
												?.name || val}</span
										>
										{#if i < condition[id].length - 1}
											or
										{/if}
									{/each}
								{:else}
									<span class="highlight"
										>{requiredSettings[id]
											?.options?.[
											condition[id]
										]?.name ||
											condition[id]}</span
									>
								{/if}
							{/if}
							{#if met}
								<Icon name="check_circle"></Icon>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.STYLESHIFT-Condition-Status-Section {
		margin-top: 10px;
		padding: 10px 15px;
		background: rgba(0, 255, 255, 0.05);
		border: 1px dashed rgba(0, 255, 255, 0.3);
		border-radius: 8px;
		z-index: 5;
		pointer-events: all;
		transition: all 0.3s ease;

		&.all-met {
			background: rgba(0, 255, 255, 0.1);
			border: 1px solid rgba(0, 255, 255, 0.5);
			box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
		}
	}

	.status-info {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		width: 100%;
	}

	.status-messages {
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-size: 13px;
		line-height: 1.4;
	}

	.condition-header {
		color: #ffffff;
	}

	.condition-list {
		margin: 8px 0 0 18px;
		padding: 0;
		list-style: disc;
		font-size: 12px;
		opacity: 0.9;

		li {
			margin-bottom: 4px;
			color: rgba(255, 255, 255, 0.7);
			transition: color 0.3s ease;

			&.met {
				color: #00ffff;
				opacity: 1;
			}
		}

		.highlight {
			color: #fff;
			font-weight: bold;
			background: rgba(255, 255, 255, 0.1);
			padding: 0 6px;
			border-radius: 4px;
			margin: 0 2px;
		}
	}
</style>
