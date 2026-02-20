<script lang="ts">
    import { Collapsible, Dialog } from 'bits-ui';
    import { X } from '@lucide/svelte';
    import { fly, fade } from 'svelte/transition';
    import { getSidebarState } from './sidebar-state.svelte';
    import type { Snippet } from 'svelte';

    let {
        children,
        class: className = '',
    }: {
        children: Snippet;
        class?: string;
    } = $props();

    const sidebar = getSidebarState();
</script>

{#if sidebar.isMobile}
    <Dialog.Portal>
        <Dialog.Overlay forceMount>
            {#snippet child({ props, open })}
                {#if open}
                    <div {...props} class="vcsi-dashboard-overlay" transition:fade={{ duration: 200 }}></div>
                {/if}
            {/snippet}
        </Dialog.Overlay>
        <Dialog.Content forceMount>
            {#snippet child({ props, open })}
                {#if open}
                    <aside {...props} class="vcsi-dashboard-drawer {className}" transition:fly={{ y: -300, duration: 300 }}>
                        <Dialog.Close class="vcsi-dashboard-drawer-close" aria-label="Close sidebar">
                            <X size={24} aria-hidden="true" />
                        </Dialog.Close>
                        <div class="sidebar-content">
                            {@render children()}
                        </div>
                    </aside>
                {/if}
            {/snippet}
        </Dialog.Content>
    </Dialog.Portal>
{:else}
    <aside class="dashboard-sidebar {className}">
        <Collapsible.Content forceMount class="sidebar-content">
            {@render children()}
        </Collapsible.Content>
    </aside>
{/if}

<style>
    /* Prevent bits-ui Collapsible height animation — CSS grid handles the transition.
       Use 100% so sidebar-content fills the aside and margin-top:auto works on Footer. */
    :global(.dashboard-sidebar [data-collapsible-content]) {
        height: 100% !important;
        overflow: visible !important;
    }

    /* Make sidebar-content a flex column so Header/Footer pin and Groups scroll */
    :global(.sidebar-content) {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    /* Mobile drawer overlay */
    :global(.vcsi-dashboard-overlay) {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }

    /* Mobile drawer panel */
    :global(.vcsi-dashboard-drawer) {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        max-height: 95vh;
        overflow-y: auto;
        background: var(--vcsi-sidebar-bg, #ebe6e1);
        border-bottom: 1px solid var(--vcsi-border);
        z-index: 1000;
    }

    :global(.vcsi-dashboard-drawer) .sidebar-content {
        padding: var(--vcsi-space-md, 1rem) var(--vcsi-space-lg, 1.5rem) var(--vcsi-space-lg, 1.5rem);
    }

    /* Mobile drawer close button */
    :global(.vcsi-dashboard-drawer-close) {
        position: absolute;
        top: var(--vcsi-space-md, 1rem);
        right: var(--vcsi-space-md, 1rem);
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        border-radius: var(--vcsi-radius-md, 6px);
        color: var(--vcsi-gray-900, rgb(38, 38, 38));
        cursor: pointer;
    }

    :global(.vcsi-dashboard-drawer-close:hover) {
        background: rgba(0, 0, 0, 0.05);
    }
</style>
