<script>
  import TableOfContents from '$lib/components/TableOfContents.svelte';
  import ShowcaseGrid from '$lib/components/ShowcaseGrid.svelte';
  import { CopyCodeBlock } from '@the-vcsi/scrolly-kit';


  const fullscreenExamples = [
    {
      title: 'Hello Stranger',
      url: 'https://pudding.cool/2025/06/hello-stranger/',
      thumbnail: '/hello-stranger.jpg',
      source: 'The Pudding'
    },
    {
      title: 'Visualizing neglect',
      url: 'https://endfund.org/visualizing-neglect/',
      thumbnail: '/visualizing-neglect.jpg',
      source: 'Nadieh Bremer'
    },
  ];

  const sections = [
    { id: 'story', label: 'Story Container' },
    { id: 'split-layout', label: 'Split Layout' },
    { id: 'fullscreen-layout', label: 'Fullscreen Layout' },
    { id: 'dashboard-layout', label: 'Dashboard Layout' },
    { id: 'step-styling', label: 'Step Styling' },
    { id: 'css-variables', label: 'CSS Variables' }
  ];
</script>

<svelte:head>
  <title>Reference - scrolly-kit</title>
</svelte:head>

<div class="reference-layout">
  <article class="page">
    <h1>Reference</h1>
    <p>Layout patterns and CSS variables for scrollytelling stories.</p>

    <!-- STORY CONTAINER -->
    <section id="story">
      <h2>Story Container</h2>
      <p>The <code>.story</code> class is the main container for scrollytelling content. It provides:</p>
      <ul>
        <li>Centered prose by default (max-width 600px)</li>
        <li>Light theme isolation from global dark mode</li>
        <li>Padding and spacing for readability</li>
      </ul>

      <div class="layout-diagram">
        <div class="diagram-story">
          <div class="diagram-label">.story</div>
          <div class="diagram-padding-top">
            <span>padding-top: 5.5rem</span>
          </div>
          <div class="diagram-prose">
            <div class="diagram-label">Centered prose (600px)</div>
            <p>Title & intro text...</p>
          </div>
          <div class="diagram-layout-break">
            <div class="diagram-padding-side left"></div>
            <div class="diagram-layout-inner">
              <div class="diagram-label">Layout (breaks prose, keeps padding)</div>
            </div>
            <div class="diagram-padding-side right"></div>
          </div>
          <div class="diagram-prose">
            <p>More prose content...</p>
          </div>
          <div class="diagram-padding-bottom">
            <span>padding-bottom: 7.5rem</span>
          </div>
        </div>
      </div>

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
      <p>Two-column layout with a sticky visualization panel and scrolling content. While it breaks out of the prose max-width, it maintains its own side padding (2rem by default) rather than going edge-to-edge like <code>.fullscreen-layout</code>.</p>

      <div class="layout-diagram">
        <div class="diagram-story">
          <div class="diagram-label">.story</div>
          <div class="diagram-padding-top">
            <span>padding-top: 5.5rem</span>
          </div>
          <div class="diagram-prose">
            <div class="diagram-label">Centered prose (600px)</div>
            <p>Title & intro text...</p>
          </div>
          <div class="diagram-split-wrapper">
            <div class="diagram-padding-side left"></div>
            <div class="diagram-split">
              <div class="diagram-column-labels">
                <span class="diagram-col-label">1fr (remaining)</span>
                <span class="diagram-col-label">minmax(450px, 45%)</span>
              </div>
              <div class="diagram-split-grid">
                <div class="diagram-content">
                  <div class="diagram-label">scrolly-content</div>
                  <div class="diagram-spacer">spacer</div>
                  <div class="diagram-steps">
                    <div class="diagram-step">Step 1</div>
                    <div class="diagram-step">Step 2</div>
                    <div class="diagram-step">Step 3</div>
                  </div>
                  <div class="diagram-spacer">spacer</div>
                </div>
                <div class="diagram-gap-indicator">
                  <span>2rem gap</span>
                </div>
                <div class="diagram-panel">
                  <div class="diagram-label">sticky-panel</div>
                  <div class="diagram-viz">Visualization</div>
                </div>
              </div>
            </div>
            <div class="diagram-padding-side right"></div>
          </div>
          <div class="diagram-prose">
            <p>More prose content...</p>
          </div>
          <div class="diagram-padding-bottom">
            <span>padding-bottom: 7.5rem</span>
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
          <tr><td><code>--step-height</code></td><td>90vh</td><td>Vertical space between steps</td></tr>
          <tr><td><code>--spacer-height</code></td><td>65vh</td><td>Height of top/bottom spacers</td></tr>
        </tbody>
      </table>

      <h3>Mobile Behavior</h3>
      <p>On screens &lt;768px, the layout stacks with the sticky panel as a full-screen background and content overlaying it.</p>

      <h3>Cookbook</h3>
      <h4>Customizing Panel Size</h4>
      <p>To give the visualization more space while capping its absolute width:</p>

      <div class="layout-diagram">
        <div class="diagram-custom-split">
          <div class="diagram-column-labels">
            <span class="diagram-col-label">1fr (remaining)</span>
            <span class="diagram-col-label custom">minmax(400px, 60%)</span>
          </div>
          <div class="diagram-custom-grid">
            <div class="diagram-content-narrow">
              <div class="diagram-label">scrolly-content</div>
              <div class="diagram-step">Steps...</div>
            </div>
            <div class="diagram-gap-indicator">
              <span>2rem</span>
            </div>
            <div class="diagram-panel-wide">
              <div class="diagram-label">sticky-panel</div>
              <div class="diagram-max-width-cap">
                <span>max-width: 700px</span>
              </div>
              <div class="diagram-viz">Visualization (larger)</div>
            </div>
          </div>
        </div>
      </div>

      <CopyCodeBlock command={`.split-layout {
  --vcsi-panel-width: 60%;
  --vcsi-panel-min-width: 400px;
}

.sticky-panel {
  max-width: 700px;
}`} />
      <p>The grid uses <code>minmax(min-width, width)</code>, so the panel scales between the min and percentage values. Adding <code>max-width</code> on <code>.sticky-panel</code> caps the absolute size on wide screens.</p>
    </section>

    <!-- FULLSCREEN LAYOUT -->
    <section id="fullscreen-layout">
      <h2>Fullscreen Layout</h2>
      <p>Full-viewport immersive layout for dramatic visualizations.</p>

      <div class="layout-diagram">
        <div class="diagram-fullscreen-wrapper">
          <div class="diagram-width-label">
            <span>100vw (edge-to-edge)</span>
          </div>
          <div class="diagram-fullscreen">
            <div class="diagram-panel-full">
              <div class="diagram-label">sticky-panel (100vh)</div>
              <div class="diagram-viz">Full-screen Visualization</div>
            </div>
            <div class="diagram-content-overlay">
              <div class="diagram-step-constrained">
                <div class="diagram-step-width-label">max-width: 500px</div>
                <div class="diagram-step">Step (overlaid)</div>
              </div>
            </div>
          </div>
          <div class="diagram-breakout-note">
            <code>margin-left: calc(-50vw + 50%)</code> breaks out of container
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

      <h3>Cookbook</h3>
      <h4>Repositioning Step Boxes</h4>
      <p>By default, step boxes are horizontally centered via <code>margin: 0 auto</code> on <code>.scrolly-content</code>. Override to position them differently:</p>

      <div class="layout-diagram">
        <div class="diagram-step-positions">
          <div class="diagram-position left">
            <div class="diagram-step-mini">Step</div>
            <span class="diagram-position-label">Left</span>
          </div>
          <div class="diagram-position center">
            <div class="diagram-step-mini">Step</div>
            <span class="diagram-position-label">Center (default)</span>
          </div>
        </div>
      </div>

      <CopyCodeBlock label="Repositioning step boxes (CSS)" command={`/* Left-aligned steps */
.fullscreen-layout .scrolly-content {
  margin-left: 2rem;
  margin-right: auto;
}
`} />
      <p>The <code>margin-left: auto</code> / <code>margin-right: auto</code> pattern pushes the content to the opposite side. Add a fixed margin on the aligned side for padding from the edge.</p>

      <h3>Examples in the Wild</h3>
      <p>Inspiring fullscreen scrollytelling stories from around the web.</p>
      <ShowcaseGrid examples={fullscreenExamples} />
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

    <!-- STEP STYLING -->
    <section id="step-styling">
      <h2>Step Styling</h2>
      <p>Step boxes in scrolly layouts use these CSS variables for colors and sizing. These apply to both <code>.split-layout</code> and <code>.fullscreen-layout</code>.</p>

      <div class="layout-diagram">
        <div class="diagram-themes">
          <div class="diagram-theme diagram-theme-light">
            <div class="diagram-label">Light Theme</div>
            <div class="diagram-step-preview active">Active Step</div>
            <div class="diagram-step-preview inactive">Inactive Step</div>
          </div>
          <div class="diagram-theme diagram-theme-dark">
            <div class="diagram-label">Dark Theme</div>
            <div class="diagram-step-preview active">Active Step</div>
            <div class="diagram-step-preview inactive">Inactive Step</div>
          </div>
        </div>
      </div>

      <h3>CSS Variables</h3>
      <table class="docs-table">
        <thead>
          <tr><th>Variable</th><th>Light</th><th>Dark</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--story-step-bg</code></td><td>#fff</td><td>#2a2a2a</td><td>Active step background</td></tr>
          <tr><td><code>--story-step-fg</code></td><td>#333</td><td>#e8e8e8</td><td>Active step text color</td></tr>
          <tr><td><code>--story-step-bg-inactive</code></td><td>#f5f5f5</td><td>#222</td><td>Inactive step background</td></tr>
          <tr><td><code>--story-step-fg-inactive</code></td><td>#ccc</td><td>#666</td><td>Inactive step text color</td></tr>
          <tr><td><code>--step-box-shadow</code></td><td colspan="2">1px 1px 10px rgba(0,0,0,0.2)</td><td>Step box shadow</td></tr>
          <tr><td><code>--step-max-width</code></td><td colspan="2">600px</td><td>Maximum width of step box</td></tr>
          <tr><td><code>--step-padding</code></td><td colspan="2">1rem</td><td>Padding inside step box</td></tr>
          <tr><td><code>--step-border-radius</code></td><td colspan="2">5px</td><td>Step box corner radius</td></tr>
          <tr><td><code>--step-text-align</code></td><td colspan="2">center</td><td>Text alignment in steps</td></tr>
        </tbody>
      </table>
      <p><strong><code>--story-step-*</code></strong> variables control colors and are typically set globally in <code>app.css</code> for consistent theming across your story. <strong><code>--step-*</code></strong> variables control layout and can be set per-section for local customization.</p>

      <h3>Example Override</h3>
      <CopyCodeBlock label="Custom step colors" command={`.split-layout {
  --story-step-bg: #154734;
  --story-step-fg: #fff;
}`} />

      <p>For a minimal look where only text floats over the visualization:</p>
      <CopyCodeBlock label="Minimal floating text" command={`.split-layout {
  --story-step-bg: transparent;
  --story-step-bg-inactive: transparent;
  --step-box-shadow: none;
}`} />
    </section>

    <!-- CSS VARIABLES -->
    <section id="css-variables">
      <h2>Global CSS Variables</h2>
      <p>These tokens are available throughout your project. See the full <a href="https://github.com/Vermont-Complex-Systems/vcsi-starter/blob/main/packages/scrolly-kit/src/lib/styles/tokens.css" target="_blank" rel="noopener">tokens.css source</a> for all available variables.</p>

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
        </tbody>
      </table>
    </section>
  </article>

  <TableOfContents {sections} />
</div>

<style>
  .reference-layout {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 2rem 0;
  }

  .page h1 {
    margin-top: 0;
  }

  section {
    margin-top: 4rem;
    padding-top: 1rem;
    scroll-margin-top: 5rem;
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

  @media (max-width: 900px) {
    .reference-layout {
      padding: 1rem;
    }
  }

  /* Diagram styles */
  .diagram-split-wrapper {
    display: flex;
    align-items: stretch;
    border: 1px dashed var(--vcsi-border);
    border-radius: 4px;
    overflow: hidden;
  }

  .diagram-split {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
  }

  .diagram-column-labels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 0.25rem;
  }

  .diagram-col-label {
    font-size: 0.65rem;
    font-family: var(--vcsi-font-mono);
    color: var(--vcsi-gray-500);
    text-align: center;
    padding: 0.125rem 0.25rem;
    background: var(--vcsi-gray-100);
    border-radius: 3px;
  }

  .diagram-split-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0;
    min-height: 180px;
    flex: 1;
  }

  .diagram-gap-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    position: relative;
  }

  .diagram-gap-indicator span {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 0.6rem;
    color: var(--vcsi-gray-500);
    white-space: nowrap;
  }

  .diagram-gap-indicator::before,
  .diagram-gap-indicator::after {
    content: '';
    position: absolute;
    left: 50%;
    width: 1px;
    height: 30%;
    background: var(--vcsi-gray-300);
    border-style: dashed;
  }

  .diagram-gap-indicator::before {
    top: 0;
  }

  .diagram-gap-indicator::after {
    bottom: 0;
  }

  /* Custom panel size diagram */
  .diagram-custom-split {
    border: 1px dashed var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem;
    background: var(--vcsi-gray-50);
  }

  .diagram-custom-split .diagram-column-labels {
    grid-template-columns: 1fr 1.5fr;
  }

  .diagram-col-label.custom {
    background: var(--vcsi-color-accent, #154734);
    color: white;
  }

  .diagram-custom-grid {
    display: grid;
    grid-template-columns: 1fr auto 1.5fr;
    gap: 0;
    min-height: 120px;
  }

  .diagram-content-narrow,
  .diagram-panel-wide {
    border: 2px dashed var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  .diagram-panel-wide {
    position: relative;
  }

  .diagram-max-width-cap {
    position: absolute;
    top: -0.5rem;
    right: 0.5rem;
    font-size: 0.6rem;
    font-family: var(--vcsi-font-mono);
    color: white;
    background: var(--vcsi-color-accent, #154734);
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
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

  /* Story diagram */
  .diagram-story {
    border: 2px dashed var(--vcsi-border);
    border-radius: 4px;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: var(--vcsi-gray-50);
  }

  .diagram-prose {
    background: white;
    border: 1px solid var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem 1rem;
    max-width: 200px;
    margin: 0 auto;
    text-align: center;
    font-size: 0.8rem;
    color: var(--vcsi-gray-600);
  }

  .diagram-prose p {
    margin: 0;
  }

  .diagram-layout-break {
    display: flex;
    align-items: stretch;
    border: 1px dashed var(--vcsi-border);
    border-radius: 4px;
    overflow: hidden;
  }

  .diagram-padding-side {
    width: 24px;
    min-height: 50px;
    background: repeating-linear-gradient(
      45deg,
      var(--vcsi-gray-100),
      var(--vcsi-gray-100) 4px,
      var(--vcsi-gray-200) 4px,
      var(--vcsi-gray-200) 8px
    );
    border: 1px dashed var(--vcsi-gray-300);
    position: relative;
  }

  .diagram-padding-side::after {
    content: '2rem';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-90deg);
    font-size: 0.6rem;
    color: var(--vcsi-gray-500);
    white-space: nowrap;
  }

  .diagram-layout-inner {
    flex: 1;
    background: var(--vcsi-gray-200);
    padding: 0.75rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .diagram-padding-top,
  .diagram-padding-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    font-size: 0.7rem;
    color: var(--vcsi-gray-500);
    border: 1px dashed var(--vcsi-gray-300);
    border-radius: 4px;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 4px,
      var(--vcsi-gray-100) 4px,
      var(--vcsi-gray-100) 8px
    );
  }

  .diagram-spacer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    font-size: 0.65rem;
    color: var(--vcsi-gray-400);
    border: 1px dashed var(--vcsi-gray-300);
    border-radius: 3px;
    background: var(--vcsi-gray-100);
  }

  /* Step theme diagram */
  .diagram-themes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .diagram-theme {
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .diagram-theme-light {
    background: #f8f8f8;
  }

  .diagram-theme-dark {
    background: #1a1a1a;
  }

  .diagram-theme-dark .diagram-label {
    color: #999;
  }

  .diagram-step-preview {
    border-radius: 6px;
    padding: 0.75rem 1rem;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .diagram-theme-light .diagram-step-preview.active {
    background: #fff;
    color: #333;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .diagram-theme-light .diagram-step-preview.inactive {
    background: #f5f5f5;
    color: #ccc;
  }

  .diagram-theme-dark .diagram-step-preview.active {
    background: #2a2a2a;
    color: #e8e8e8;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .diagram-theme-dark .diagram-step-preview.inactive {
    background: #222;
    color: #666;
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

  .diagram-fullscreen-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .diagram-width-label {
    text-align: center;
    font-size: 0.7rem;
    font-family: var(--vcsi-font-mono);
    color: var(--vcsi-gray-500);
    padding: 0.25rem 0.5rem;
    background: var(--vcsi-gray-100);
    border-radius: 3px;
    align-self: center;
  }

  .diagram-fullscreen {
    position: relative;
    height: 200px;
    border: 2px solid var(--vcsi-color-accent, #154734);
    border-radius: 4px;
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

  .diagram-step-constrained {
    position: relative;
  }

  .diagram-step-width-label {
    position: absolute;
    top: -1.25rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.6rem;
    font-family: var(--vcsi-font-mono);
    color: white;
    background: var(--vcsi-color-accent, #154734);
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    white-space: nowrap;
  }

  .diagram-breakout-note {
    text-align: center;
    font-size: 0.7rem;
    color: var(--vcsi-gray-500);
  }

  .diagram-breakout-note code {
    font-size: 0.65rem;
  }

  /* Step positions diagram */
  .diagram-step-positions {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    padding: 1rem;
    background: var(--vcsi-gray-100);
    border-radius: 4px;
    border: 2px solid var(--vcsi-color-accent, #154734);
  }

  .diagram-position {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    min-height: 80px;
  }

  .diagram-position.left {
    align-items: flex-start;
  }

  .diagram-position.right {
    align-items: flex-end;
  }

  .diagram-step-mini {
    background: white;
    border: 1px solid var(--vcsi-border);
    border-radius: 4px;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }

  .diagram-position-label {
    font-size: 0.65rem;
    color: var(--vcsi-gray-500);
    font-family: var(--vcsi-font-mono);
  }

  .diagram-position.center .diagram-position-label {
    color: var(--vcsi-color-accent, #154734);
    font-weight: 600;
  }

  .diagram-dashboard {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 0.5rem;
    height: 200px;
  }

  /* Dark mode overrides */
  :global(.dark) code {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-200);
  }

  :global(.dark) .diagram-step {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-fg);
  }

  :global(.dark) .diagram-viz,
  :global(.dark) .diagram-controls {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .diagram-label {
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .diagram-story {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-prose {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-300);
  }

  :global(.dark) .diagram-layout-break {
    border-color: var(--vcsi-gray-700);
  }

  :global(.dark) .diagram-layout-inner {
    background: var(--vcsi-gray-800);
  }

  :global(.dark) .diagram-padding-side {
    background: repeating-linear-gradient(
      45deg,
      var(--vcsi-gray-900),
      var(--vcsi-gray-900) 4px,
      var(--vcsi-gray-800) 4px,
      var(--vcsi-gray-800) 8px
    );
    border-color: var(--vcsi-gray-700);
  }

  :global(.dark) .diagram-padding-side::after {
    color: var(--vcsi-gray-500);
  }

  :global(.dark) .diagram-split-wrapper {
    border-color: var(--vcsi-gray-700);
  }

  :global(.dark) .diagram-col-label {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .diagram-gap-indicator span {
    color: var(--vcsi-gray-500);
  }

  :global(.dark) .diagram-gap-indicator::before,
  :global(.dark) .diagram-gap-indicator::after {
    background: var(--vcsi-gray-600);
  }

  :global(.dark) .diagram-padding-top,
  :global(.dark) .diagram-padding-bottom {
    color: var(--vcsi-gray-500);
    border-color: var(--vcsi-gray-700);
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 4px,
      var(--vcsi-gray-800) 4px,
      var(--vcsi-gray-800) 8px
    );
  }

  :global(.dark) .diagram-spacer {
    color: var(--vcsi-gray-500);
    border-color: var(--vcsi-gray-700);
    background: var(--vcsi-gray-800);
  }

  :global(.dark) .diagram-custom-split {
    background: var(--vcsi-gray-900);
    border-color: var(--vcsi-gray-700);
  }

  :global(.dark) .diagram-content-narrow,
  :global(.dark) .diagram-panel-wide {
    border-color: var(--vcsi-gray-600);
  }

  :global(.dark) .diagram-width-label {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .diagram-fullscreen {
    border-color: var(--vcsi-color-accent, #154734);
  }

  :global(.dark) .diagram-breakout-note {
    color: var(--vcsi-gray-500);
  }

  :global(.dark) .diagram-step-positions {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-step-mini {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-200);
    border-color: var(--vcsi-gray-600);
  }

  :global(.dark) .diagram-position-label {
    color: var(--vcsi-gray-500);
  }
</style>
