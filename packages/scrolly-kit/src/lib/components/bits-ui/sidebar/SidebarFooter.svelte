<script lang="ts">
    import type { Snippet } from 'svelte';
    let { children, class: className = '' }: { children: Snippet; class?: string } = $props();
</script>

<div class="sidebar-footer {className}">
    {@render children()}
</div>

<style>
    .sidebar-footer {
        position: sticky;
        bottom: 0;
        z-index: 1;
        background: var(--vcsi-sidebar-bg, #ebe6e1);
        margin-top: auto;
        padding-top: var(--vcsi-space-md, 1rem);
        border-top: 1px solid var(--vcsi-border);
        flex-shrink: 0;
    }
</style>
