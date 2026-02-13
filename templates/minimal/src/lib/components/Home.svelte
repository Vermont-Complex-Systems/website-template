<script>
  import { getStories } from '$lib/story.remote';
  const stories = getStories();
</script>

<div class="page">
  <h1>Your Scrollytelling Site</h1>
  <p class="subtitle">
    Create data-driven visual stories with SvelteKit.
  </p>

  <section class="stories-section">
    <h2>Your Stories</h2>
    {#await stories}
      <p>Loading...</p>
    {:then storyList}
      <ul class="story-list">
        {#each storyList as story}
          <li>
            <a href="/{story.slug}">{story.title}</a>
            <p class="description">{story.description}</p>
          </li>
        {/each}
      </ul>
    {/await}
  </section>

  <section class="getting-started">
    <h2>Getting Started</h2>
    <ol>
      <li>Edit <code>src/lib/stories/my-first-story/data/copy.json</code> to change content</li>
      <li>Edit <code>src/lib/stories/my-first-story/components/Index.svelte</code> to add visualizations</li>
      <li>Add new stories by creating folders in <code>src/lib/stories/</code></li>
      <li>Run <code>npm run build</code> to generate your static site</li>
    </ol>
  </section>
</div>

<style>
  .page {
    min-height: 100dvh;
    padding-top: calc(var(--nav-height) + 3rem);
    padding-inline: var(--page-inline-padding);
    max-width: var(--page-max-width);
    margin: 0 auto;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    font-family: var(--serif);
    margin: 0 0 1rem 0;
  }

  .subtitle {
    font-size: 1.2rem;
    color: var(--color-muted);
    margin-bottom: 2rem;
  }

  .stories-section {
    margin-bottom: 3rem;
  }

  .stories-section h2,
  .getting-started h2 {
    font-size: 1.5rem;
    font-family: var(--serif);
    margin-bottom: 1rem;
  }

  .story-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .story-list li {
    margin-bottom: 1rem;
  }

  .story-list a {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--color-fg);
  }

  .story-list .description {
    color: var(--color-muted);
    margin: 0.25rem 0 0;
    font-size: 0.95rem;
  }

  .getting-started {
    padding: 2rem;
    background: var(--color-hover);
    border-radius: 8px;
  }

  .getting-started ol {
    line-height: 2;
    margin: 0;
    padding-left: 1.5rem;
  }

  .getting-started code {
    font-family: var(--mono);
    font-size: 0.85em;
    background: var(--color-bg);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
  }
</style>
