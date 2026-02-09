<script>
    import BackToHome from '$lib/components/helpers/BackToHome.svelte';
    import ScrollyContent from '$lib/components/helpers/ScrollyContent.svelte';

    let { story, data } = $props();

    let scrollyIndex = $state(undefined);
    let layoutMode = $state('side-by-side');
    
    const chartData = [20, 35, 25, 45];

    // Demo steps - uses different content types to showcase options
    const demoSteps = [
        { type: 'html', value: 'Step 0: I am ACTIVE (green background).'},
        { type: 'markdown', value: 'Step 1: Now I am **ACTIVE**. Step 0 above turned red. The red bar moved too.' },
        { type: 'html', value: 'Step 2: This has a <a href="#">link</a>. Does it match the text color or stay blue?' },
        { type: 'html', value: 'Step 3: Last step. Scroll back up to see steps become active again.' }
    ];

</script>

<BackToHome />

<article class="story docs">

<h1 class="prose">Deep Scrolly Dive</h1>

<section class="prose">
    <p>How to create custom scroll-driven stories with charts that respond to the reader's position.</p>
</section>

<h2 class="prose">How It Works</h2>

<section class="prose">
    <ol>
        <li><strong>Scroll tracking</strong> — An <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API">IntersectionObserver</a> watches each step box and measures how much of it is visible</li>
        <li><strong>Active step</strong> — The step with the highest visibility ratio becomes "active" (green background, dark text)</li>
        <li><strong>Inactive steps</strong> — All other steps are "inactive" (red background, muted text)</li>
        <li><strong>Chart updates</strong> — The <code>scrollyIndex</code> value changes, which you can bind to your chart</li>
        <li><strong>Content types</strong> — Each step specifies a <code>type</code>: <code>html</code>, <code>markdown</code>, <code>math</code>, or <code>code</code>. Invalid types trigger a console warning</li>
        <li><strong>Rich rendering</strong> — The <code>markdown</code> and <code>math</code> types use <code>MarkdownRenderer</code> which supports GFM, KaTeX math (<code>$...$</code>), and syntax-highlighted code blocks</li>
        <li><strong>Customizable</strong> — CSS variables control colors, spacing (<code>--step-height</code>), and dimensions</li>
    </ol>
    </section>

    <h2 class="prose">Live Demo</h2>

    <section class="prose">
        <p><strong>How active detection works:</strong> The step that is most visible in your viewport becomes "active".
        When active, it gets a green background. All other steps are "inactive" with a red background.
        Scroll slowly through the steps below to see the transition.</p>
    </section>

    <div class="scrolly-section">
        <div class="demo-controls">
            <span>Current step: <strong>{scrollyIndex ?? ''}</strong></span>
            <div class="layout-toggle">
                <button
                    class:active={layoutMode === 'side-by-side'}
                    onclick={() => layoutMode = 'side-by-side'}
                >
                    Side-by-side
                </button>
                <button
                    class:active={layoutMode === 'fullscreen'}
                    onclick={() => layoutMode = 'fullscreen'}
                >
                    Fullscreen
                </button>
            </div>
        </div>

        <!-- <section id="scrolly" class="scrolly-with-chart"> -->
        <section class={layoutMode === 'fullscreen' ? 'scrolly-fullscreen' : 'scrolly-with-chart'}>
            <div class="scrolly-chart">
                <div class="chart-container">
                    <svg viewBox="0 0 300 200" class="chart-svg">
                        <rect width="300" height="200" fill="#f4efea" rx="8"/>
                        {#each chartData as value, i}
                            <rect
                                x={30 + i * 65}
                                y={180 - value * 3}
                                width="50"
                                height={value * 3}
                                fill={scrollyIndex === i ? '#ff6b6b' : '#4ecdc4'}
                                rx="4"
                                class="chart-bar"
                            />
                        {/each}
                        <text x="150" y="30" text-anchor="middle" class="chart-label">
                            Step: {scrollyIndex ?? '–'}
                        </text>
                    </svg>
                </div>
            </div>
            <div class="stepContainer">
                <ScrollyContent steps={demoSteps} bind:value={scrollyIndex} />
            </div>
        </section>
    </div>

    <h2 class="prose">Basic Usage</h2>

    <section class="prose">
        <pre><code>{`<script>
    import ScrollyContent from '$lib/components/helpers/ScrollyContent.svelte';

    let scrollyIndex = $state(undefined);

    const steps = [
        { type: 'text', value: 'First step content' },
        { type: 'text', value: 'Second step content' },
    ];
</script>

<section class="scrolly-with-chart">
    <div class="scrolly-chart">
        <!-- Your chart component here -->
        <MyChart step={scrollyIndex} />
    </div>

    <ScrollyContent steps={steps} bind:value={scrollyIndex} />
</section>`}</code></pre>
    </section>

    <h2 class="prose">Layout Patterns</h2>

    <section class="prose">
        <p><code>ScrollyContent</code> handles the step boxes and active state. But the <em>layout</em> (where the chart goes, how it sticks) comes from wrapper classes in <code>app.css</code>.</p>

        <h3><code>.scrolly-with-chart</code></h3>
        <p>Side-by-side on desktop, overlay on mobile. Chart sticks on the right while you scroll through steps on the left.</p>
        <pre><code>{`<section class="scrolly-with-chart">
    <div class="scrolly-chart">
        <MyChart step={scrollyIndex} />
    </div>
    <ScrollyContent steps={steps} bind:value={scrollyIndex} />
</section>`}</code></pre>
        <p>Default overrides: <code>--step-max-width: 400px</code></p>

        <h3><code>.scrolly-fullscreen</code></h3>
        <p>Chart fills the entire viewport as a background. Steps appear centered as floating boxes.</p>
        <pre><code>{`<section class="scrolly-fullscreen">
    <div class="scrolly-chart">
        <FullscreenViz step={scrollyIndex} />
    </div>
    <ScrollyContent steps={steps} bind:value={scrollyIndex} />
</section>`}</code></pre>
        <p>Default overrides: <code>--step-height: 100vh</code>, <code>--step-max-width: 500px</code></p>

        <h3>How they work together</h3>
        <p>The layout class sets CSS variables that <code>ScrollyContent</code> reads:</p>
        <pre><code>{`app.css (layout)          ScrollyContent (component)
─────────────────          ──────────────────────────
.scrolly-with-chart {      .step {
  --step-max-width: 400px;   max-width: var(--step-max-width, 600px);
}                          }`}</code></pre>
        <p>This separation means you can use <code>ScrollyContent</code> with custom layouts too—just set the CSS variables on your wrapper.</p>
    </section>

    <h2 class="prose">Steps Format</h2>

    <section class="prose">
        <p>Each step needs <code>type</code> and <code>value</code>. Valid types:</p>
        <ul>
            <li><code>html</code> — Raw HTML (use for plain text too)</li>
            <li><code>markdown</code> — Full Markdown via <code>MarkdownRenderer</code></li>
            <li><code>math</code> — LaTeX math centered in a container</li>
            <li><code>code</code> — Syntax-highlighted code block (optional <code>language</code> prop)</li>
        </ul>
        <pre><code>{`const steps = [
    { type: 'html', value: 'Plain text or <em>HTML</em>' },
    { type: 'markdown', value: '**Bold** and *italic*' },
    { type: 'math', value: '$E = mc^2$' },
    { type: 'code', value: 'console.log("hi")', language: 'javascript' }
];`}</code></pre>

        <h3 class="prose">Markdown features</h3>
        <p>The <code>markdown</code> type uses <code>MarkdownRenderer</code> which supports:</p>
        <ul>
            <li><strong>GFM</strong> — Tables, strikethrough, autolinks</li>
            <li><strong>Inline math</strong> — <code>$x^2$</code> renders as math</li>
            <li><strong>Block math</strong> — <code>$$...$$</code> for display equations</li>
            <li><strong>Code blocks</strong> — Syntax highlighting for JS, CSS, HTML, R, Svelte</li>
            <li><strong>Raw HTML</strong> — Embedded HTML passes through</li>
        </ul>

        <p>The <code>contentRenderer</code> prop lets you customize how steps render if the built-in types don't fit your needs.</p>
    </section>

    <h2 class="prose">Customization</h2>

    <section class="prose">
        <p>Override these CSS variables on <code>.scrolly-with-chart</code> to customize:</p>
        <pre><code>{`.scrolly-with-chart {
    /* Step box colors */
    --story-step-bg: white;           /* active background */
    --story-step-fg: #333;            /* active text */
    --story-step-bg-inactive: #f5f5f5; /* inactive background */
    --story-step-fg-inactive: #999;    /* inactive text */

    /* Step dimensions */
    --step-height: 90vh;       /* vertical space per step */
    --step-max-width: 600px;   /* max width of step box */
    --step-padding: 1rem;      /* padding inside box */
    --step-border-radius: 5px; /* corner rounding */
}`}</code></pre>
        <p><strong>Tip:</strong> To bring steps closer together, reduce <code>--step-height</code>. This demo uses <code>50vh</code>.</p>
    </section>

    <h2 class="prose">Active/Inactive Styling</h2>

    <section class="prose">
        <p>Each step gets <code>class:active={'{value === i}'}</code> which toggles the <code>.active</code> class.
        The CSS uses <code>.step-box</code> for styling:</p>
        <pre><code>{`/* Inactive (default) */
.step-box {
    background-color: var(--story-step-bg-inactive);
    color: var(--story-step-fg-inactive);
}

/* Active */
.step.active .step-box {
    background-color: var(--story-step-bg);
    color: var(--story-step-fg);
}`}</code></pre>
        <p>To override styles from a parent page, use <code>:global(.step-box)</code>.</p>
    </section>

    <h2 class="prose">Architecture</h2>

    <section class="prose">
        <h3>Components</h3>
        <ul>
            <li><strong>ScrollyContent.svelte</strong> — Renders steps with <code>.step-box</code>, handles active/inactive states</li>
            <li><strong>Scrolly.svelte</strong> — Core IntersectionObserver logic, tracks which child is most visible</li>
            <li><strong>ScrollySnippets.svelte</strong> — Content renderers for text, markdown, and HTML step types</li>
        </ul>

        <h3>Styles</h3>
        <ul>
            <li><strong>app.css</strong> — Layout patterns (<code>.scrolly-with-chart</code>, <code>.scrolly-fullscreen</code>) and color variables</li>
        </ul>

        <h3>Props</h3>
        <pre><code>{`<ScrollyContent
    steps={steps}           // Required: array of {type, value}
    bind:value={index}      // Current active step index
    topSpacer={true}        // Show spacer before first step
    bottomSpacer={true}     // Show spacer after last step
    contentRenderer={fn}    // Custom snippet for rendering steps
/>`}</code></pre>
    </section>

</article>

<style>
     .stepContainer {
            --step-height: 40vh;
        }
        
    /* Demo controls */
    .demo-controls {
        position: sticky;
        top: 0;
        z-index: 100;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 4rem;
        margin-bottom: 1rem;
        backdrop-filter: blur(8px);
        border-radius: 8px;
    }

    .layout-toggle {
        display: flex;
        gap: 0.5rem;
    }

    .layout-toggle button {
        padding: 0.5rem 1rem;
        border: 1px solid #ccc;
        background: white;
        border-radius: 4px;
        font-size: 0.875rem;
        transition: all 150ms ease;
    }

    .layout-toggle button:hover {
        border-color: #999;
    }

    .layout-toggle button.active {
        background: #333;
        color: white;
        border-color: #333;
    }

    .chart-container {
        position: relative;
        width: 100%;
        height: 100%;
    }
    
    svg {
        width: 100%;
        height: 100%;
    }

    
</style>