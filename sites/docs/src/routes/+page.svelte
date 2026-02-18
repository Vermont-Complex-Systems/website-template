<script>
  import { base } from '$app/paths';
  import { CopyCodeBlock } from '@the-vcsi/scrolly-kit';
  import { ArrowRight } from '@lucide/svelte';
  import LinkableHeader from '$lib/components/LinkableHeader.svelte';
</script>

<svelte:head>
  <title>scrolly-kit - Getting Started</title>
</svelte:head>

<article class="page">
  <header class="hero">
    <h1 class="tagline">Minimal CSS Framework<br />for data-driven stories</h1>
    <p class="subheader">Built for scientists in a hurry who want to tell data stories without learning full web development. <a href="https://www.npmjs.com/package/@the-vcsi/scrolly-kit">@the-vcsi/scrolly-kit</a> provides the engine—CSS tokens and reusable components—while templates give you a ready-to-customize website. Extend with <code>sv</code> add-ons for integrations like SharePoint or <a href="https://openalex.org/">OpenAlex</a>.</p>
  </header>

  <h2>Quick Start</h2>

  <h3>1. Scaffold a new project</h3>
  <CopyCodeBlock command={`npx degit Vermont-Complex-Systems/vcsi-starter/templates/baked my-project
cd my-project
npm install`} />
  <p class="tip"><strong>Tip:</strong> <a href="https://github.com/Rich-Harris/degit" target="_blank" rel="noopener">degit</a> copies a Git repo without its history—like cloning, but faster and cleaner. Requires <a href="https://nodejs.org/en/download" target="_blank" rel="noopener">Node.js</a>. Also note we have a single static-site generator template at the moment, or the <code>baked</code> template. It is <code>baked</code> in that the content is baked-in when building, or pre-rendered. We are planning to provide a second template soon enough, the <code>fresh</code> template, where we showcase how dynamic websites can be used to augment visual data-driven stories with backend capabilities.
  <span class="github-row">For more on the baked template visit <a href="https://github.com/Vermont-Complex-Systems/vcsi-starter/tree/main/templates/baked" target="_blank" rel="noopener noreferrer" class="github-link">GitHub <ArrowRight size={16} /></a></span></p>
  <h3>2. Start the dev server</h3>
  <CopyCodeBlock command={`npm run dev`} />

  <h3>3. Create a new story</h3>
  <CopyCodeBlock command={`npm run new-story my-story-name`} />

  <p>This creates a story scaffold at <code>src/lib/stories/my-story-name/</code> with:</p>
  <ul>
    <li><code>components/Index.svelte</code> - Main story component</li>
    <li><code>data/copy.json</code> - Story content data</li>
  </ul>

  <h3>4. Add optional integrations (optional)</h3>
  <p>With any template scaffolded using <code>degit</code>, you can make use of Svelte's <code>sv</code> CLI to install additional extensions</p>
  <CopyCodeBlock command={`npx sv add @the-vcsi/msgraph`} />
  <p class="tip"><strong>msgraph:</strong> Sync your <code>copy.json</code> story content from an Excel sheet on SharePoint—great for collaborative editing with non-technical teammates.</p>

  <CopyCodeBlock command={`npx sv add @the-vcsi/openalex`} />
  <p class="tip"><strong>openalex:</strong> Provide a list of researcher identifiers and build a local database with metadata about their papers and co-authors from <a href="https://openalex.org/" target="_blank" rel="noopener">OpenAlex</a>.</p>

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

  <p>See the <a href="{base}/reference">Styling</a> for all available CSS variables.</p>

  <h2>Inspiration</h2>
  <ul>
    <li><a href="https://picocss.com/" target="_blank" rel="noopener">pico.css</a> - Minimal CSS Framework for Semantic HTML. This is our core inspiration for making scrolly-kit into a library.</li>
    <li><a href="https://astro.build//" target="_blank" rel="noopener">astrojs</a> - The web framework for content-driven websites. This is our core inspiration for making cool static-site templates.</li>
    <li><a href="https://design-system.canada.ca/en/start-to-use/" target="_blank" rel="noopener">GC Design System</a> and  <a href="https://frontend.design-system.service.gov.uk/" target="_blank" rel="noopener">GOV.UK Frontend</a> - Governments have to provide services to everybody, forcing them to be super sharp in terms of accessibility. The value of this should not be overlooked.</li>
    <li><a href="https://layercake.graphics/" target="_blank" rel="noopener">Layer Cake</a> - Headless graphics framework for Svelte. On top of being awesome charting library, they showcase the beauty of simply copy-pasting well-designed components.</li>
  </ul>

    <h2>Next Steps</h2>
  <ul>
    <li><a href="{base}/reference">Styling</a> - Layout patterns and CSS variables</li>
    <li><a href="{base}/components">Components</a> - Reusable components used across templates </li>
    <li><a href="https://vcsi.cmplxsys.w3.uvm.edu/" target="_blank" rel="noopener">Examples</a> - See pedagogical stories built with scrolly-kit</li>
  </ul>
  

  <LinkableHeader id="page">P.S. Who is this library for?</LinkableHeader>

  <p>As of today (2026-02-18), LLMs like <code>Claude Sonnet 4.6</code> can write you professionally-looking static websites using only vanilla HTML/CSS/JS in no time. As a matter of fact, Claude did help design and polish this website. So why bother with this library?</p>
  
  <p><code>Scrolly-kit</code> has been designed to help you understand the choices you are making when building data-driven stories. These choices are reflected in the code and documentation, built and curated to be understood by people with as little technical knowledge of web design as we find possible with today's tools.</p>
  
  <p>For instance, we favor <a href="https://svelte.dev/">Svelte</a> over <a href="https://react.dev/">React</a> because we believe the design of Svelte is closer to the fundamental tools of the web (HTML/CSS). Arguably, Svelte has been shown to be more approachable to newcomers, and does not require learning a whole ecosystem to get going. Some people prefere React because there is a whole ecosystem, such that they do not need to understand as much. This library is opinionated in that we believe the web underpinnings should be understandable by humans, and Svelte's <a href="https://youtu.be/UegUi2fWBaU?si=ean3uBlmNxH2_2AB">North Star</a> is precisely to make the web better in that way.</p>

  <p>The design choices that went into the structure of <code>scrolly-kit</code> and accompanying templates also include making what we can for motivated users to learn why we are styling the website the way we do. Inspired by talks like Josh Comeau's <a href="https://youtu.be/ZPTVr2pS0XE?si=A1vymxJE4Dsc336p">How to teach CSS</a>, the goal of this website is to nurture a growing mindset where styling is fun. With others, we acknowledge that <a href="https://cassidoo.co/post/vibe-coding-yawn/">Vibe Coding is somewhat boring</a>, and that this is vital to keep enjoying building software that is defining our lives in many ways these days.</p>
  
  <p>So although you can use this library to just keep going for making cool data-driven stories, know that if you just want to show off a cool scrolly story most likely you can vibe code it with minimal effort. Some part of this website have been vibecoded, but not the important bits. This section was written by humans who are thinking and are struggling with reconciling productivity with the possible death of code as craft. This library is meant to <b>learn and nurture a web platform that can host tailored data stories you own</b>; where you can learn and improve yourself to have a space to tell your stories. The upshot is that if you end up running out of tokens on your subscription, you will be able to keep writing fun and whimsical stories until your weekly limits are reset.</p>
  
</article>

<style>
  .hero {
    position: relative;
    padding: 2rem 0 3rem;
    margin-bottom: 1rem;
  }

  /* Matisse-inspired decorative shapes around the hero */
  .hero::before {
    content: '';
    position: absolute;
    top: -1rem;
    left: -4rem;
    width: 100px;
    height: 140px;
    background: var(--matisse-primary);
    opacity: 0.15;
    border-radius: 50% 50% 50% 50% / 60% 40% 60% 40%;
    transform: rotate(-25deg);
    pointer-events: none;
  }

  .hero::after {
    content: '';
    position: absolute;
    top: 1rem;
    right: -3rem;
    width: 70px;
    height: 100px;
    background: var(--matisse-accent);
    opacity: 0.2;
    border-radius: 50% 50% 50% 50% / 40% 60% 40% 60%;
    transform: rotate(15deg);
    pointer-events: none;
  }

  .tagline {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 1rem;
    position: relative;
  }

  /* Decorative leaf shape accent */
  .tagline::after {
    content: '';
    display: block;
    width: 40px;
    height: 12px;
    background: var(--matisse-accent);
    margin: 1.5rem auto 0;
    border-radius: 50%;
    transform: rotate(-5deg);
  }

  .subheader {
    text-align: center;
    font-size: 1.1rem;
    opacity: 0.75;
    margin-bottom: 2rem;
  }


  .github-row {
    display: inline-flex;
  }

  .github-link {
    display: inline-flex;
    align-items: center;
    gap: var(--vcsi-space-xs);
    font-weight: 500;
    color: var(--vcsi-fg);
    text-decoration: none;
    margin-left: var(--vcsi-space-xs);
    transition: gap var(--vcsi-transition-base);
  }

  .github-link:hover {
    gap: var(--vcsi-space-sm);
  }

  @media (max-width: 600px) {
    .hero {
      padding: 1rem 0 2rem;
    }

    .hero::before,
    .hero::after {
      display: none;
    }

    .tagline {
      text-align: left;
      font-size: 1.75rem;
      margin-top: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .tagline::after {
      margin: 1rem 0 0;
    }

    .subheader {
      text-align: left;
      margin-bottom: 2rem;
    }
  }

  pre {
    margin: 1rem 0;
  }

  ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.5rem 0;
  }

  .tip {
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
</style>
