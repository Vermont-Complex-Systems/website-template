<script>
  import DotsToImage from '$lib/components/DotsToImage.svelte';
  import StoryGrid from '$lib/components/StoryGrid.svelte';
  import { getStories } from '$lib/data.remote';
</script>

<!-- Hero Section -->
<section class="hero page">
  <div class="hero-inner">
    <div class="hero-text">
      <h1>Home Page</h1>
      <p>Inspirational description</p>
    </div>
    <DotsToImage imgFilePath='/octopus-swim-right.png' />
  </div>
</section>

<!-- Stories Section -->
<section class="stories page">
  {#await getStories()}
    <div class="loading">Loading stories...</div>
  {:then stories}
    <StoryGrid {stories} />
  {/await}
</section>

<style>
/* ---------------- Hero Section ---------------- */
.hero {
  display: flex;
  align-items: center; /* vertical centering */
  justify-content: center; /* horizontal centering */
  min-height: calc(100vh - 2 * var(--nav-height)); /* full viewport minus nav (main already has nav offset) */
  padding: 0 var(--page-padding);
  box-sizing: border-box;
}

.hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  width: 100%;
  max-width: var(--page-max-width);
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 55%;
}

.hero-text h1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  margin: 0;
  font-family: var(--serif);
}

.hero-text p {
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  margin: 0;
  color: var(--color-gray-700);
}

/* Make DotsToImage grow to fill space */
.hero-inner > :global(DotsToImage) {
  flex: 1;
  height: 50%;
}

/* ---------------- Stories Section ---------------- */
.stories {
  padding: 4rem var(--page-padding);
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--color-fg);
  opacity: 0.7;
}

/* ---------------- Responsive ---------------- */
@media (max-width: 768px) {
  .hero-inner {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
  .hero-text {
    max-width: 90%;
  }
  .hero-text h1 {
    font-size: 2.5rem;
  }
  .hero-text p {
    font-size: 1.2rem;
  }
}
</style>
