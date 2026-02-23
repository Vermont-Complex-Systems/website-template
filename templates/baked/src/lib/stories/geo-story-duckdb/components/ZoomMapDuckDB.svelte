<script>
    import * as d3 from 'd3';
    import { rewind } from '@turf/rewind';
    import { database } from '$lib/db/duck.svelte';

    import districtsGeo from '../data/districts.json';
    import boundaryGeo from '../data/boundary.json';

    const districts = districtsGeo.features.map(f => rewind(f, { reverse: true }));
    const boundary = boundaryGeo.features.map(f => rewind(f, { reverse: true }));

    let width = $state(800);
    let height = $state(600);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    let innerWidth = $derived(width - margin.left - margin.right);
    let innerHeight = $derived(height - margin.top - margin.bottom);

    // Interaction state
    let selectedDistrict = $state(null);
    let hoveredDistrict = $state(null);
    let hoveredDa = $state(null);
    let selectedDas = $state([]);
    let mouse = $state({ x: 0, y: 0 });

    let isZoomed = $derived(selectedDistrict !== null);
    let selectedIds = $derived(new Set(selectedDas.map(f => f.properties.geo_uid)));

    // Aggregate stats for selected DAs
    let selectionSummary = $derived.by(() => {
        if (selectedDas.length === 0) return null;
        const totalPop = selectedDas.reduce((s, f) => s + (f.properties.population ?? 0), 0);
        const totalArea = selectedDas.reduce((s, f) => s + (f.properties.area_sqkm ?? 0), 0);
        const incomes = selectedDas
            .map(f => f.properties.median_income)
            .filter(v => v != null);
        const avgIncome = incomes.length > 0
            ? Math.round(incomes.reduce((s, v) => s + v, 0) / incomes.length)
            : null;
        return { totalPop, totalArea, avgIncome };
    });

    // DuckDB setup
    const db = database(
        { census_da: 'census_da.parquet' },
        { extensions: ['spatial'] }
    );

    // Reactive bbox from selected district (with 2% padding)
    let selectedBbox = $derived.by(() => {
        if (!selectedDistrict) return null;
        const [[minX, minY], [maxX, maxY]] = d3.geoBounds(selectedDistrict);
        const padX = (maxX - minX) * 0.02;
        const padY = (maxY - minY) * 0.02;
        return [minX - padX, minY - padY, maxX + padX, maxY + padY];
    });

    // DA query — reactive, re-runs when selectedBbox changes
    const daQuery = db.sql(t => {
        if (!selectedBbox) return `SELECT 1 WHERE 0`;
        const [minX, minY, maxX, maxY] = selectedBbox;
        return `SELECT geo_uid, population, median_income, area_sqkm,
                       population / NULLIF(area_sqkm, 0) as pop_density,
                       ST_AsGeoJSON(geom) as geojson
                FROM ${t.census_da}
                WHERE population > 0
                  AND ST_Intersects(geom,
                        ST_MakeEnvelope(${minX}, ${minY}, ${maxX}, ${maxY}))`;
    });

    // Parse DuckDB rows → GeoJSON features with rewind
    let daFeatures = $derived(
        daQuery.rows
            .filter(r => r.geojson)
            .map(r => rewind({
                type: 'Feature',
                properties: {
                    geo_uid: r.geo_uid,
                    population: r.population,
                    median_income: r.median_income,
                    pop_density: r.pop_density,
                    area_sqkm: r.area_sqkm
                },
                geometry: JSON.parse(r.geojson)
            }, { reverse: true }))
    );

    // DA metric options (zoomed-in view)
    const daMetrics = {
        density:    { label: 'Density',    unit: 'pop/km²', prop: 'pop_density',    fmt: v => v?.toFixed(0) },
        population: { label: 'Population', unit: 'pop',     prop: 'population',     fmt: v => v?.toLocaleString() },
        income:     { label: 'Income',     unit: '$',        prop: 'median_income',  fmt: v => '$' + v?.toLocaleString(undefined, { maximumFractionDigits: 0 }) },
    };

    let daMetric = $state('density');
    let activeDaMetric = $derived(daMetrics[daMetric]);

    // Global stats: min/max for all DA metrics
    const globalStatsQuery = db.sql(t =>
        `SELECT MIN(population / NULLIF(area_sqkm, 0)) as min_density,
                MAX(population / NULLIF(area_sqkm, 0)) as max_density,
                MIN(population) as min_population,
                MAX(population) as max_population,
                MIN(median_income) as min_income,
                MAX(median_income) as max_income
         FROM ${t.census_da}
         WHERE population > 0`
    );

    let globalExtent = $derived.by(() => {
        if (globalStatsQuery.rows.length === 0) return null;
        const r = globalStatsQuery.rows[0];
        const extents = {
            density: [r.min_density, r.max_density],
            population: [r.min_population, r.max_population],
            income: [r.min_income, r.max_income],
        };
        return extents[daMetric];
    });

    // All DA centroids for district-level aggregation (lightweight: no geometry)
    const daCentroidsQuery = db.sql(t =>
        `SELECT population, area_sqkm, median_income,
                ST_X(ST_Centroid(geom)) as lon, ST_Y(ST_Centroid(geom)) as lat
         FROM ${t.census_da}
         WHERE population > 0`
    );

    // Client-side spatial join: assign DA centroids to districts
    let districtStats = $derived.by(() => {
        if (daCentroidsQuery.rows.length === 0) return new Map();
        const stats = new Map();
        for (const da of daCentroidsQuery.rows) {
            for (const district of districts) {
                if (d3.geoContains(district, [da.lon, da.lat])) {
                    const id = district.properties.id;
                    if (!stats.has(id)) stats.set(id, { totalPop: 0, totalArea: 0, sumIncome: 0, incomeCount: 0 });
                    const s = stats.get(id);
                    s.totalPop += da.population ?? 0;
                    s.totalArea += da.area_sqkm ?? 0;
                    if (da.median_income != null) {
                        s.sumIncome += da.median_income;
                        s.incomeCount += 1;
                    }
                    break;
                }
            }
        }
        return stats;
    });

    // District metric options
    const districtMetrics = {
        population: { label: 'Population', unit: 'population', value: s => s.totalPop, fmt: v => v?.toLocaleString() },
        density:    { label: 'Density',    unit: 'pop/km²',    value: s => s.totalPop / s.totalArea, fmt: v => v?.toFixed(0) },
        income:     { label: 'Avg income', unit: '$',           value: s => s.incomeCount > 0 ? s.sumIncome / s.incomeCount : 0, fmt: v => '$' + v?.toLocaleString(undefined, { maximumFractionDigits: 0 }) },
    };

    let districtMetric = $state('population');
    let activeMetric = $derived(districtMetrics[districtMetric]);

    function districtValue(s) {
        return activeMetric.value(s);
    }

    let districtColorScale = $derived.by(() => {
        if (districtStats.size === 0) return null;
        const values = [...districtStats.values()].map(districtValue);
        return d3.scaleQuantize()
            .domain(d3.extent(values))
            .range(d3.schemeYlGnBu[7]);
    });

    // Local extent from loaded DAs (metric-aware)
    let localExtent = $derived.by(() => {
        const prop = activeDaMetric.prop;
        const values = daFeatures
            .map(f => f.properties[prop])
            .filter(d => d != null && isFinite(d));
        return values.length > 0 ? d3.extent(values) : null;
    });

    let normalizeGlobal = $state(false);

    // Color scale for DA density — switches between local and global normalization
    let colorScale = $derived.by(() => {
        if (!isZoomed || daFeatures.length === 0) return null;
        const extent = normalizeGlobal ? globalExtent : localExtent;
        if (!extent) return null;
        return d3.scaleQuantize()
            .domain(extent)
            .range(d3.schemeYlGnBu[7]);
    });

    // Projection: fit to all districts or selected district
    let projection = $derived.by(() => {
        const target = isZoomed
            ? selectedDistrict
            : { type: 'FeatureCollection', features: districts };
        return d3.geoMercator().fitSize([innerWidth, innerHeight], target);
    });

    let path = $derived(d3.geoPath().projection(projection));

    function handleDistrictClick(feature) {
        selectedDistrict = feature;
    }

    function handleZoomOut() {
        selectedDistrict = null;
        selectedDas = [];
    }

    function toggleDa(feature) {
        const uid = feature.properties.geo_uid;
        if (selectedIds.has(uid)) {
            selectedDas = selectedDas.filter(f => f.properties.geo_uid !== uid);
        } else {
            selectedDas = [...selectedDas, feature];
        }
    }

    function handleKeydown(e) {
        if (e.key === 'Escape' && isZoomed) handleZoomOut();
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="map-container" bind:clientWidth={width} bind:clientHeight={height}>
    <h3>
        {#if isZoomed}
            {#if daQuery.loading}
                Loading DAs in {selectedDistrict.properties.nom}...
            {:else}
                {daFeatures.length} DAs in {selectedDistrict.properties.nom}
                <span class="timing">({daQuery.queryTime}ms &middot; {normalizeGlobal ? 'city-wide' : 'district'} scale)</span>
            {/if}
        {:else}
            Click a district to zoom in <span class="timing">(DuckDB)</span>
        {/if}
    </h3>

    {#if isZoomed}
        <button class="back-btn" onclick={handleZoomOut}>&larr; Back</button>
    {/if}

    {#if daQuery.error}
        <pre class="error">{daQuery.error}</pre>
    {/if}

    <svg viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${margin.left},${margin.top})`}>
            <!-- Boundary background -->
            {#each boundary as feature (feature.properties.CMAUID)}
                <path d={path(feature)} fill="#f4efea" stroke="#999" stroke-width="0.5" />
            {/each}

            {#if isZoomed}
                <!-- DA polygons -->
                {#each daFeatures as feature (feature.properties.geo_uid)}
                    {@const isSelected = selectedIds.has(feature.properties.geo_uid)}
                    {@const isHovered = hoveredDa?.properties.geo_uid === feature.properties.geo_uid}
                    <path
                        d={path(feature)}
                        fill={isSelected ? '#d62728' : (colorScale ? colorScale(feature.properties[activeDaMetric.prop]) : '#ddd')}
                        fill-opacity={isSelected ? 0.8 : 1}
                        stroke={isSelected ? '#d62728' : isHovered ? '#333' : '#888'}
                        stroke-width={isSelected ? 2 : isHovered ? 1.5 : 0.3}
                        style="cursor: pointer;"
                        onmouseenter={() => hoveredDa = feature}
                        onmouseleave={() => hoveredDa = null}
                        onmousemove={(e) => mouse = { x: e.offsetX, y: e.offsetY }}
                        onclick={() => toggleDa(feature)}
                    />
                {/each}

                <!-- Selected district outline -->
                <path
                    d={path(selectedDistrict)}
                    fill="none"
                    stroke="#d62728"
                    stroke-width="2"
                />
            {:else}
                <!-- Clickable district polygons -->
                {#each districts as feature (feature.properties.id)}
                    {@const stats = districtStats.get(feature.properties.id)}
                    {@const baseFill = districtColorScale && stats
                        ? districtColorScale(districtValue(stats))
                        : '#e0e0e0'}
                    <path
                        d={path(feature)}
                        fill={hoveredDistrict === feature ? '#b3d4fc' : baseFill}
                        stroke="#333"
                        stroke-width="0.5"
                        style="cursor: pointer; transition: fill 0.15s;"
                        role="button"
                        tabindex="0"
                        onmouseenter={() => hoveredDistrict = feature}
                        onmouseleave={() => hoveredDistrict = null}
                        onmousemove={(e) => mouse = { x: e.offsetX, y: e.offsetY }}
                        onclick={() => handleDistrictClick(feature)}
                        onkeydown={(e) => e.key === 'Enter' && handleDistrictClick(feature)}
                    />
                {/each}

                <!-- District name labels -->
                {#each districts as feature (feature.properties.id)}
                    {@const centroid = path.centroid(feature)}
                    {#if centroid && !isNaN(centroid[0])}
                        <text
                            x={centroid[0]} y={centroid[1]}
                            text-anchor="middle"
                            font-size="7" fill="#333"
                            stroke="white" stroke-width="2.5"
                            stroke-linejoin="round" paint-order="stroke"
                            pointer-events="none"
                        >
                            {feature.properties.nom}
                        </text>
                    {/if}
                {/each}
            {/if}
        </g>
    </svg>

    {#if districtColorScale && !isZoomed}
        <div class="legend">
            <span class="legend-label">{activeMetric.fmt(districtColorScale.domain()[0])}</span>
            <div class="legend-swatches">
                {#each d3.schemeYlGnBu[7] as color}
                    <div class="legend-swatch" style:background={color}></div>
                {/each}
            </div>
            <span class="legend-label">{activeMetric.fmt(districtColorScale.domain()[1])}</span>
            <select class="metric-select" bind:value={districtMetric}>
                {#each Object.entries(districtMetrics) as [key, m]}
                    <option value={key}>{m.label}</option>
                {/each}
            </select>
        </div>
    {/if}

    {#if colorScale && isZoomed}
        <div class="legend">
            <span class="legend-label">{activeDaMetric.fmt(colorScale.domain()[0])}</span>
            <div class="legend-swatches">
                {#each d3.schemeYlGnBu[7] as color}
                    <div class="legend-swatch" style:background={color}></div>
                {/each}
            </div>
            <span class="legend-label">{activeDaMetric.fmt(colorScale.domain()[1])}</span>
            <select class="metric-select" bind:value={daMetric}>
                {#each Object.entries(daMetrics) as [key, m]}
                    <option value={key}>{m.label}</option>
                {/each}
            </select>
            <button
                class="norm-toggle"
                onclick={() => normalizeGlobal = !normalizeGlobal}
            >
                {normalizeGlobal ? 'Global' : 'Local'}
            </button>
        </div>
    {/if}

    {#if hoveredDistrict && !isZoomed}
        {@const hStats = districtStats.get(hoveredDistrict.properties.id)}
        <div class="tooltip" style="left: {mouse.x + 12}px; top: {mouse.y - 12}px;">
            <strong>{hoveredDistrict.properties.nom}</strong><br>
            {hoveredDistrict.properties.arrondissement}
            {#if hStats}
                <br>Pop: {hStats.totalPop.toLocaleString()}
                &middot; {(hStats.totalPop / hStats.totalArea).toFixed(0)}/km²
            {/if}
        </div>
    {/if}

    {#if hoveredDa && isZoomed}
        <div class="tooltip" style="left: {mouse.x + 12}px; top: {mouse.y - 12}px;">
            <strong>DA {hoveredDa.properties.geo_uid}</strong><br>
            Pop: {hoveredDa.properties.population?.toLocaleString()}<br>
            Density: {hoveredDa.properties.pop_density?.toFixed(0)}/km²<br>
            Income: ${hoveredDa.properties.median_income?.toLocaleString()}
        </div>
    {/if}

    {#if selectionSummary}
        <div class="da-info">
            <strong>{selectedDas.length} DA{selectedDas.length > 1 ? 's' : ''} selected</strong>
            &middot; Total pop: {selectionSummary.totalPop.toLocaleString()}
            &middot; Area: {selectionSummary.totalArea.toFixed(1)} km²
            {#if selectionSummary.avgIncome}
                &middot; Avg income: ${selectionSummary.avgIncome.toLocaleString()}
            {/if}
            <button class="clear-btn" onclick={() => selectedDas = []}>Clear</button>
        </div>
    {/if}
</div>

<style>
    .map-container { width: 100%; margin: 0 auto; position: relative; }
    h3 { font-family: system-ui, sans-serif; font-size: 1rem; margin: 0 0 0.5rem; }
    .timing { font-size: 0.8rem; color: #999; font-weight: normal; }
    svg { width: 100%; height: 70vh; border: 1px solid #ddd; border-radius: 8px; background: #fafafa; }
    .back-btn {
        position: absolute; top: 2.5rem; right: 0.5rem; z-index: 10;
        font-family: system-ui; font-size: 0.8rem; padding: 0.3rem 0.6rem;
        border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .back-btn:hover { background: #f0f0f0; }
    .error { color: #d62728; font-size: 0.85rem; background: #fff0f0; padding: 0.5rem; border-radius: 4px; }
    .tooltip {
        position: absolute; pointer-events: none; z-index: 20;
        background: rgba(255,255,255,0.95); border: 1px solid #ccc;
        border-radius: 4px; padding: 0.4rem 0.6rem; font-size: 0.75rem;
        font-family: system-ui; line-height: 1.4; box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    .da-info {
        font-family: system-ui; font-size: 0.85rem; color: #333;
        margin-top: 0.5rem; padding: 0.5rem 0.75rem;
        background: #f5f5f5; border-radius: 4px;
        display: flex; align-items: center; flex-wrap: wrap; gap: 0.25rem;
    }
    .clear-btn {
        margin-left: auto; font-family: system-ui; font-size: 0.75rem;
        padding: 0.15rem 0.4rem; border: 1px solid #ccc; border-radius: 3px;
        background: white; cursor: pointer; color: #666;
    }
    .clear-btn:hover { background: #eee; }
    .legend {
        display: flex; align-items: center; gap: 0.4rem;
        margin-top: 0.5rem; font-family: system-ui; font-size: 0.75rem; color: #555;
    }
    .legend-swatches { display: flex; }
    .legend-swatch { width: 24px; height: 12px; }
    .legend-label { font-variant-numeric: tabular-nums; }
    .legend-unit { color: #999; }
    .metric-select {
        margin-left: 0.5rem; font-family: system-ui; font-size: 0.7rem;
        padding: 0.1rem 0.25rem; border: 1px solid #ccc; border-radius: 3px;
        background: white; color: #555; cursor: pointer;
    }
    .norm-toggle {
        margin-left: 0.5rem; font-family: system-ui; font-size: 0.7rem;
        padding: 0.1rem 0.35rem; border: 1px solid #ccc; border-radius: 3px;
        background: white; cursor: pointer; color: #666;
    }
    .norm-toggle:hover { background: #f0f0f0; }
</style>
