<script lang="ts">
    import { X, Menu, ChevronLeft } from '@lucide/svelte';

    let { isMobile = false, isOpen = false }: {
        isMobile: boolean;
        isOpen: boolean;
    } = $props();
</script>

{#if isMobile}
    {#if isOpen}
        <X size={24} aria-hidden="true" />
    {:else}
        <Menu size={24} aria-hidden="true" />
    {/if}
{:else}
    <ChevronLeft size={16} aria-hidden="true" />
{/if}
