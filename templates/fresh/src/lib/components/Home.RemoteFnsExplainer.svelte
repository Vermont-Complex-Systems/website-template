<script>
  import { CodeBlock } from '@the-vcsi/scrolly-kit';

  const remoteCodeSnippet = `
export interface Story {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  externalUrl: string;
  tags: string;
  level: string;
}

const stories = storiesData as Story[];

// Glob for copy data - eager since it's small JSON
// https://vite.dev/guide/features#glob-import
const copyModules = import.meta.glob<{ default: Record<string, unknown> }>(
  '$lib/stories/*/data/copy.json',
  { eager: true }
);

// Query for getting all stories
export const getStories = query(async () => {
  return stories;
});

// Query for getting a single story by slug
export const getStory = query(v.string(), async (slug) => {
  const story = stories.find(d => d.slug === slug);

  if (!story) {
    error(404, 'Story not found');
  }

  // If it has an external URL, redirect to it
  if (story.externalUrl) {
    redirect(302, story.externalUrl);
  }

  // Load copy data using glob
  const copyPath = \`/src/lib/stories/\${slug}/data/copy.json\`;
  const copyData = copyModules[copyPath]?.default ?? {};

  return { story, copyData };
});
`;
</script>

<section class="remote-functions page">
  <h2>Remote Functions</h2>
  <p class="section-intro">
    This project uses SvelteKit's experimental <a href="https://svelte.dev/docs/kit/remote-functions" target="_blank" rel="noopener noreferrer">remote functions</a>. Declare functions in a <code>.remote.ts</code> file, import them in Svelte components like regular functions. On the server, they work exactly like regular functions. On the client, they become wrappers around fetch—it looks like you're calling a function, but it's doing a fetch call to the backend.
  </p>

  <div class="remote-layout">
    <CodeBlock code={remoteCodeSnippet} filename="src/lib/story.remote.ts" />

    <div class="remote-explanations">
      <div class="explanation">
        <h3>Better Co-location</h3>
        <p>Traditional loaders separate data fetching from usage—one file loads, another consumes, often deep in the component tree. Remote functions let you import data <em>where you need it</em>, keeping logic together.</p>
      </div>
      <div class="explanation">
        <h3>End-to-End Type Safety</h3>
        <p>With loaders, using <code>+server.ts</code> and regular fetch is completely untyped. Remote functions give you full type inference—the <code>Story</code> interface flows through to components automatically.</p>
      </div>
      <div class="explanation">
        <h3>Granular Control</h3>
        <p>Loaders reload at the page level. Need data only in a corner of your page under certain conditions? With loaders, you still load it always. Remote functions give you fine-grained control over what loads when.</p>
      </div>
      <div class="explanation">
        <h3>Secure &amp; Intuitive</h3>
        <p>Clear boundaries mean no accidental closures or security leaks. And because they're just functions, they're intuitive to use—even LLMs understand them immediately.</p>
      </div>
      <div class="dynamic-note">
        <span class="note-label">Dynamic advantage: no build-time route discovery</span>
        <p>With <code>adapter-node</code> and <code>query()</code>, routes are resolved at runtime. No need to read CSVs at build time or declare prerender entries — just add a story and it works.</p>
      </div>
    </div>
  </div>

  <p class="remote-cta">
    <span class="experimental-badge">Experimental</span>
    Remote functions are still evolving. Watch <a href="https://www.youtube.com/watch?v=0hy7PCbXyqs" target="_blank" rel="noopener noreferrer">Introducing SvelteKit Remote Functions</a> by Simon Holthausen. This template uses <code>query()</code> for runtime data fetching — swap to <code>prerender()</code> for static generation.
  </p>
</section>

<style>
.remote-functions {
  padding: 4rem var(--vcsi-page-inline-padding);
  margin-bottom: var(--vcsi-bottom-padding, 7.5rem);
  background: rgba(0, 0, 0, 0.02);
  overflow-x: hidden;
}

.remote-functions h2 {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-family: var(--vcsi-font-serif);
  margin: 0 0 var(--vcsi-space-md) 0;
  text-align: center;
}

.section-intro {
  max-width: 700px;
  margin: 0 auto var(--vcsi-space-xl);
  text-align: center;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--vcsi-gray-700);
}

.section-intro code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85em;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
}

:global(.dark) .section-intro code {
  background: rgba(255, 255, 255, 0.1);
}

.remote-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
  min-width: 0;
}

.remote-layout > * {
  min-width: 0;
}

.remote-explanations {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.explanation {
  padding: var(--vcsi-space-md) 1.25rem;
  background: var(--vcsi-bg);
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.explanation h3 {
  font-family: var(--vcsi-font-sans);
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 var(--vcsi-space-sm) 0;
  color: var(--vcsi-fg);
}

.explanation p {
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  color: var(--vcsi-gray-700);
}

.explanation code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8em;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
}

:global(.dark) .explanation code {
  background: rgba(255, 255, 255, 0.1);
}

.dynamic-note {
  padding: 1rem 1.25rem;
  background: rgba(21, 71, 52, 0.06);
  border: 1px solid rgba(21, 71, 52, 0.15);
  border-radius: 10px;
  position: relative;
}

.dynamic-note .note-label {
  position: absolute;
  top: -0.6rem;
  left: var(--vcsi-space-md);
  background: var(--vcsi-bg);
  padding: 0 var(--vcsi-space-sm);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #154734;
}

:global(.dark) .dynamic-note {
  background: rgba(21, 71, 52, 0.1);
  border-color: rgba(21, 71, 52, 0.25);
}

.dynamic-note p {
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
  color: var(--vcsi-gray-700);
}

.dynamic-note code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8em;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
}

.remote-cta {
  text-align: center;
  margin-top: var(--vcsi-space-lg);
  font-size: 0.95rem;
  color: var(--vcsi-gray-700);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.experimental-badge {
  display: inline-block;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .remote-functions {
    padding: 2.5rem var(--vcsi-page-inline-padding);
    padding-bottom: var(--vcsi-space-2xl, 3rem); /* reduced spacing on mobile */
  }

  .section-intro {
    font-size: 0.95rem;
    text-align: left;
    margin-bottom: 1.5rem;
  }

  .remote-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .remote-explanations {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .explanation {
    padding: 0.875rem 1rem;
  }

  .explanation h3 {
    font-size: 0.95rem;
  }

  .explanation p {
    font-size: 0.85rem;
  }

  .dynamic-note {
    padding: 0.875rem 1rem;
    padding-top: 1.25rem;
  }

  .dynamic-note .note-label {
    font-size: 0.6rem;
    top: -0.5rem;
  }

  .remote-cta {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
    font-size: 0.85rem;
    margin-top: 1rem;
  }
}
</style>
