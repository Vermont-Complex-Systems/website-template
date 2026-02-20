<!--
@component
Main content area with inset styling — rounded corner, background, and flex layout
for composing cards, charts, tables, and headers.

Drop-in alternative to `Sidebar.Main` when you want the "inset panel" visual effect.

## Props
- `children` - Content to render
- `class` - Optional CSS class

## Usage
```svelte
<Sidebar.Provider>
    <Sidebar.Root>
        <AppSidebar />
        <Sidebar.Inset>
            <SiteHeader />
            <div class="dashboard-content">
                <SectionCards />
                <ChartArea />
            </div>
        </Sidebar.Inset>
    </Sidebar.Root>
</Sidebar.Provider>
```
-->
<script lang="ts">
    import type { Snippet } from 'svelte';
    let { children, class: className = '' }: { children: Snippet; class?: string } = $props();
</script>

<div class="dashboard-inset {className}">
    {@render children()}
</div>

<style>
    .dashboard-inset {
        position: relative;
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
        background: var(--vcsi-bg, #fff);
        border-top-left-radius: var(--vcsi-radius-lg, 10px);
        border-bottom-left-radius: var(--vcsi-radius-lg, 10px);
        box-shadow: inset 1px 0 0 var(--vcsi-border, #ddd);
    }
</style>
