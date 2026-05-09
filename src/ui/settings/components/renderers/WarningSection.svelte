<script lang="ts">
	import type { Setting } from "@settings/types/styleshiftTypes";
	import Icon from "../primitives/Icon.svelte";
	import { WarningSectionController } from "./WarningSectionController.svelte";

	let {
		isLocked,
		lockMessage,
		requirementsMet,
		require,
		requiredSettings,
	}: {
		isLocked: boolean;
		lockMessage?: string;
		requirementsMet: boolean;
		require?: Setting["require"];
		requiredSettings: Record<
			string,
			{ name: string; value: any; type: string; options?: any }
		>;
	} = $props();

	const controller = $derived(new WarningSectionController({
		isLocked,
		lockMessage,
		requirementsMet,
		require,
		requiredSettings
	}));
</script>

{#if isLocked || !requirementsMet}
	<div class="STYLESHIFT-Warning-Section-Container" class:is-locked={isLocked}>
		<div class="warning-content">
			{#if isLocked}
				<div class="warning-item lock">
					<div class="icon-wrapper">
						<Icon name="lock" size={14} color="var(--White-100)" />
					</div>
					<span class="message">{lockMessage || "This setting is currently locked."}</span>
				</div>
			{/if}

			{#if !requirementsMet && controller.unmetRequirements.length > 0}
				<div class="warning-item requirement">
					<div class="icon-wrapper">
						<Icon name="error_outline" size={14} color="var(--White-100)" />
					</div>
					<div class="requirement-details">
						<span class="title">Missing Requirements:</span>
						<ul class="unmet-list">
							{#each controller.unmetRequirements as req (req.id)}
								<li>
									<span class="req-name">{req.name}</span>
									<span class="req-action">{controller.formatValue(req)}</span>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.STYLESHIFT-Warning-Section-Container {
		margin-top: 12px;
		padding: 12px 16px;
		background: var(--Theme-Warning-10);
		border: 1px solid var(--Theme-Warning-20);
		border-radius: 12px;
		position: relative;
		overflow: hidden;
		animation: slideIn 0.3s ease-out;

		&.is-locked {
			background: var(--Theme-Error-10);
			border-color: var(--Theme-Error-20);

			.icon-wrapper {
				background: var(--Theme-Error-20);
			}
		}

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 4px;
			background: var(--Theme-Warning-50);
		}

		&.is-locked::before {
			background: var(--Theme-Error-50);
		}
	}

	@keyframes slideIn {
		from { opacity: 0; transform: translateY(-5px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.warning-content {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.warning-item {
		display: flex;
		align-items: flex-start;
		gap: 12px;

		.icon-wrapper {
			flex-shrink: 0;
			width: 24px;
			height: 24px;
			background: var(--Theme-Warning-20);
			border-radius: 6px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.message {
			font-size: 13px;
			color: var(--White-90);
			line-height: 1.5;
			padding-top: 2px;
		}
	}

	.requirement-details {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding-top: 2px;

		.title {
			font-size: 13px;
			font-weight: 600;
			color: var(--White-100);
		}
	}

	.unmet-list {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 4px;

		li {
			font-size: 12px;
			color: var(--White-70);
			display: flex;
			align-items: center;
			gap: 6px;

			&::before {
				content: '•';
				color: var(--White-30);
			}

			.req-name {
				color: var(--White-100);
				font-weight: 500;
				background: var(--White-05);
				padding: 1px 6px;
				border-radius: 4px;
			}

			.req-action {
				color: var(--White-60);
			}
		}
	}
</style>
