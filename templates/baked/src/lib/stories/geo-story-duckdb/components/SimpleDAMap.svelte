<script>
    import * as d3 from 'd3';
    import { rewind } from '@turf/rewind';
    import { database } from '$lib/db/duck.svelte';

    let width = $state(800);
    let height = $state(600);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    let innerWidth = $derived(width - margin.left - margin.right);
    let innerHeight = $derived(height - margin.top - margin.bottom);

    const TARGET_DA = '24661504';

    const db = database(
        { census_da: 'census_da.parquet' },
        { extensions: ['spatial'] }
    );

    // Bbox query — confirmed working in debug
    const daQuery = db.sql(t =>
        `SELECT geo_uid, population, median_income, area_sqkm,
                population / NULLIF(area_sqkm, 0) as pop_density,
                ST_AsGeoJSON(geom) as geojson
         FROM ${t.census_da}
         WHERE population > 0
           AND ST_Intersects(geom,
                 ST_MakeEnvelope(-73.6318, 45.5281, -73.6018, 45.5521))`
    );

    // Parse GeoJSON strings into features, rewind for D3 (RFC 7946 winding)
    let daFeatures = $derived(
        daQuery.rows.map(r => rewind({
            type: 'Feature',
            properties: {
                geo_uid: r.geo_uid,
                population: r.population,
                median_income: r.median_income,
                pop_density: r.pop_density
            },
            geometry: JSON.parse(r.geojson)
        }, { reverse: true }))
    );

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
        {daQuery.loading ? 'Loading spatial...' : `${daFeatures.length} DAs around DA ${TARGET_DA}`}
    </h3>
    {#if daQuery.error}
        <pre class="error">{daQuery.error}</pre>
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

    {#if !daQuery.loading && daFeatures.length > 0}
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
