<script>
    import BackToHome from '$lib/components/helpers/BackToHome.svelte';
    import GeoScrollyPlot from './GeoScrollyPlot.svelte';
    import ZoomMapDuckDB from './ZoomMapDuckDB.svelte';
    import { ScrollIndicator, RenderTextContent, ScrollyContent, StoryHeader, Footer } from '@the-vcsi/scrolly-kit';

    let { story, data } = $props();

    let scrollyIndex = $state(undefined);
</script>

<BackToHome />
<ScrollIndicator threshold={50} />

<article class="story" id="geo-story-duckdb">
    <StoryHeader
        title={data.title}
        subtitle={data.subtitle}
        authors={data.authors}
        date={data.date}
    />

    <section id="intro">
        {#each data.introduction as item}
            <RenderTextContent {item} />
        {/each}
    </section>

    <section id="scrolly" class="fullscreen-layout">
        <div class="sticky-panel">
            <GeoScrollyPlot {scrollyIndex} />
        </div>
        <ScrollyContent steps={data.steps} bind:value={scrollyIndex} />
    </section>

    <h2>Conclusion</h2>
    <section id="conclusion">
        {#each data.conclusion as item}
            <RenderTextContent {item} />
        {/each}
    </section>

    <section id="explore" class="explore-section">
        <h2>Explore on your own</h2>
        <p>Click any electoral district to zoom in and see its dissemination areas. Use the metric dropdown and local/global toggle to change what you see.</p>
        <ZoomMapDuckDB />
    </section>

    <h2>Appendix</h2>
    <section id="appendix">
        {#each data.appendix as item}
            <RenderTextContent {item} />
        {/each}
    </section>
</article>

<Footer theme="light" />

<style>
    .explore-section {
        max-width: 900px;
        margin: 2rem auto;
    }
    .explore-section h2 {
        text-align: center;
    }
    .explore-section p {
        text-align: center;
        color: #666;
        margin-bottom: 1.5rem;
    }
    .dashboard-container {
        width: 100%;
    }
</style>
