<!--
@component
Backwards-compatible dashboard shell.

Wraps the Sidebar compound components (Provider, Root, Content, Trigger, Main)
in a single component with snippet-based API. For more control, use the
Sidebar.* components directly.

## Props
- `collapsed` - Sidebar collapsed state (bindable)
- `sidebarWidth` - Width when expanded (default '280px')
- `collapsedWidth` - Width when collapsed (default '48px')
- `id` - Optional id for the root element
- `sidebar` - Snippet for sidebar content
- `children` - Snippet for main content
- `class` - Optional CSS class

## Usage
```svelte
<DashboardShell id="my-dashboard">
    {#snippet sidebar()}
        <h2>Filters</h2>
    {/snippet}
    <div class="chart">...</div>
</DashboardShell>
```
-->
<script lang="ts">
    import { Provider, Root, Content, Trigger, Main } from './sidebar/index';
    import type { Snippet } from 'svelte';

    let {
        collapsed = $bindable(false),
        sidebarWidth = '280px',
        collapsedWidth = '48px',
        id,
        sidebar,
        children,
        class: className = '',
    }: {
        collapsed?: boolean;
        sidebarWidth?: string;
        collapsedWidth?: string;
        id?: string;
        sidebar: Snippet;
        children: Snippet;
        class?: string;
    } = $props();
</script>

<Provider bind:collapsed {sidebarWidth} {collapsedWidth}>
    <Root {id} class={className}>
        <Content>
            {@render sidebar()}
        </Content>
        <Trigger />
        <Main>
            {@render children()}
        </Main>
    </Root>
</Provider>
