<script module lang="ts">
    import Scrolly from '$lib/components/helpers/Scrolly.svelte';
    import Md from '$lib/components/helpers/MarkdownRenderer.svelte';

    /**
     * Content item for scrolly steps. Used in copy.json files.
     *
     * @example
     * // In copy.json:
     * { "type": "markdown", "value": "Some **bold** text" }
     * { "type": "html", "value": "<p>Raw HTML</p>" }
     * { "type": "math", "value": "$E = mc^2$" }
     * { "type": "code", "value": "const x = 1;", "language": "javascript" }
     */
    export interface ContentItem {
        type: 'html' | 'markdown' | 'math' | 'code';
        value: string | string[];
        language?: string;
    }

    /**
     * Wrapper object for scrolly index binding.
     *
     * Why an object? Svelte can't bind to primitives passed as snippet args.
     * By wrapping in an object, we can bind to `obj.value` and reactivity works.
     *
     * @example
     * let scrollyIndex = $state({ value: undefined });
     * // Pass scrollyIndex to scrollyContent, access via scrollyIndex.value
     */
    export interface ScrollyIndex {
        value: number | undefined;
    }

    /**
     * Options for scrollyContent layout.
     */
    export interface ScrollyOptions {
        /** Show spacer before content (default: true) */
        topSpacer?: boolean;
        /** Show spacer after content (default: true) */
        bottomSpacer?: boolean;
    }

    const VALID_TYPES = ['html', 'markdown', 'math', 'code'] as const;

    export { scrollyContent, renderTextContent };
</script>

<!--
  Renders a content item based on its type.
  Supports: html, markdown, math, code

  @param item - ContentItem from copy.json
-->
{#snippet renderTextContent(item: ContentItem)}
    {#if item.type === "html"}
        {@html item.value}
    {:else if item.type === "markdown"}
        <Md text={item.value as string}/>
    {:else if item.type === "math"}
        <div class="math-container">
            <Md text={item.value as string}/>
        </div>
    {:else if item.type === "code"}
        {@const codeValue = Array.isArray(item.value) ? item.value.join('\n') : item.value}
        <div class="code-block">
            {#if item.language}
                <div class="code-language">{item.language}</div>
            {/if}
            <Md text={`\`\`\`${item.language || ''}\n${codeValue}\n\`\`\``}/>
        </div>
    {:else}
        <!-- Unknown type: warn in dev, render nothing -->
        {@const _ = console.warn(`[ScrollySnippets] Unknown content type: "${(item as any).type}". Valid types: ${VALID_TYPES.join(', ')}`)}
    {/if}
{/snippet}

<!--
  Generic scrolly wrapper for story content.

  @param steps - Array of ContentItem from copy.json
  @param scrollyIndexObj - Reactive wrapper: { value: number | undefined }
  @param options - Layout options (topSpacer, bottomSpacer)
  @param contentRenderer - Custom renderer snippet (defaults to renderTextContent)

  @example
  <script>
    let scrollyIndex = $state({ value: undefined });
  </script>
  {@render scrollyContent(data.steps, scrollyIndex)}
  {@render scrollyContent(data.steps, scrollyIndex, { topSpacer: false })}
-->
{#snippet scrollyContent(
    steps: ContentItem[],
    scrollyIndexObj: ScrollyIndex,
    options: ScrollyOptions = {},
    contentRenderer: (item: ContentItem) => void = renderTextContent
)}
    {@const topSpacer = options.topSpacer ?? true}
    {@const bottomSpacer = options.bottomSpacer ?? true}
    <div class="scrolly-content">
        {#if topSpacer}<div class="spacer"></div>{/if}
        <Scrolly bind:value={scrollyIndexObj.value}>
            {#each steps as step, i (i)}
                {@const active = scrollyIndexObj.value === i}
                <div class="step" class:active>
                    <div class="step-content">
                        {@render contentRenderer(step)}
                    </div>
                </div>
            {/each}
        </Scrolly>
        {#if bottomSpacer}<div class="spacer"></div>{/if}
    </div>
{/snippet}

<style>
    .math-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }

    .code-block {
        position: relative;
    }

    .code-language {
        position: absolute;
        top: 0;
        right: 0;
        /* Uses light-dark() for automatic theme switching */
        background: light-dark(#e1e4e8, #30363d);
        color: light-dark(#57606a, #8b949e);
        border-color: light-dark(#d1d9e0, #30363d);
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0 6px 0 6px;
        border-left: 1px solid;
        border-bottom: 1px solid;
        z-index: 1;
    }
</style>
