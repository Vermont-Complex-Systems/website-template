<script>
import BackgroundPlot from './BackgroundPlot.svelte';
import StoryHeader from '$lib/components/StoryHeader.svelte';
import ScrollIndicator from '$lib/components/helpers/ScrollIndicator.svelte';
import { renderTextContent, scrollyContent } from '$lib/components/helpers/ScrollySnippets.svelte';

let { story, data } = $props();
let scrollyIndex = $state({ value: undefined });
</script>

<ScrollIndicator />

<article class="story theme-dark" style="--theme-bg: #353839; --theme-footer: #414A4C;">
    <div class="prose">
        <StoryHeader
            title={data.title}
            subtitle={data.subtitle}
            authors={data.authors}
            date={data.date}
        />

        <section id="intro" class="prose">
            {#each data.introduction as item}
                {@render renderTextContent(item)}
            {/each}
        </section>
    </div>
    
    <section id="scrolly" class="scrolly-fullscreen">
        <div class="scrolly-chart">
            <BackgroundPlot scrollyIndex={scrollyIndex.value} />
        </div>
        {@render scrollyContent(data.steps, scrollyIndex)}
    </section>
    
    <h2 class="prose">Conclusion</h2>
    <section id="conclusion" class="prose">
        {#each data.conclusion as item}
            {@render renderTextContent(item)}
        {/each}
    </section>
</article>

<style>
    /* Custom scrolly step boxes for this story */
    :global(.theme-dark .scrolly-content .step > *),
    :global(.theme-dark .scrolly-content .step > * *) {
        background: white;
        border-radius: 6px;
        color: #353839 !important;
    }

    /* Remove duplicate styles on nested elements */
    :global(.theme-dark .scrolly-content .step > * *) {
        background: transparent;
        box-shadow: none;
        border: none;
        border-radius: 0;
    }
</style>
