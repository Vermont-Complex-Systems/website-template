<script lang="ts">
    import Scrolly from './Scrolly.svelte';
    import { renderTextContent, type ContentItem } from './ScrollySnippets.svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        /** Array of content items from copy.json */
        steps: ContentItem[];
        /** Current active step index (bindable) */
        value?: number;
        /** Show spacer before first step (default: true) */
        topSpacer?: boolean;
        /** Show spacer after last step (default: true) */
        bottomSpacer?: boolean;
        /** Custom content renderer snippet */
        contentRenderer?: Snippet<[ContentItem]>;
    }

    let {
        steps,
        value = $bindable(undefined),
        topSpacer = true,
        bottomSpacer = true,
        contentRenderer = renderTextContent
    }: Props = $props();
</script>

<div class="scrolly-content">
    {#if topSpacer}<div class="spacer"></div>{/if}
    <Scrolly bind:value>
        {#each steps as step, i}
            {@const active = value === i}
            <div class="step" class:active>
                <div class="step-box">
                    {@render contentRenderer(step)}
                </div>
            </div>
        {/each}
    </Scrolly>
    {#if bottomSpacer}<div class="spacer"></div>{/if}
</div>

<style>
    /*
     * ScrollyContent - Opinionated scrollytelling component
     *
     * CSS variables (set on parent like .scrolly-with-chart):
     *   --spacer-height: 65vh      Top/bottom spacer height
     *   --step-height: 90vh        Vertical space per step
     *   --step-max-width: 600px    Max width of step box
     *   --step-padding: 1rem       Padding inside step box
     *   --step-border-radius: 5px  Corner rounding
     *   --step-text-align: center  Text alignment (left, center, right)
     *
     * Colors (set globally in app.css):
     *   --story-step-bg / --story-step-fg           Active step
     *   --story-step-bg-inactive / --story-step-fg-inactive  Inactive step
     */

    .scrolly-content {
        position: relative;
        z-index: 2;
        pointer-events: none;
    }

    .spacer {
        height: var(--spacer-height, 65vh);
    }

    .step {
        min-height: var(--step-height);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .step-box {
        width: 100%;
        max-width: var(--step-max-width, 600px);
        padding: var(--step-padding, 1rem);
        background-color: var(--story-step-bg-inactive);
        color: var(--story-step-fg-inactive);
        border-radius: var(--step-border-radius, 5px);
        box-shadow: var(--step-box-shadow);
        transition: background-color 400ms ease, color 400ms ease;
        text-align: var(--step-text-align, center);
        pointer-events: auto;
    }

    .step.active .step-box {
        background-color: var(--story-step-bg);
        color: var(--story-step-fg);
    }

    /* Links and nested elements inherit step text color */
    .step-box :global(*) {
        color: inherit;
    }
</style>
