<script lang="ts">
	import Button from "../../settings/components/main/Button.svelte";
	import Description from "../../settings/components/main/Description.svelte";
	import Modal from "./Modal.svelte";

	let {
		title = "Confirm Action",
		message = "Are you sure you want to proceed?",
		onConfirm,
		onCancel,
	}: {
		title?: string;
		message?: string;
		onConfirm: () => void;
		onCancel: () => void;
	} = $props();

	let isOpen = $state(true);

	function handleConfirm() {
		isOpen = false;
		// Wait for transition if needed, but show_user_confirmation handles unmount
		onConfirm();
	}

	function handleCancel() {
		isOpen = false;
		onCancel();
	}
</script>

<Modal {isOpen} onClose={handleCancel} width="400px">
	<div class="header">
		<Description name={title} align="center" style="font-size: 20px; font-weight: 700;" />
	</div>
	<div class="body">
		<Description name={message} align="center" style="font-size: 15px; color: var(--White-70);" />
	</div>
	<div class="footer">
		<Button
			setting={{ type: "button", name: "Cancel", color: "#444", click_function: handleCancel } as any}
		/>
		<Button
			setting={{ type: "button", name: "Confirm", color: "#ff4444", click_function: handleConfirm } as any}
		/>
	</div>
</Modal>

<style lang="scss">
	.footer {
		display: flex;
		gap: 15px;
		margin-top: 10px;

		:global(.STYLESHIFT-Button) {
			flex: 1;
		}
	}
</style>
