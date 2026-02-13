<script>
    import Meta from "$lib/components/Meta.svelte";
</script>

<Meta
  title="Getting Started"
  description="How to build your first scrollytelling story."
/>

<div class="page">
    <h1>Getting Started</h1>

    <section>
        <h2>Create Your First Story</h2>
        <ol>
            <li>
                <strong>Edit the content</strong>
                <p>Open <code>src/lib/stories/my-first-story/data/copy.json</code> and modify the steps array with your content.</p>
            </li>
            <li>
                <strong>Add visualizations</strong>
                <p>Edit <code>src/lib/stories/my-first-story/components/Index.svelte</code> to add D3 or svelteplot visualizations that respond to the scroll index.</p>
            </li>
            <li>
                <strong>Add a new story</strong>
                <p>Create a new folder in <code>src/lib/stories/</code> following the same structure, then add it to <code>src/data/stories.csv</code>.</p>
            </li>
        </ol>
    </section>

    <section>
        <h2>Layout Options</h2>
        <p>The package includes several layout patterns:</p>
        <ul>
            <li><strong>.split-layout</strong> - Side-by-side content and visualization (default)</li>
            <li><strong>.split-layout.reversed</strong> - Flipped: visualization on left</li>
            <li><strong>.fullscreen-layout</strong> - Full-viewport immersive backgrounds</li>
            <li><strong>.triple-layout</strong> - Three columns: steps, code, and chart</li>
        </ul>
    </section>

    <section>
        <h2>Customization</h2>
        <p>Override CSS variables in <code>src/styles/app.css</code>:</p>
        <pre><code>:root &#123;
  --scrolly-color-accent: #your-brand-color;
  --scrolly-serif: "Your Font", Georgia, serif;
  --story-bg: #your-background;
&#125;</code></pre>
    </section>

    <section>
        <h2>Deploy</h2>
        <p>Run <code>npm run build</code> to generate a static site in the <code>build/</code> folder, ready for GitHub Pages, Vercel, or Netlify.</p>
    </section>
</div>

<style>
    h1 {
        margin-bottom: 2rem;
    }

    section {
        margin-bottom: 3rem;
    }

    h2 {
        margin-bottom: 1rem;
    }

    ol, ul {
        padding-left: 1.5rem;
    }

    li {
        margin-bottom: 1rem;
    }

    li p {
        margin: 0.5rem 0 0;
        color: var(--scrolly-gray-600, #6d6d6d);
    }

    pre {
        margin: 1rem 0;
    }

    code {
        font-size: 0.9em;
    }
</style>
