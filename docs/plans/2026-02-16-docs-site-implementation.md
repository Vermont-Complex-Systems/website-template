# Docs Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a documentation site at `sites/docs/` showcasing scrolly-kit layouts and CSS variables, deployed to GitHub Pages.

**Architecture:** Minimal SvelteKit site with static adapter. Uses scrolly-kit CSS tokens for styling. Three pages: Getting Started, Reference, Examples. No scrollytelling behavior - static reference documentation.

**Tech Stack:** SvelteKit 2, Svelte 5, @sveltejs/adapter-static, @the-vcsi/scrolly-kit (workspace dependency)

---

### Task 1: Update Root Workspaces

**Files:**
- Modify: `package.json:6`

**Step 1: Add sites/* to workspaces**

Edit `package.json` line 6, change:
```json
"workspaces": ["packages/*", "templates/*"],
```
to:
```json
"workspaces": ["packages/*", "templates/*", "sites/*"],
```

**Step 2: Verify the change**

Run: `cat package.json | grep workspaces`
Expected: `"workspaces": ["packages/*", "templates/*", "sites/*"],`

**Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add sites/* to npm workspaces"
```

---

### Task 2: Create Docs Site Scaffold

**Files:**
- Create: `sites/docs/package.json`
- Create: `sites/docs/svelte.config.js`
- Create: `sites/docs/vite.config.ts`
- Create: `sites/docs/tsconfig.json`

**Step 1: Create package.json**

Create `sites/docs/package.json`:
```json
{
  "name": "scrolly-kit-docs",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
  },
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.10",
    "@sveltejs/kit": "^2.49.1",
    "@sveltejs/vite-plugin-svelte": "^6.2.1",
    "svelte": "^5.45.6",
    "svelte-check": "^4.4.0",
    "typescript": "^5.9.3",
    "vite": "^7.2.6"
  },
  "dependencies": {
    "@the-vcsi/scrolly-kit": "workspace:*"
  }
}
```

**Step 2: Create svelte.config.js**

Create `sites/docs/svelte.config.js`:
```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/vcsi-starter' : ''
    }
  }
};

export default config;
```

**Step 3: Create vite.config.ts**

Create `sites/docs/vite.config.ts`:
```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()]
});
```

**Step 4: Create tsconfig.json**

Create `sites/docs/tsconfig.json`:
```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

**Step 5: Commit scaffold files**

```bash
git add sites/docs/package.json sites/docs/svelte.config.js sites/docs/vite.config.ts sites/docs/tsconfig.json
git commit -m "chore: scaffold docs site config files"
```

---

### Task 3: Create App Styles and Root Layout

**Files:**
- Create: `sites/docs/src/lib/styles/app.css`
- Create: `sites/docs/src/routes/+layout.svelte`
- Create: `sites/docs/src/app.html`

**Step 1: Create app.css**

Create `sites/docs/src/lib/styles/app.css`:
```css
/* Import base styles from scrolly-kit */
@import '@the-vcsi/scrolly-kit/styles/reset.css';
@import '@the-vcsi/scrolly-kit/styles/tokens.css';
@import '@the-vcsi/scrolly-kit/styles/typography.css';
@import '@the-vcsi/scrolly-kit/styles/layouts.css';

/* =============================================================================
   DOCS SITE STYLES
   ============================================================================= */

body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--vcsi-bg);
  color: var(--vcsi-fg);
}

main {
  flex: 1;
}

/* Simple nav for docs */
.docs-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--vcsi-border);
  background: var(--vcsi-bg);
}

.docs-nav-logo {
  font-family: var(--vcsi-font-sans);
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--vcsi-fg);
  text-decoration: none;
}

.docs-nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.docs-nav-links a {
  font-family: var(--vcsi-font-sans);
  font-size: 0.9rem;
  color: var(--vcsi-fg);
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.docs-nav-links a:hover,
.docs-nav-links a[aria-current="page"] {
  opacity: 1;
}

/* Code blocks in docs */
.docs-code {
  background: var(--vcsi-gray-100);
  border: 1px solid var(--vcsi-border);
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.6;
}

/* CSS variable tables */
.docs-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-family: var(--vcsi-font-sans);
  font-size: 0.9rem;
}

.docs-table th,
.docs-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--vcsi-border);
}

.docs-table th {
  font-weight: 600;
  background: var(--vcsi-gray-100);
}

.docs-table code {
  background: var(--vcsi-gray-100);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  font-size: 0.8rem;
}

/* Layout diagram containers */
.layout-diagram {
  border: 1px solid var(--vcsi-border);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  background: var(--vcsi-gray-50);
}

/* Example cards grid */
.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.example-card {
  border: 1px solid var(--vcsi-border);
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.example-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.example-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid var(--vcsi-border);
}

.example-card-content {
  padding: 1rem;
}

.example-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.example-card p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}
```

**Step 2: Create app.html**

Create `sites/docs/src/app.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

**Step 3: Create root layout**

Create `sites/docs/src/routes/+layout.svelte`:
```svelte
<script>
  import '$lib/styles/app.css';
  import { page } from '$app/stores';
  import { base } from '$app/paths';

  let { children } = $props();
</script>

<nav class="docs-nav">
  <a href="{base}/" class="docs-nav-logo">scrolly-kit</a>
  <ul class="docs-nav-links">
    <li><a href="{base}/" aria-current={$page.url.pathname === base + '/' ? 'page' : undefined}>Getting Started</a></li>
    <li><a href="{base}/reference" aria-current={$page.url.pathname === base + '/reference' ? 'page' : undefined}>Reference</a></li>
    <li><a href="{base}/examples" aria-current={$page.url.pathname === base + '/examples' ? 'page' : undefined}>Examples</a></li>
  </ul>
</nav>

<main>
  {@render children?.()}
</main>
```

**Step 4: Create static directory with favicon placeholder**

```bash
mkdir -p sites/docs/static
touch sites/docs/static/.gitkeep
```

**Step 5: Commit**

```bash
git add sites/docs/src sites/docs/static
git commit -m "feat(docs): add app styles and root layout"
```

---

### Task 4: Create Getting Started Page

**Files:**
- Create: `sites/docs/src/routes/+page.svelte`

**Step 1: Create Getting Started page**

Create `sites/docs/src/routes/+page.svelte`:
```svelte
<script>
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>scrolly-kit - Getting Started</title>
</svelte:head>

<article class="page">
  <h1>scrolly-kit</h1>
  <p class="lead">A toolkit for building scrollytelling stories with SvelteKit.</p>

  <h2>Quick Start</h2>

  <h3>1. Scaffold a new project</h3>
  <pre class="docs-code">npx degit Vermont-Complex-Systems/vcsi-starter/templates/baked my-project
cd my-project
npm install</pre>

  <h3>2. Start the dev server</h3>
  <pre class="docs-code">npm run dev</pre>

  <h3>3. Create a new story</h3>
  <pre class="docs-code">npm run new-story my-story-name</pre>

  <p>This creates a story scaffold at <code>src/lib/stories/my-story-name/</code> with:</p>
  <ul>
    <li><code>components/Index.svelte</code> - Main story component</li>
    <li><code>data/copy.json</code> - Story content data</li>
  </ul>

  <h2>Project Structure</h2>
  <pre class="docs-code">src/
├── routes/
│   ├── (app)/           # Pages with Nav + Footer
│   │   ├── +page.svelte # Home
│   │   └── about/       # About pages
│   └── [slug]/          # Stories (no Nav/Footer)
├── lib/
│   ├── stories/         # Story components
│   ├── components/      # Shared components
│   └── styles/
│       └── app.css      # Your customizations
└── data/
    └── stories.csv      # Story metadata</pre>

  <h2>Customizing Styles</h2>

  <p>Override CSS variables in <code>src/lib/styles/app.css</code>:</p>

  <pre class="docs-code">{`:root {
  /* Brand colors */
  --vcsi-color-accent: #154734;

  /* Typography */
  --vcsi-font-sans: "Your Font", system-ui;
  --vcsi-font-serif: "Your Serif", Georgia;
}`}</pre>

  <p>See the <a href="{base}/reference">Reference</a> for all available CSS variables.</p>

  <h2>Next Steps</h2>
  <ul>
    <li><a href="{base}/reference">Reference</a> - Layout patterns and CSS variables</li>
    <li><a href="{base}/examples">Examples</a> - See real stories built with scrolly-kit</li>
  </ul>
</article>

<style>
  .lead {
    font-size: 1.25rem;
    opacity: 0.8;
    margin-bottom: 2rem;
  }

  h2 {
    margin-top: 3rem;
  }

  h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  pre {
    margin: 1rem 0;
  }

  code {
    background: var(--vcsi-gray-100);
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    font-size: 0.9em;
  }

  ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.5rem 0;
  }
</style>
```

**Step 2: Commit**

```bash
git add sites/docs/src/routes/+page.svelte
git commit -m "feat(docs): add Getting Started page"
```

---

### Task 5: Create Reference Page

**Files:**
- Create: `sites/docs/src/routes/reference/+page.svelte`

**Step 1: Create Reference page**

Create `sites/docs/src/routes/reference/+page.svelte`:
```svelte
<svelte:head>
  <title>Reference - scrolly-kit</title>
</svelte:head>

<article class="page">
  <h1>Reference</h1>
  <p>Layout patterns and CSS variables for scrollytelling stories.</p>

  <nav class="toc">
    <strong>Contents:</strong>
    <a href="#story">Story Container</a> |
    <a href="#split-layout">Split Layout</a> |
    <a href="#fullscreen-layout">Fullscreen Layout</a> |
    <a href="#dashboard-layout">Dashboard Layout</a> |
    <a href="#css-variables">CSS Variables</a>
  </nav>

  <!-- STORY CONTAINER -->
  <section id="story">
    <h2>Story Container</h2>
    <p>The <code>.story</code> class is the main container for scrollytelling content. It provides:</p>
    <ul>
      <li>Centered prose by default (max-width 600px)</li>
      <li>Light theme isolation from global dark mode</li>
      <li>Padding and spacing for readability</li>
    </ul>

    <pre class="docs-code">{`<article class="story">
  <h1>Story Title</h1>
  <p>Centered prose content...</p>

  <section class="split-layout">
    <!-- Layout breaks out to full width -->
  </section>

  <p>Back to centered prose...</p>
</article>`}</pre>

    <h3>Dark Theme</h3>
    <p>Add <code>data-theme="dark"</code> for dark stories:</p>
    <pre class="docs-code">{`<article class="story" data-theme="dark">
  <!-- Dark background, light text -->
</article>`}</pre>
  </section>

  <!-- SPLIT LAYOUT -->
  <section id="split-layout">
    <h2>Split Layout</h2>
    <p>Two-column layout with a sticky visualization panel and scrolling content.</p>

    <div class="layout-diagram">
      <div class="diagram-split">
        <div class="diagram-content">
          <div class="diagram-label">scrolly-content</div>
          <div class="diagram-steps">
            <div class="diagram-step">Step 1</div>
            <div class="diagram-step">Step 2</div>
            <div class="diagram-step">Step 3</div>
          </div>
        </div>
        <div class="diagram-panel">
          <div class="diagram-label">sticky-panel</div>
          <div class="diagram-viz">Visualization</div>
        </div>
      </div>
    </div>

    <pre class="docs-code">{`<section class="split-layout">
  <div class="sticky-panel">
    <!-- Your visualization component -->
  </div>
  <div class="scrolly-content">
    <!-- ScrollyContent or custom steps -->
  </div>
</section>

<!-- Reversed: panel on left -->
<section class="split-layout reversed">
  ...
</section>`}</pre>

    <h3>CSS Variables</h3>
    <table class="docs-table">
      <thead>
        <tr><th>Variable</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>--vcsi-panel-width</code></td><td>45%</td><td>Width of sticky panel</td></tr>
        <tr><td><code>--vcsi-panel-min-width</code></td><td>450px</td><td>Minimum panel width</td></tr>
        <tr><td><code>--vcsi-panel-height</code></td><td>min(80vh, 600px)</td><td>Panel height</td></tr>
        <tr><td><code>--vcsi-layout-gap</code></td><td>2rem</td><td>Gap between columns</td></tr>
      </tbody>
    </table>

    <h3>Mobile Behavior</h3>
    <p>On screens &lt;768px, the layout stacks with the sticky panel as a full-screen background and content overlaying it.</p>
  </section>

  <!-- FULLSCREEN LAYOUT -->
  <section id="fullscreen-layout">
    <h2>Fullscreen Layout</h2>
    <p>Full-viewport immersive layout for dramatic visualizations.</p>

    <div class="layout-diagram">
      <div class="diagram-fullscreen">
        <div class="diagram-panel-full">
          <div class="diagram-label">sticky-panel (100vh)</div>
          <div class="diagram-viz">Full-screen Visualization</div>
        </div>
        <div class="diagram-content-overlay">
          <div class="diagram-step">Step</div>
        </div>
      </div>
    </div>

    <pre class="docs-code">{`<section class="fullscreen-layout">
  <div class="sticky-panel">
    <!-- Full-viewport visualization -->
  </div>
  <div class="scrolly-content">
    <!-- Overlaid step boxes -->
  </div>
</section>`}</pre>

    <h3>CSS Variables</h3>
    <table class="docs-table">
      <thead>
        <tr><th>Variable</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>--vcsi-step-max-width</code></td><td>500px</td><td>Max width of step boxes</td></tr>
        <tr><td><code>--vcsi-step-padding</code></td><td>2rem</td><td>Padding inside steps</td></tr>
      </tbody>
    </table>
  </section>

  <!-- DASHBOARD LAYOUT -->
  <section id="dashboard-layout">
    <h2>Dashboard Layout</h2>
    <p>Sidebar + main content for interactive data dashboards.</p>

    <div class="layout-diagram">
      <div class="diagram-dashboard">
        <div class="diagram-sidebar">
          <div class="diagram-label">sidebar</div>
          <div class="diagram-controls">Controls</div>
        </div>
        <div class="diagram-main">
          <div class="diagram-label">main</div>
          <div class="diagram-viz">Chart / Visualization</div>
        </div>
      </div>
    </div>

    <pre class="docs-code">{`<article class="dashboard-layout">
  <aside class="dashboard-sidebar">
    <button class="sidebar-toggle">...</button>
    <div class="sidebar-content">
      <!-- Filters, controls -->
    </div>
  </aside>
  <main class="dashboard-main">
    <!-- Visualization -->
  </main>
</article>`}</pre>

    <h3>CSS Variables</h3>
    <table class="docs-table">
      <thead>
        <tr><th>Variable</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>--vcsi-sidebar-width</code></td><td>280px</td><td>Sidebar width when open</td></tr>
        <tr><td><code>--vcsi-sidebar-collapsed-width</code></td><td>48px</td><td>Sidebar width when collapsed</td></tr>
        <tr><td><code>--vcsi-sidebar-bg</code></td><td>#ebe6e1</td><td>Sidebar background</td></tr>
      </tbody>
    </table>

    <h3>Collapsible Sidebar</h3>
    <p>Toggle <code>.sidebar-collapsed</code> class on <code>.dashboard-layout</code> to collapse/expand.</p>

    <h3>Mobile Behavior</h3>
    <p>On mobile, sidebar becomes a slide-down drawer. Toggle <code>.sidebar-open</code> class to show.</p>
  </section>

  <!-- CSS VARIABLES -->
  <section id="css-variables">
    <h2>Global CSS Variables</h2>
    <p>These tokens are available throughout your project.</p>

    <h3>Colors</h3>
    <table class="docs-table">
      <thead>
        <tr><th>Variable</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>--vcsi-color-accent</code></td><td>Brand accent color</td></tr>
        <tr><td><code>--vcsi-bg</code></td><td>Background (respects dark mode)</td></tr>
        <tr><td><code>--vcsi-fg</code></td><td>Foreground text (respects dark mode)</td></tr>
        <tr><td><code>--vcsi-border</code></td><td>Border color</td></tr>
        <tr><td><code>--vcsi-hover</code></td><td>Hover state background</td></tr>
      </tbody>
    </table>

    <h3>Typography</h3>
    <table class="docs-table">
      <thead>
        <tr><th>Variable</th><th>Default</th></tr>
      </thead>
      <tbody>
        <tr><td><code>--vcsi-font-sans</code></td><td>system-ui, sans-serif</td></tr>
        <tr><td><code>--vcsi-font-serif</code></td><td>Georgia, serif</td></tr>
        <tr><td><code>--vcsi-font-mono</code></td><td>ui-monospace, monospace</td></tr>
      </tbody>
    </table>

    <h3>Spacing</h3>
    <table class="docs-table">
      <thead>
        <tr><th>Variable</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td><code>--vcsi-space-xs</code></td><td>0.25rem</td></tr>
        <tr><td><code>--vcsi-space-sm</code></td><td>0.5rem</td></tr>
        <tr><td><code>--vcsi-space-md</code></td><td>1rem</td></tr>
        <tr><td><code>--vcsi-space-lg</code></td><td>1.5rem</td></tr>
        <tr><td><code>--vcsi-space-xl</code></td><td>2rem</td></tr>
        <tr><td><code>--vcsi-space-2xl</code></td><td>3rem</td></tr>
      </tbody>
    </table>

    <h3>Story-Specific</h3>
    <table class="docs-table">
      <thead>
        <tr><th>Variable</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>--vcsi-story-bg</code></td><td>Story background color</td></tr>
        <tr><td><code>--vcsi-story-fg</code></td><td>Story text color</td></tr>
        <tr><td><code>--vcsi-story-max-width</code></td><td>Max width for prose (600px)</td></tr>
        <tr><td><code>--story-step-bg</code></td><td>Active step background</td></tr>
        <tr><td><code>--story-step-fg</code></td><td>Active step text</td></tr>
      </tbody>
    </table>
  </section>
</article>

<style>
  .toc {
    background: var(--vcsi-gray-100);
    padding: 1rem;
    border-radius: 6px;
    margin: 1.5rem 0;
  }

  .toc a {
    margin: 0 0.25rem;
  }

  section {
    margin-top: 4rem;
    padding-top: 1rem;
  }

  h3 {
    margin-top: 2rem;
  }

  code {
    background: var(--vcsi-gray-100);
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    font-size: 0.9em;
  }

  /* Diagram styles */
  .diagram-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    height: 200px;
  }

  .diagram-content,
  .diagram-panel,
  .diagram-panel-full,
  .diagram-sidebar,
  .diagram-main {
    border: 2px dashed var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  .diagram-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--vcsi-gray-600);
    margin-bottom: 0.5rem;
  }

  .diagram-steps {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  .diagram-step {
    background: white;
    border: 1px solid var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem;
    text-align: center;
    font-size: 0.8rem;
  }

  .diagram-viz,
  .diagram-controls {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vcsi-gray-200);
    border-radius: 4px;
    font-size: 0.8rem;
    color: var(--vcsi-gray-600);
  }

  .diagram-fullscreen {
    position: relative;
    height: 200px;
  }

  .diagram-panel-full {
    position: absolute;
    inset: 0;
  }

  .diagram-content-overlay {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .diagram-dashboard {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 0.5rem;
    height: 200px;
  }
</style>
```

**Step 2: Commit**

```bash
git add sites/docs/src/routes/reference/+page.svelte
git commit -m "feat(docs): add Reference page with layouts and CSS variables"
```

---

### Task 6: Create Examples Page

**Files:**
- Create: `sites/docs/src/routes/examples/+page.svelte`

**Step 1: Create Examples page**

Create `sites/docs/src/routes/examples/+page.svelte`:
```svelte
<svelte:head>
  <title>Examples - scrolly-kit</title>
</svelte:head>

<article class="page">
  <h1>Examples</h1>
  <p>Stories built with scrolly-kit. View the source code to see how they're structured.</p>

  <div class="examples-grid">
    <a class="example-card" href="https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/baked/src/lib/stories/scrolly-story-1" target="_blank" rel="noopener">
      <div class="example-card-placeholder">Split Layout</div>
      <div class="example-card-content">
        <h3>Scrolly Story 1</h3>
        <p>Basic split layout with line chart visualization that responds to scroll steps.</p>
      </div>
    </a>

    <a class="example-card" href="https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/baked/src/lib/stories/scrolly-story-2" target="_blank" rel="noopener">
      <div class="example-card-placeholder">Split Layout</div>
      <div class="example-card-content">
        <h3>Scrolly Story 2</h3>
        <p>Scatter plot with regression lines, demonstrating data-driven scrollytelling.</p>
      </div>
    </a>

    <a class="example-card" href="https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/baked/src/lib/stories/geo-story-1" target="_blank" rel="noopener">
      <div class="example-card-placeholder">Fullscreen Layout</div>
      <div class="example-card-content">
        <h3>Geo Story</h3>
        <p>Geographic visualization with fullscreen map background.</p>
      </div>
    </a>

    <a class="example-card" href="https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/baked/src/lib/stories/scrolly-explainer" target="_blank" rel="noopener">
      <div class="example-card-placeholder">Split Layout</div>
      <div class="example-card-content">
        <h3>Scrolly Explainer</h3>
        <p>Educational explainer format with code examples.</p>
      </div>
    </a>

    <a class="example-card" href="https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/baked/src/lib/stories/dashboard-1" target="_blank" rel="noopener">
      <div class="example-card-placeholder">Dashboard Layout</div>
      <div class="example-card-content">
        <h3>Dashboard</h3>
        <p>Interactive dashboard with collapsible sidebar and data filters.</p>
      </div>
    </a>

    <a class="example-card" href="https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/baked/src/lib/stories/thematic-story-1" target="_blank" rel="noopener">
      <div class="example-card-placeholder">Custom Layout</div>
      <div class="example-card-content">
        <h3>Thematic Story</h3>
        <p>Long-form narrative with custom theming and multiple sections.</p>
      </div>
    </a>
  </div>
</article>

<style>
  .example-card {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .example-card-placeholder {
    height: 180px;
    background: var(--vcsi-gray-100);
    border-bottom: 1px solid var(--vcsi-border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    color: var(--vcsi-gray-500);
  }
</style>
```

**Step 2: Commit**

```bash
git add sites/docs/src/routes/examples/+page.svelte
git commit -m "feat(docs): add Examples page with story gallery"
```

---

### Task 7: Create GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/docs.yml`

**Step 1: Create workflow file**

Create `.github/workflows/docs.yml`:
```yaml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths:
      - 'sites/docs/**'
      - 'packages/scrolly-kit/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build scrolly-kit package
        run: npm run package --workspace=@the-vcsi/scrolly-kit

      - name: Build docs site
        run: npm run build --workspace=sites/docs
        env:
          NODE_ENV: production

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: sites/docs/build

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2: Commit**

```bash
git add .github/workflows/docs.yml
git commit -m "ci: add GitHub Actions workflow for docs deployment"
```

---

### Task 8: Install Dependencies and Test

**Step 1: Install dependencies from root**

Run: `npm install`

**Step 2: Build scrolly-kit package**

Run: `npm run package --workspace=@the-vcsi/scrolly-kit`

**Step 3: Run docs dev server**

Run: `npm run dev --workspace=sites/docs`
Expected: Dev server starts at http://localhost:5173

**Step 4: Verify pages work**

- Navigate to `/` - Getting Started page loads
- Navigate to `/reference` - Reference page loads with diagrams
- Navigate to `/examples` - Examples grid loads

**Step 5: Test production build**

Run: `npm run build --workspace=sites/docs && npm run preview --workspace=sites/docs`
Expected: Preview server starts, all pages work with base path

**Step 6: Final commit**

```bash
git add -A
git commit -m "feat(docs): complete docs site setup"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Update root workspaces |
| 2 | Create docs site scaffold (package.json, configs) |
| 3 | Create app styles and root layout |
| 4 | Create Getting Started page |
| 5 | Create Reference page |
| 6 | Create Examples page |
| 7 | Create GitHub Actions workflow |
| 8 | Install dependencies and test |
