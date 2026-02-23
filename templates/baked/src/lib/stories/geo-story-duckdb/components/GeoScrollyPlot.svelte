<script>
    import * as d3 from 'd3';
    import { rewind } from '@turf/rewind';
    import { Tween } from 'svelte/motion';
    import { cubicInOut } from 'svelte/easing';
    import Legend from './Legend.svelte';
    import { database } from '$lib/db/duck.svelte';

    // Electoral districts + CMA boundary stay as static GeoJSON
    import districtsGeo from '../data/districts.json';
    import boundaryGeo from '../data/boundary.json';

    let { scrollyIndex } = $props();

    // Fix winding order for GeoJSON features
    const districts = districtsGeo.features.map(f => rewind(f, { reverse: true }));
    const boundary = boundaryGeo.features.map(f => rewind(f, { reverse: true }));

    // Pre-compute Le Plateau-Mont-Royal zoom target
    const plateauDistricts = districts.filter(
        d => d.properties.arrondissement === 'Le Plateau-Mont-Royal'
    );
    const plateauCollection = { type: 'FeatureCollection', features: plateauDistricts };
    const isZoomStep = (step) => step >= 8 && step <= 9;
    const isHighlightStep = (step) => step === 7;

    // Hover state
    let hoveredDa = $state(null);
    let mouse = $state({ x: 0, y: 0 });

    // Chart dimensions
    let width = $state(800);
    let height = $state(600);
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    let innerWidth = $derived(width - margin.left - margin.right);
    let innerHeight = $derived(height - margin.top - margin.bottom);
    let isMobile = $derived(width < 768);

    let stepIndex = $derived(scrollyIndex ?? 0);

    // ── DuckDB data layer ──
    // metadata.parquet → arrondissement-level (steps 0-2)
    // census_da.parquet → dissemination areas with geometry (steps 3-4)
    const db = database(
        { metadata: 'metadata.parquet', census_da: 'census_da.parquet' },
        { extensions: ['spatial'] }
    );
    const meta = db.from('metadata');

    // Arrondissement queries (steps 1-2)
    const pop2011 = meta.eq('year', () => 2011).rows();

    const changeData = db.sql(t =>
        `SELECT a.arrondissement,
                ((b.population - a.population) * 100.0 / a.population) as change
         FROM ${t.metadata} a
         JOIN ${t.metadata} b ON a.arrondissement = b.arrondissement
         WHERE a.year = 2011 AND b.year = 2016`
    );

    // DA-level query — spatial extension converts WKB geometry → GeoJSON string
    const daQuery = db.sql(t =>
        `SELECT geo_uid, population, avg_age, median_income, seniors_65plus,
                area_sqkm, population / NULLIF(area_sqkm, 0) as pop_density,
                ST_AsGeoJSON(geom) as geojson
         FROM ${t.census_da}
         WHERE population > 0`
    );

    // Convert DuckDB rows → GeoJSON features for D3 path rendering
    let daFeatures = $derived(
        daQuery.rows
            .filter(r => r.geojson)
            .map(r => rewind({
                type: 'Feature',
                properties: {
                    geo_uid: r.geo_uid,
                    population: Number(r.population),
                    avg_age: Number(r.avg_age),
                    median_income: r.median_income != null ? Number(r.median_income) : null,
                    seniors_65plus: Number(r.seniors_65plus),
                    area_sqkm: Number(r.area_sqkm),
                    pop_density: r.pop_density != null ? Number(r.pop_density) : null
                },
                geometry: JSON.parse(r.geojson)
            }, { reverse: true }))
    );

    // Point-in-polygon test: checks if DA centroid falls inside Plateau districts
    function isInPlateau(feature) {
        const centroid = d3.geoCentroid(feature);
        return plateauDistricts.some(d => d3.geoContains(d, centroid));
    }

    // Filter DAs to Plateau when zoomed
    let visibleDAs = $derived.by(() => {
        if (!isZoomStep(stepIndex) || daFeatures.length === 0) return daFeatures;
        return daFeatures.filter(isInPlateau);
    });


    // Show DA layer for steps >= 3
    let showDAs = $derived(stepIndex >= 3);

    // ── Map config driven by scroll step + reactive query results ──
    let mapConfig = $derived.by(() => {
        switch (stepIndex) {
            case 0:
                return {
                    title: 'Montreal',
                    colors: null,
                    labelsToShow: null,
                    legend: null
                };

            case 1: {
                const rows = pop2011.rows;
                if (rows.length === 0) return { title: 'Population 2011', colors: null, labelsToShow: null, legend: null };

                const maxPopulation = d3.max(rows, d => d.population);
                const colorScale = d3.scaleSequential(d3.interpolateSpectral)
                    .domain([maxPopulation, 0]);

                const colors = new Map(
                    rows.map(d => [d.arrondissement, colorScale(d.population)])
                );

                const labelsToShow = new Set(
                    rows
                        .toSorted((a, b) => b.population - a.population)
                        .slice(0, 5)
                        .map(d => d.arrondissement)
                );

                return { title: 'Population 2011', colors, labelsToShow, legend: colorScale };
            }

            case 2: {
                const rows = changeData.rows;
                if (rows.length === 0) return { title: 'Population Change 2011→2016', colors: null, labelsToShow: null, legend: null };

                const maxChange = Math.max(
                    Math.abs(d3.min(rows, d => d.change)),
                    Math.abs(d3.max(rows, d => d.change))
                );
                const colorScale = d3.scaleDiverging(d3.interpolateRdBu)
                    .domain([-maxChange, 0, maxChange]);

                const colors = new Map(
                    rows.map(d => [d.arrondissement, colorScale(d.change)])
                );
                const labelsToShow = new Set(
                    rows
                        .toSorted((a, b) => b.change - a.change)
                        .slice(0, 5)
                        .map(d => d.arrondissement)
                );

                return { title: 'Population Change 2011→2016', colors, labelsToShow, legend: colorScale };
            }

            case 3:
                // Reveal DAs with no coloring — just the geometry
                return {
                    title: 'Dissemination Areas',
                    colors: null,
                    labelsToShow: null,
                    legend: null
                };

            case 4: {
                // Population density — equal-interval bins (fails: extreme skew
                // from 3 to 122k people/km² puts nearly every DA in the first bin)
                const features = daFeatures;
                if (features.length === 0) return { title: 'Pop. Density — Equal Intervals', colors: null, labelsToShow: null, legend: null };

                const densities = features
                    .map(f => f.properties.pop_density)
                    .filter(d => d != null && isFinite(d));
                const colorScale = d3.scaleQuantize()
                    .domain(d3.extent(densities))
                    .range(d3.schemeYlGnBu[9]);

                const colors = new Map(
                    features.map(f => [
                        f.properties.geo_uid,
                        f.properties.pop_density != null && isFinite(f.properties.pop_density)
                            ? colorScale(f.properties.pop_density)
                            : '#e0e0e0'
                    ])
                );

                return { title: 'Pop. Density — Equal Intervals', colors, labelsToShow: null, legend: colorScale };
            }

            case 5: {
                // Population density — quantile bins (same data, much more revealing)
                const features = daFeatures;
                if (features.length === 0) return { title: 'Pop. Density — Quantile Bins', colors: null, labelsToShow: null, legend: null };

                const densities = features
                    .map(f => f.properties.pop_density)
                    .filter(d => d != null && isFinite(d));
                const colorScale = d3.scaleQuantile()
                    .domain(densities)
                    .range(d3.schemeYlGnBu[9]);

                const colors = new Map(
                    features.map(f => [
                        f.properties.geo_uid,
                        f.properties.pop_density != null && isFinite(f.properties.pop_density)
                            ? colorScale(f.properties.pop_density)
                            : '#e0e0e0'
                    ])
                );

                return { title: 'Pop. Density — Quantile Bins', colors, labelsToShow: null, legend: colorScale };
            }

            case 6: {
                // Median income — equal-interval bins, capped at 95th pctile
                // to avoid outliers washing out the bulk of DAs
                const features = daFeatures;
                if (features.length === 0) return { title: 'Median Household Income ($)', colors: null, labelsToShow: null, legend: null };

                const incomes = features
                    .map(f => f.properties.median_income)
                    .filter(d => d != null)
                    .sort((a, b) => a - b);
                const p95 = d3.quantile(incomes, 0.99);
                const colorScale = d3.scaleQuantize()
                    .domain([incomes[0], p95])
                    .range(d3.schemeYlGnBu[9]);

                const colors = new Map(
                    features.map(f => [
                        f.properties.geo_uid,
                        f.properties.median_income != null
                            ? colorScale(f.properties.median_income)
                            : '#e0e0e0'
                    ])
                );

                return { title: 'Median Household Income ($)', colors, labelsToShow: null, legend: colorScale };
            }

            case 7: {
                // Highlight Le Plateau — same income fill as step 6,
                // red outline draws the eye
                const features = daFeatures;
                if (features.length === 0) return { title: 'Le Plateau-Mont-Royal', colors: null, labelsToShow: null, legend: null };

                const incomes = features
                    .map(f => f.properties.median_income)
                    .filter(d => d != null)
                    .sort((a, b) => a - b);
                const p95 = d3.quantile(incomes, 0.99);
                const colorScale = d3.scaleQuantize()
                    .domain([incomes[0], p95])
                    .range(d3.schemeYlGnBu[9]);

                const colors = new Map(
                    features.map(f => [
                        f.properties.geo_uid,
                        f.properties.median_income != null
                            ? colorScale(f.properties.median_income)
                            : '#e0e0e0'
                    ])
                );

                return { title: 'Le Plateau-Mont-Royal', colors, labelsToShow: null, legend: null };
            }

            case 8: {
                // Le Plateau — GLOBAL income scale (continuity with step 6-7 income view)
                const features = visibleDAs;
                if (features.length === 0) return { title: 'Le Plateau — City-wide scale', colors: null, labelsToShow: null, legend: null };

                const allIncomes = daFeatures
                    .map(f => f.properties.median_income)
                    .filter(d => d != null)
                    .sort((a, b) => a - b);
                const p95 = d3.quantile(allIncomes, 0.99);
                const colorScale = d3.scaleQuantize()
                    .domain([allIncomes[0], p95])
                    .range(d3.schemeYlGnBu[9]);

                const colors = new Map(
                    features.map(f => [
                        f.properties.geo_uid,
                        f.properties.median_income != null
                            ? colorScale(f.properties.median_income)
                            : '#e0e0e0'
                    ])
                );

                return { title: 'Le Plateau — City-wide scale', colors, labelsToShow: null, legend: colorScale };
            }

            case 9: {
                // Le Plateau — LOCAL income scale (only Plateau DAs define the extent)
                const features = visibleDAs;
                if (features.length === 0) return { title: 'Le Plateau — Local scale', colors: null, labelsToShow: null, legend: null };

                // Compute local extent from bbox-filtered DAs directly
                const plateauDAs = daFeatures.filter(isInPlateau);
                const localIncomes = plateauDAs
                    .map(f => f.properties.median_income)
                    .filter(d => d != null);
                const [localMin, localMax] = d3.extent(localIncomes);
                const colorScale = d3.scaleQuantize()
                    .domain([localMin, localMax])
                    .range(d3.schemeYlGnBu[9]);

                const colors = new Map(
                    features.map(f => [
                        f.properties.geo_uid,
                        f.properties.median_income != null
                            ? colorScale(f.properties.median_income)
                            : '#e0e0e0'
                    ])
                );

                return { title: 'Le Plateau — Local scale', colors, labelsToShow: null, legend: colorScale };
            }

            case 10: {
                // Zoom back out — population density with quantile bins
                const features = daFeatures;
                if (features.length === 0) return { title: 'Population Density (Census 2021)', colors: null, labelsToShow: null, legend: null };

                const densities = features
                    .map(f => f.properties.pop_density)
                    .filter(d => d != null && isFinite(d));
                const colorScale = d3.scaleQuantile()
                    .domain(densities)
                    .range(d3.schemeYlGnBu[9]);

                const colors = new Map(
                    features.map(f => [
                        f.properties.geo_uid,
                        f.properties.pop_density != null && isFinite(f.properties.pop_density)
                            ? colorScale(f.properties.pop_density)
                            : '#e0e0e0'
                    ])
                );

                return { title: 'Population Density (Census 2021)', colors, labelsToShow: null, legend: colorScale };
            }

            default: {
                return { title: null, colors: null, labelsToShow: null, legend: null };
            }
        }
    });

    // Projection — animated zoom between full city and Plateau.
    // Only tween on step change; dimension changes update instantly.
    let targetParams = $derived.by(() => {
        const target = isZoomStep(stepIndex)
            ? plateauCollection
            : { type: 'FeatureCollection', features: districts };
        const p = d3.geoMercator().fitSize([innerWidth, innerHeight], target);
        return { scale: p.scale(), translate: p.translate() };
    });

    const tweenOpts = { duration: 1200, easing: cubicInOut };
    const projScale = new Tween(targetParams.scale, tweenOpts);
    const projTranslate = new Tween(targetParams.translate, tweenOpts);

    let prevZoomed = isZoomStep(stepIndex);
    $effect(() => {
        const nowZoomed = isZoomStep(stepIndex);
        const zoomChanged = nowZoomed !== prevZoomed;
        prevZoomed = nowZoomed;

        // Clear tooltip when leaving zoom steps
        if (!nowZoomed) hoveredDa = null;

        if (zoomChanged) {
            // Step changed zoom target — animate
            projScale.set(targetParams.scale);
            projTranslate.set(targetParams.translate);
        } else {
            // Dimension change or non-zoom step change — snap instantly
            projScale.set(targetParams.scale, { duration: 0 });
            projTranslate.set(targetParams.translate, { duration: 0 });
        }
    });

    let projection = $derived(
        d3.geoMercator().scale(projScale.current).translate(projTranslate.current)
    );

    let pathGenerator = $derived(d3.geoPath().projection(projection));

    function getCentroid(feature) {
        return pathGenerator.centroid(feature);
    }

    let isLoading = $derived(
        pop2011.loading || changeData.loading || (showDAs && daQuery.loading)
    );
</script>

<div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
    {#if isLoading && stepIndex > 0}
        <div class="loading-overlay">Loading DuckDB{showDAs ? ' + Spatial' : ''}...</div>
    {/if}

    <div class="year-indicator">{mapConfig.title}</div>

    <svg viewBox={`0 0 ${width} ${height}`} style="background: #a6cee3;">
        <g transform={`translate(${margin.left},${margin.top})`}>
            <!-- Boundary (CMA land outside districts) -->
            {#each boundary as feature (feature.properties.id)}
                <path
                    class="boundary"
                    d={pathGenerator(feature)}
                    fill="#f4efea"
                    stroke="#999"
                    stroke-width="0.5"
                    pointer-events="none"
                />
            {/each}

            <!-- Districts (arrondissement level) — fades out when DAs appear -->
            <g style="transition: opacity 0.8s ease;" opacity={showDAs ? 0 : 1}>
                {#each districts as feature (feature.properties.id)}
                    {@const arrondissement = feature.properties.arrondissement}
                    {@const fill = mapConfig.colors?.get(arrondissement) ?? '#e0e0e0'}
                    <path
                        class="district"
                        d={pathGenerator(feature)}
                        {fill}
                        stroke="#333"
                        stroke-width="0.5"
                        style="transition: fill 0.5s ease;"
                        pointer-events="none"
                    />
                {/each}

                <!-- District labels -->
                {#each districts as feature (feature.properties.id)}
                    {@const centroid = getCentroid(feature)}
                    {@const arrondissement = feature.properties.arrondissement}
                    {@const showLabel = mapConfig.labelsToShow
                        ? mapConfig.labelsToShow.has(arrondissement)
                        : !isMobile}
                    {#if centroid && !isNaN(centroid[0]) && showLabel}
                        <text
                            x={centroid[0]}
                            y={centroid[1]}
                            text-anchor="middle"
                            font-size="10"
                            font-weight="500"
                            fill="#333"
                            stroke="white"
                            stroke-width="3"
                            stroke-linejoin="round"
                            paint-order="stroke"
                        >
                            {feature.properties.nom}
                        </text>
                    {/if}
                {/each}
            </g>

            <!-- DA polygons — fades in on step 3 -->
            <g style="transition: opacity 0.8s ease;" opacity={showDAs ? 1 : 0}>
                {#each visibleDAs as feature (feature.properties.geo_uid)}
                    {@const baseFill = mapConfig.colors?.get(feature.properties.geo_uid) ?? '#e0e0e0'}
                    {@const isHovered = hoveredDa?.properties.geo_uid === feature.properties.geo_uid}
                    <path
                        d={pathGenerator(feature)}
                        fill={isHovered ? '#ffd700' : baseFill}
                        stroke={isHovered ? '#333' : '#666'}
                        stroke-width={isHovered ? 1.5 : isZoomStep(stepIndex) ? 0.3 : 0.15}
                        style="transition: fill 0.3s ease;"
                        onmouseenter={() => { if (isZoomStep(stepIndex)) hoveredDa = feature; }}
                        onmouseleave={() => { if (isZoomStep(stepIndex)) hoveredDa = null; }}
                        onmousemove={(e) => { if (isZoomStep(stepIndex)) mouse = { x: e.offsetX, y: e.offsetY }; }}
                    />
                {/each}

                {#if isZoomStep(stepIndex) || isHighlightStep(stepIndex)}
                    <!-- Plateau district outlines (highlighted) -->
                    {#each plateauDistricts as feature (feature.properties.id)}
                        <path
                            d={pathGenerator(feature)}
                            fill="none"
                            stroke="#d62728"
                            stroke-width={isZoomStep(stepIndex) ? 2 : 2.5}
                            pointer-events="none"
                        />
                    {/each}
                    {#if isHighlightStep(stepIndex)}
                        <!-- All other district outlines (dimmed context) -->
                        {#each districts as feature (feature.properties.id)}
                            <path
                                d={pathGenerator(feature)}
                                fill="none"
                                stroke="#333"
                                stroke-width="0.5"
                                pointer-events="none"
                            />
                        {/each}
                    {/if}
                {:else}
                    <!-- District outlines on top for context -->
                    {#each districts as feature (feature.properties.id)}
                        <path
                            d={pathGenerator(feature)}
                            fill="none"
                            stroke="#333"
                            stroke-width="1"
                            pointer-events="none"
                        />
                    {/each}
                {/if}
            </g>
        </g>
    </svg>

    <Legend scale={mapConfig.legend} />

    {#if hoveredDa && isZoomStep(stepIndex)}
        <div class="tooltip" style="left: {mouse.x + 12}px; top: {mouse.y - 12}px;">
            <strong>DA {hoveredDa.properties.geo_uid}</strong><br>
            Pop: {hoveredDa.properties.population?.toLocaleString()}<br>
            Density: {hoveredDa.properties.pop_density?.toFixed(0)}/km²<br>
            Income: ${hoveredDa.properties.median_income?.toLocaleString()}
        </div>
    {/if}
</div>

<style>
    .chart-container {
        width: 100%;
        height: 100%;
        min-height: min(500px, 80vh);
        position: relative;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 16px;
        overflow: hidden;
    }

    @media (max-width: 767px) {
        .chart-container {
            aspect-ratio: 1;
            min-height: unset;
            height: auto;
            width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    svg {
        width: 100%;
        height: 100%;
    }

    .year-indicator {
        position: absolute;
        top: 10px;
        left: 10px;
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
        background: rgba(255, 255, 255, 0.8);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }

    .loading-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.9rem;
        color: #666;
        background: rgba(255, 255, 255, 0.9);
        padding: 0.5rem 1rem;
        border-radius: 6px;
        z-index: 10;
    }

    .tooltip {
        position: absolute;
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        font-size: 0.75rem;
        line-height: 1.4;
        pointer-events: none;
        z-index: 20;
        white-space: nowrap;
    }
</style>
