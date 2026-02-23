<script>
    import * as d3 from 'd3';
    import { rewind } from '@turf/rewind';
    import { deserialize } from 'flatgeobuf/lib/mjs/geojson.js';
    import { browser } from '$app/environment';

    let width = $state(800);
    let height = $state(600);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    let innerWidth = $derived(width - margin.left - margin.right);
    let innerHeight = $derived(height - margin.top - margin.bottom);

    const TARGET_DA = '24661504';

    // Same bbox as the DuckDB version for fair comparison
    const BBOX = {
        minX: -73.6318, minY: 45.5281,
        maxX: -73.6018, maxY: 45.5521
    };

    let daFeatures = $state([]);
    let loading = $state(true);
    let error = $state(null);
    let fetchTime = $state(0);

    // Fetch features from FlatGeobuf with spatial index filtering
    async function loadFeatures() {
        if (!browser) return;
        loading = true;
        error = null;
        const start = performance.now();

        try {
            const features = [];
            const iter = deserialize('/data/census_da.fgb', BBOX);

            for await (const feature of iter) {
                if (feature.properties.population > 0) {
                    features.push(rewind(feature, { reverse: true }));
                }
            }

            daFeatures = features;
            fetchTime = Math.round(performance.now() - start);
        } catch (e) {
            error = String(e);
        } finally {
            loading = false;
        }
    }

    $effect(() => {
        loadFeatures();
    });

    // Color scale
    let colorScale = $derived.by(() => {
        const densities = daFeatures
            .map(f => f.properties.pop_density)
            .filter(d => d != null && isFinite(d));
        if (densities.length === 0) return null;
        return d3.scaleQuantize()
            .domain(d3.extent(densities))
            .range(d3.schemeBlues[7]);
    });

    // Projection fitted to all DA features
    let projection = $derived.by(() => {
        if (daFeatures.length === 0) return d3.geoMercator();
        return d3.geoMercator().fitSize(
            [innerWidth, innerHeight],
            { type: 'FeatureCollection', features: daFeatures }
        );
    });

    let path = $derived(d3.geoPath().projection(projection));
</script>

<div class="map-container" bind:clientWidth={width} bind:clientHeight={height}>
    <h3>
        {loading ? 'Loading FlatGeobuf...' : `${daFeatures.length} DAs (FlatGeobuf, ${fetchTime}ms)`}
    </h3>
    {#if error}
        <pre class="error">{error}</pre>
    {/if}

    <svg viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${margin.left},${margin.top})`}>
            {#each daFeatures as feature (feature.properties.geo_uid)}
                <path
                    d={path(feature)}
                    fill={feature.properties.geo_uid === TARGET_DA
                        ? '#d62728'
                        : (colorScale ? colorScale(feature.properties.pop_density) : '#ddd')}
                    stroke="#666"
                    stroke-width="0.5"
                />
            {/each}
        </g>
    </svg>

    {#if !loading && daFeatures.length > 0}
        {@const target = daFeatures.find(f => f.properties.geo_uid === TARGET_DA)}
        {#if target}
            <p class="info">
                <strong>DA {TARGET_DA}</strong> (red): pop {target.properties.population},
                income ${target.properties.median_income?.toLocaleString()},
                density {target.properties.pop_density?.toFixed(0)}/km²
            </p>
        {/if}
    {/if}
</div>

<style>
    .map-container { width: 100%; max-width: 900px; margin: 2rem auto; }
    h3 { font-family: system-ui, sans-serif; font-size: 1rem; margin: 0 0 0.5rem; }
    svg { width: 100%; height: auto; aspect-ratio: 4/3; border: 1px solid #ddd; border-radius: 8px; background: #fafafa; }
    .error { color: #d62728; font-size: 0.85rem; background: #fff0f0; padding: 0.5rem; border-radius: 4px; }
    .info { font-family: system-ui, sans-serif; font-size: 0.85rem; color: #333; margin-top: 0.5rem; }
</style>
