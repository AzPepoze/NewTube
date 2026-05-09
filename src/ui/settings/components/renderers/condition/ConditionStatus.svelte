<script lang="ts">
	import Icon from "@primitives/Icon.svelte";
	import { ConditionStatusController } from "./ConditionStatusController.svelte";

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

	const controller = $derived(new ConditionStatusController({
		conditionsMet,
		condition,
		requiredSettings
	}));
</script>

<div class="STYLESHIFT-Condition-Status-Container" class:is-all-met={conditionsMet}>
	<div class="status-header">
		<div class="icon-wrapper">
			<Icon 
				name={conditionsMet ? "check_circle" : "rule"} 
				size={16} 
				color={conditionsMet ? "var(--White-100)" : "var(--White-80)"} 
			/>
		</div>
		<span class="status-title">
			{conditionsMet ? "All conditions met" : "Conditions pending"}
		</span>
	</div>

	<div class="conditions-list-wrapper">
		<ul class="conditions-list">
			{#each controller.conditionItems as item (item.id)}
				<li class:is-met={item.met}>
					<div class="item-icon">
						{#if item.met}
							<Icon name="check" size={12} color="var(--White-100)" />
						{:else}
							<div class="dot"></div>
						{/if}
					</div>
					<div class="item-content">
						<span class="item-name">{item.name}</span>
						<span class="item-target">{controller.formatCondition(item)}</span>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style lang="scss">
	.STYLESHIFT-Condition-Status-Container {
		margin-top: 8px;
		padding: 12px;
		background: var(--White-05);
		border: 1px solid var(--White-10);
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

		&.is-all-met {
			background: rgba(0, 255, 255, 0.05);
			border-color: rgba(0, 255, 255, 0.15);
			box-shadow: 0 4px 20px rgba(0, 255, 255, 0.08);
		}
	}

	.status-header {
		display: flex;
		align-items: center;
		gap: 8px;

		.icon-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.status-title {
			font-size: 13px;
			font-weight: 600;
			color: var(--White-100);
			letter-spacing: 0.2px;
		}
	}

	.conditions-list {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 6px;

		li {
			display: flex;
			align-items: center;
			gap: 10px;
			padding: 4px 8px;
			border-radius: 8px;
			transition: all 0.2s;

			.item-icon {
				width: 16px;
				height: 16px;
				display: flex;
				align-items: center;
				justify-content: center;

				.dot {
					width: 4px;
					height: 4px;
					background: var(--White-30);
					border-radius: 50%;
				}
			}

			.item-content {
				display: flex;
				align-items: center;
				gap: 6px;
				font-size: 12px;
			}

			.item-name {
				color: var(--White-100);
				font-weight: 500;
				background: var(--White-05);
				padding: 1px 6px;
				border-radius: 4px;
			}

			.item-target {
				color: var(--White-60);
			}

			&.is-met {
				background: rgba(0, 255, 255, 0.08);
				
				.item-name {
					background: rgba(0, 255, 255, 0.15);
				}

				.item-target {
					color: var(--White-80);
				}
			}
		}
	}
</style>
