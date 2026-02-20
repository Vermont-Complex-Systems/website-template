<script lang="ts">
    import { Collapsible, Dialog } from 'bits-ui';
    import { ChevronLeft, Menu } from '@lucide/svelte';
    import { getSidebarState } from './sidebar-state.svelte';
    import type { Snippet } from 'svelte';

    let {
        children,
        class: className = '',
    }: {
        children?: Snippet;
        class?: string;
    } = $props();

    const sidebar = getSidebarState();
</script>

{#if sidebar.isMobile}
    <Dialog.Trigger class="sidebar-toggle {className}">
        {#if children}
            {@render children()}
        {:else}
            <Menu size={24} aria-hidden="true" />
        {/if}
    </Dialog.Trigger>
{:else}
    <Collapsible.Trigger
        class="sidebar-toggle {className}"
        aria-label={sidebar.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
        {#if children}
            {@render children()}
        {:else}
            <ChevronLeft size={16} aria-hidden="true" />
        {/if}
    </Collapsible.Trigger>
{/if}

<style>
    /* Hide mobile Dialog trigger when drawer is open — the drawer has its own close button.
       Scoped to mobile so it doesn't affect the desktop Collapsible.Trigger,
       which also has data-state="open" when the sidebar is expanded. */
    @media (max-width: 768px) {
        :global(.sidebar-toggle[data-state="open"]) {
            visibility: hidden;
        }
    }
</style>
