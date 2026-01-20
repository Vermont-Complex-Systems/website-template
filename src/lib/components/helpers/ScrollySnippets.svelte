<script module>
    import Scrolly from '$lib/components/helpers/Scrolly.svelte';
    import Md from '$lib/components/helpers/MarkdownRenderer.svelte';

    export { scrollyContent, renderTextContent };
</script>

<!-- Shared snippet for rendering common text content types (html, markdown, math) -->
{#snippet renderTextContent(item)}
    {#if item.type === "html"}
        {@html item.value}
    {:else if item.type === "markdown"}
        <Md text={item.value}/>
    {:else if item.type === "math"}
        <div class="plot-container">
            <Md text={item.value}/>
        </div>
    {/if}
{/snippet}

<!-- Generic scrolly wrapper for story content
     scrollyIndex should be wrapped in an object so we can bind to it -->
{#snippet scrollyContent(steps, scrollyIndexObj, contentRenderer = renderTextContent)}
    <div class="scrolly-content">
        <div class="spacer"></div>
        <Scrolly bind:value={scrollyIndexObj.value}>
            {#each steps as step, i}
                {@const active = scrollyIndexObj.value === i}
                <div class="step" class:active>
                    <div class="step-content">
                        {@render contentRenderer(step)}
                    </div>
                </div>
            {/each}
        </Scrolly>
        <div class="spacer"></div>
    </div>
{/snippet}

<style>
    /* Standard scrolly content styling - scoped to prevent leakage between stories */
    :global(.scrolly-content) {
        position: relative;
        z-index: 10;
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
    }

    :global(.scrolly-content .spacer) {
        height: 65vh;
    }

    :global(.scrolly-content .step) {
        height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        margin: 0 auto;
    }

    /* Aesthetics of sticky text - scoped to scrolly-content */
    :global(.scrolly-content .step > *) {
        padding: 1rem;
        background: #f5f5f5;
        color: #ccc;
        border-radius: 5px;
        box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
        transition: all 500ms ease;
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
    }

    /* Aesthetics of sticky text when active - scoped to scrolly-content */
    :global(.scrolly-content .step.active > *) {
        background: white;
        color: black;
    }

    /* Interactive controls within scrolly steps - scoped to scrolly-content */
    :global(.scrolly-content .step-content) {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
    }

    /* Content rendering styles */
    .plot-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 0;
        padding: 0;
    }

    /* =============================================================================
       SCROLLY LAYOUT PATTERNS
       ============================================================================= */

    /* Layout 1: Side-by-side (content left, chart right, aligned with Nav margins)
       Note: Parent container should use .story-fullwidth class to break out of centered main */
    :global(.scrolly-with-chart) {
        position: relative;
        display: grid;
        grid-template-columns: 1fr minmax(450px, 45%);
        gap: 2rem;
        align-items: start;
        padding-left: var(--margin-left); /* Align with Nav left edge */
        padding-right: var(--margin-left); /* Align with Nav right edge */
    }

    :global(.scrolly-with-chart .scrolly-chart) {
        position: sticky;
        top: calc(50vh - 20vh);
        height: 80vh;
        max-height: 600px;
        grid-column: 2;
    }

    :global(.scrolly-with-chart .scrolly-content) {
        grid-column: 1;
        margin: 0;
        max-width: none;
    }

    :global(.scrolly-with-chart .scrolly-content .step > *) {
        max-width: 400px;
    }

    @media (max-width: 768px) {
        :global(.scrolly-with-chart) {
            grid-template-columns: 1fr;
            padding-left: 0;
            padding-right: 0;
        }

        :global(.scrolly-with-chart .scrolly-chart) {
            position: sticky;
            top: calc(50vh - 25vh);
            height: 60vh;
            grid-column: 1;
            grid-row: 1;
            width: 100%;
            padding: 0 0.5rem;
        }

        :global(.scrolly-with-chart .scrolly-content) {
            grid-column: 1;
            grid-row: 2;
            padding-left: var(--margin-left-mobile);
            padding-right: var(--margin-left-mobile);
        }

        :global(.scrolly-with-chart .scrolly-content .step > *) {
            max-width: 100%;
        }
    }

    /* Layout 2: Fullscreen background with centered text overlay */
    :global(.scrolly-fullscreen) {
        position: relative;
        width: 100vw;
        margin-left: calc(-50vw + 50%);
    }

    :global(.scrolly-fullscreen .scrolly-chart) {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
    }

    :global(.scrolly-fullscreen .scrolly-content) {
        position: relative;
        z-index: 1;
        max-width: 600px;
        margin: 0 auto;
    }

    :global(.scrolly-fullscreen .scrolly-content .step) {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    :global(.scrolly-fullscreen .scrolly-content .step > *) {
        background: rgba(255, 255, 255, 0.95);
        padding: 2rem;
        border-radius: 8px;
        max-width: 500px;
    }
</style>
