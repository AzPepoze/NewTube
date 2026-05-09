<script lang="ts">
	import Icon from "../primitives/Icon.svelte";
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
				name={conditionsMet ? "check_circle" : "pending"} 
				size={16} 
				color={conditionsMet ? "var(--Theme-0)" : "var(--White-60)"} 
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
							<Icon name="check" size={12} color="var(--Theme-0)" />
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
		background: var(--White-02);
		border: 1px solid var(--White-05);
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

		&.is-all-met {
			background: rgba(0, 255, 255, 0.03);
			border-color: rgba(0, 255, 255, 0.1);
			box-shadow: 0 4px 20px rgba(0, 255, 255, 0.05);
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
					background: var(--White-20);
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
				color: var(--White-80);
				font-weight: 500;
				background: var(--White-05);
				padding: 1px 6px;
				border-radius: 4px;
			}

			.item-target {
				color: var(--White-40);
			}

			&.is-met {
				background: rgba(0, 255, 255, 0.05);
				
				.item-name {
					color: var(--Theme-0);
					background: rgba(0, 255, 255, 0.1);
				}

				.item-target {
					color: rgba(0, 255, 255, 0.5);
				}
			}
		}
	}
</style>
