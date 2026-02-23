<script>
    let { scale } = $props();

    // Derive legend properties from the scale
    let domain = $derived(scale?.domain() ?? []);
    let isDiverging = $derived(domain.length === 3);

    // Generate CSS gradient from the scale's interpolator
    let gradientCSS = $derived.by(() => {
        if (!scale?.interpolator) return null;
        const interpolator = scale.interpolator();
        const stops = Array.from({ length: 10 }, (_, i) => {
            const t = i / 9;
            return `${interpolator(t)} ${(t * 100).toFixed(0)}%`;
        });
        return `linear-gradient(to right, ${stops.join(', ')})`;
    });

    // Format labels — handle quantile scales (array domain) vs regular (2-3 element domain)
    let minLabel = $derived.by(() => {
        if (!scale) return '';
        const d = domain;
        if (isDiverging) return `${d[0]?.toFixed(0)}%`;
        // Quantile scales have the full data array as domain
        const min = d.length > 3 ? Math.min(...d) : Math.min(...d);
        return min?.toLocaleString(undefined, { maximumFractionDigits: 0 });
    });

    let maxLabel = $derived.by(() => {
        if (!scale) return '';
        const d = domain;
        if (isDiverging) return `+${d[2]?.toFixed(0)}%`;
        const max = d.length > 3 ? Math.max(...d) : Math.max(...d);
        return max?.toLocaleString(undefined, { maximumFractionDigits: 0 });
    });
</script>

{#if scale}
<div class="legend">
    <span class="legend-label">{minLabel}</span>
    <div
        class="legend-bar"
        style:background={gradientCSS ?? (isDiverging
            ? 'linear-gradient(to right, #b2182b, #f7f7f7, #2166ac)'
            : 'linear-gradient(to right, #5e4fa2, #3288bd, #66c2a5, #abdda4, #e6f598, #fee08b, #fdae61, #f46d43, #d53e4f, #9e0142)'
        )}
    ></div>
    <span class="legend-label">{maxLabel}</span>
</div>
{/if}

<style>
    .legend {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.9);
        padding: 0.5rem;
        border-radius: 4px;
    }

    .legend-bar {
        width: 200px;
        height: 12px;
        border-radius: 2px;
    }

    .legend-label {
        font-size: 0.75rem;
        color: #333;
    }
</style>
