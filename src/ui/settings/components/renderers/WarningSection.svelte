<script lang="ts">
	import type { Setting } from "@settings/types/styleshiftTypes";

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
</script>

{#if isLocked || !requirementsMet}
	<div class="STYLESHIFT-Setting-Warning-Section">
		<div class="lock-info">
			<div class="lock-messages">
				{#if isLocked}
					<div class="lock-message">
						{lockMessage ||
							"This setting is currently locked."}
					</div>
				{/if}
				{#if !requirementsMet && require}
					<div class="requirement-warning">
						<div
							style="display: flex; align-items: center; gap: 5px; color: #ffffff; font-weight: bold;"
						>
							This setting requires:
						</div>
						<ul class="requirement-list">
							{#each Object.keys(require) as reqId (reqId)}
								{#if requiredSettings[reqId]?.value !== require[reqId]}
									<li>
										<span class="highlight">
											{requiredSettings[reqId]
												?.name || reqId}
										</span>
										{#if requiredSettings[reqId]?.type === "checkbox"}
											to be enabled
										{:else}
											to be
											{#if Array.isArray(require[reqId])}
												{#each require[reqId] as val, i (val)}
													<span
														class="highlight"
														>{requiredSettings[
															reqId
														]
															?.options?.[
															val
														]?.name ||
															val}</span
													>
													{#if i < require[reqId].length - 1}
														or
													{/if}
												{/each}
											{:else}
												<span
													class="highlight"
													>{requiredSettings[
														reqId
													]?.options?.[
														require[
															reqId
														]
													]?.name ||
														require[
															reqId
														]}</span
												>
											{/if}
										{/if}
									</li>
								{/if}
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.STYLESHIFT-Setting-Warning-Section {
		margin-top: 10px;
		padding: 10px 15px;
		background: rgba(255, 204, 0, 0.1);
		border: 1px dashed #ffcc00;
		border-radius: 5px;
		z-index: 5;
		pointer-events: all;
	}

	.lock-info {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		width: 100%;
	}

	.lock-messages {
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-size: 13px;
		line-height: 1.4;
	}

	.lock-message {
		font-weight: 500;
		color: #ffffff;
		white-space: normal;
		overflow-wrap: break-word;
	}

	.requirement-warning {
		color: #ffffff;
	}

	.requirement-list {
		margin: 5px 0 0 18px;
		padding: 0;
		list-style: disc;
		font-size: 12px;
		opacity: 0.9;

		.highlight {
			color: #fff;
			font-weight: bold;
			background: rgba(255, 255, 255, 0.1);
			padding: 0 4px;
			border-radius: 4px;
		}
	}
</style>
