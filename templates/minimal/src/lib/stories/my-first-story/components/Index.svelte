<script lang="ts">
  import { ScrollyContent, type ContentItem } from '@vcsi/scrolly-kit';

  let { story, data } = $props();

  let scrollIndex = $state(0);

  const steps: ContentItem[] = data.steps;

</script>

<article class="story">
  <header style="text-align: center; margin-bottom: 3rem;">
    <h1>{story.title}</h1>
    {#if story.subtitle}<p class="subtitle" style="color: var(--scrolly-gray-600); font-size: 1.2rem;">{story.subtitle}</p>{/if}
  </header>

  <section class="split-layout">
    <div class="sticky-panel">
      <!-- Your visualization goes here -->
      <div class="placeholder">
        <p>Step {scrollIndex + 1} of {steps.length}</p>
        <p style="font-size: 0.85rem; color: var(--scrolly-gray-600);">Replace this with your D3 or svelteplot visualization</p>
      </div>
    </div>

    <ScrollyContent {steps} bind:value={scrollIndex} />
  </section>
</article>

<style>
  .placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--scrolly-gray-100, #f0f0f0);
    border-radius: 8px;
    font-family: var(--scrolly-sans, system-ui);
  }
</style>
