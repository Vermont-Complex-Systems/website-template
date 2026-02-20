<script lang="ts">
    import type { Snippet } from 'svelte';
    let { children, class: className = '' }: { children: Snippet; class?: string } = $props();
</script>

<div class="sidebar-header {className}">
    {@render children()}
</div>

<style>
    .sidebar-header {
        position: sticky;
        top: 0;
        z-index: 1;
        background: var(--vcsi-sidebar-bg, #ebe6e1);
        padding-bottom: var(--vcsi-space-md, 1rem);
        border-bottom: 2px solid var(--vcsi-border);
        margin-bottom: var(--vcsi-space-lg, 1.5rem);
        flex-shrink: 0;
    }
</style>
