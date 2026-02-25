<script lang="ts">
    import Button from "../../settings/components/main/Button.svelte";
    import Modal from "./Modal.svelte";
    import { fly } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { onMount } from "svelte";

    let {
        title = "Enter Text",
        content = "",
        placeholder = "Type here...",
        value = "",
        multiline = false,
        onConfirm,
        onCancel,
    }: {
        title?: string;
        content?: string;
        placeholder?: string;
        value?: string;
        multiline?: boolean;
        onConfirm?: (value: string) => void;
        onCancel?: () => void;
    } = $props();

    let isOpen = $state(true);
    let inputValue = $state(value);
    let inputEl = $state<HTMLInputElement | HTMLTextAreaElement | null>(null);

    function handleAction(callback?: (val?: any) => void, val?: any) {
        isOpen = false;
        if (callback) callback(val);
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter" && (!multiline || e.ctrlKey)) {
            handleAction(onConfirm, inputValue);
        }
    }

    onMount(() => {
        setTimeout(() => {
            inputEl?.focus();
        }, 300);
    });
</script>

<Modal
    {isOpen}
    onClose={() => handleAction(onCancel)}
    width={multiline ? "600px" : "400px"}
>
    <div
        class="header"
        in:fly={{ y: 20, duration: 600, easing: quintOut, delay: 100 }}
    >
        {title}
    </div>

    {#if content}
        <div
            class="content-desc"
            in:fly={{ y: 20, duration: 600, easing: quintOut, delay: 150 }}
        >
            {content}
        </div>
    {/if}

    <div
        class="body"
        in:fly={{ y: 20, duration: 600, easing: quintOut, delay: 200 }}
    >
        {#if multiline}
            <textarea
                bind:this={inputEl as HTMLTextAreaElement}
                class="prompt-input multiline"
                {placeholder}
                bind:value={inputValue}
                onkeydown={handleKeyDown}
            ></textarea>
        {:else}
            <input
                bind:this={inputEl as HTMLInputElement}
                type="text"
                class="prompt-input"
                {placeholder}
                bind:value={inputValue}
                onkeydown={handleKeyDown}
            />
        {/if}
    </div>

    <div
        class="footer"
        in:fly={{ y: 20, duration: 600, easing: quintOut, delay: 300 }}
    >
        <Button
            setting={{
                type: "button",
                name: "OK",
                color: "var(--Theme-0)",
                clickFunction: () => handleAction(onConfirm, inputValue),
            }}
        />
        <Button
            setting={{
                type: "button",
                name: "Cancel",
                color: "var(--White-20, #646464)",
                clickFunction: () => handleAction(onCancel),
            } as any}
        />
    </div>
</Modal>

<style lang="scss">
    .header {
        font-size: 24px;
        font-weight: 900;
        text-align: center;
        color: var(--Font-Color);
        margin-bottom: 5px;
    }

    .content-desc {
        font-size: 14px;
        color: var(--White-60);
        text-align: center;
        margin-bottom: 10px;
        line-height: 1.4;
    }

    .body {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .prompt-input {
        width: 100%;
        padding: 15px 20px;
        background: var(--White-05);
        border: 1px solid var(--White-10);
        border-radius: 15px;
        color: var(--Font-Color);
        font-size: 16px;
        outline: none;
        transition: all 0.2s;
        box-sizing: border-box;

        &:focus {
            border-color: var(--Theme-0);
            background: var(--White-10);
        }

        &::placeholder {
            color: var(--White-40);
        }

        &.multiline {
            min-height: 300px;
            font-family: "Fira Code", monospace;
            resize: vertical;
            line-height: 1.5;
        }
    }

    .footer {
        display: flex;
        gap: 15px;
        margin-top: 5px;

        :global(.STYLESHIFT-Button) {
            flex: 1;
        }
    }
</style>
