<script lang="ts">
    import { Collapsible, Dialog } from 'bits-ui';
    import { getSidebarState } from './sidebar-state.svelte';
    import type { Snippet } from 'svelte';

    let {
        id,
        children,
        class: className = '',
    }: {
        id?: string;
        children: Snippet;
        class?: string;
    } = $props();

    const sidebar = getSidebarState();
</script>

{#if sidebar.isMobile}
    <Dialog.Root bind:open={sidebar.drawerOpen}>
        <article
            class="dashboard-layout {className}"
            {id}
            style:--vcsi-sidebar-width={sidebar.sidebarWidth}
            style:--vcsi-sidebar-collapsed-width={sidebar.collapsedWidth}
        >
            {@render children()}
        </article>
    </Dialog.Root>
{:else}
    <Collapsible.Root bind:open={() => !sidebar.collapsed, (v) => sidebar.collapsed = !v}>
        <article
            class="dashboard-layout {className}"
            class:sidebar-collapsed={sidebar.collapsed}
            {id}
            style:--vcsi-sidebar-width={sidebar.sidebarWidth}
            style:--vcsi-sidebar-collapsed-width={sidebar.collapsedWidth}
        >
            {@render children()}
        </article>
    </Collapsible.Root>
{/if}
