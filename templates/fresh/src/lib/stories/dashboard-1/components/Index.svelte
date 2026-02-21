<script>
    import { scaleLinear, scaleOrdinal, extent } from 'd3';

    import { createQuery } from '@tanstack/svelte-query';
    import { Sidebar, ChartTooltip, useIsMobile } from '@the-vcsi/scrolly-kit';
    import { getEmbeddings, getEmbeddingDetail } from '../academic.remote.js';

    import AppSidebar from './AppSidebar.svelte';
    import SectionCards from './SectionCards.svelte';
    import DataTable from './DataTable.svelte';
    import EmbeddingDotPlot from './EmbeddingDotPlot.svelte';
    import Grid from './Grid.svelte';

    // Tier 1: fetched once on load via remote function (runs on SvelteKit server)
    const embeddings = await getEmbeddings();

    let width = $state(800);
    let height = $state(600);

    let hoveredId = $state(null);
    let hoveredElement = $state(null);

    // Tier 2: detail — fetched on demand when a dot is clicked, cached by TanStack Query
    let selectedId = $state(null);

    const detailQuery = createQuery(() => ({
        queryKey: ['embedding-detail', selectedId],
        queryFn: () => getEmbeddingDetail(selectedId),
        enabled: !!selectedId,
    }));

    function onDotClick(id) {
        selectedId = selectedId === id ? null : id;
    }

    // Sidebar filter state
    let selectedYear = $state('all');
    let selectedColleges = $state(new Set());
    let searchQuery = $state('');

    // Chart-specific mobile awareness (for margins)
    const mobile = useIsMobile();
    let isMobile = $derived(mobile.current);

    let margin = $derived(
        isMobile
            ? { top: 10, right: 10, bottom: 10, left: 10 }
            : { top: 50, right: 50, bottom: 50, left: 50 }
    );

    const colleges = [...new Set(embeddings.map(d => d.college).filter(Boolean))].sort();
    const years = [...new Set(embeddings.map(d => d.publication_year))].sort();

    const colorScale = scaleOrdinal()
        .domain(colleges)
        .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]);

    let filteredData = $derived.by(() => {
        let data = embeddings;
        if (selectedColleges.size > 0) {
            data = data.filter(d => selectedColleges.has(d.college));
        }
        if (selectedYear !== 'all') {
            data = data.filter(d => d.publication_year === +selectedYear);
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            data = data.filter(d =>
                d.title?.toLowerCase().includes(query)
            );
        }
        return data;
    });

    let xExtent = $derived.by(() => {
        const data = filteredData.length > 0 ? filteredData : embeddings;
        const [min, max] = extent(data, d => d.umap_1);
        const padding = (max - min) * 0.05;
        return [min - padding, max + padding];
    });

    let yExtent = $derived.by(() => {
        const data = filteredData.length > 0 ? filteredData : embeddings;
        const [min, max] = extent(data, d => d.umap_2);
        const padding = (max - min) * 0.05;
        return [min - padding, max + padding];
    });

    let xScale = $derived(
        scaleLinear()
            .domain(xExtent)
            .range([margin.left, width - margin.right])
    );

    let yScale = $derived(
        scaleLinear()
            .domain(yExtent)
            .range([height - margin.bottom, margin.top])
    );

    let hoveredData = $derived(
        hoveredId
            ? filteredData.find(d => d.id === hoveredId)
            : null
    );
</script>

<Sidebar.Provider>
    <Sidebar.Root id="dashboard-1">
        <AppSidebar
            bind:searchQuery
            bind:selectedYear
            bind:selectedColleges
            {colleges}
            {years}
            {colorScale}
        />

        <Sidebar.Inset>
            <SectionCards data={filteredData} totalCount={embeddings.length} />
            <h3 class="chart-title">Paper Similarity (UMAP Embedding)</h3>
            <div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
                <svg viewBox={`0 0 ${width} ${height}`}>
                    <Grid {xScale} {yScale} {width} {height} {margin} />
                </svg>

                <EmbeddingDotPlot
                    data={filteredData}
                    {xScale}
                    {yScale}
                    {colorScale}
                    {width}
                    {height}
                    {isMobile}
                    bind:hoveredId
                    bind:hoveredElement
                    ondotclick={onDotClick}
                />
            </div>

            {#if selectedId}
                <div class="detail-panel">
                    {#if detailQuery.isLoading}
                        <p class="detail-loading">Loading paper details...</p>
                    {:else if detailQuery.isError}
                        <p class="detail-loading">Failed to load details.</p>
                    {:else if detailQuery.isSuccess}
                        {@const d = detailQuery.data}
                        <div class="detail-header">
                            <h3 class="detail-title">{d.title}</h3>
                            <button class="detail-close" onclick={() => selectedId = null} aria-label="Close">&times;</button>
                        </div>
                        <p class="detail-meta">
                            {d.ego_display_name} · {d.college} · {d.publication_year}
                        </p>
                        {#if d.abstract}
                            <p class="detail-abstract">{d.abstract}</p>
                        {/if}
                        <div class="detail-footer">
                            {#if d.cited_by_count != null}
                                <span class="detail-badge">Cited by {d.cited_by_count}</span>
                            {/if}
                            {#if d.doi}
                                <a class="detail-link" href={d.doi} target="_blank" rel="noopener">
                                    View on DOI &rarr;
                                </a>
                            {/if}
                        </div>
                    {/if}
                </div>
            {/if}

            <DataTable data={filteredData} />
        </Sidebar.Inset>
    </Sidebar.Root>
</Sidebar.Provider>

<ChartTooltip
    open={!!hoveredId}
    anchor={hoveredElement}
    onClose={() => { hoveredId = null; hoveredElement = null; }}
>
    {#if hoveredData}
        <h1 class="tooltip-title">{hoveredData.title}</h1>
        <p class="tooltip-meta">{hoveredData.ego_display_name} · {hoveredData.college}</p>
        <p class="tooltip-detail">{hoveredData.publication_year} · Cited by {hoveredData.cited_by_count}</p>
    {/if}
</ChartTooltip>

<style>
    svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .chart-title {
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: var(--vcsi-font-size-small, 14px);
        font-weight: 600;
        color: var(--vcsi-gray-700, rgb(78, 78, 78));
        margin: 0;
        padding: var(--vcsi-space-md, 1rem) var(--vcsi-space-lg, 1.5rem) 0;
        flex-shrink: 0;
    }

    .chart-container {
        flex: 1;
        width: 100%;
        min-height: 800px;
        position: relative;
        overflow: hidden;
    }

    .tooltip-title {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
        padding-right: 1.5rem;
    }

    .tooltip-meta {
        margin: 0 0 0.25rem 0;
        font-size: 0.85rem;
        color: var(--vcsi-tooltip-muted, #aaa);
    }

    .tooltip-detail {
        margin: 0;
        font-size: 0.85rem;
        color: var(--vcsi-tooltip-muted, #aaa);
    }

    .detail-panel {
        margin: 0 var(--vcsi-space-lg, 1.5rem);
        padding: var(--vcsi-space-md, 1rem) var(--vcsi-space-lg, 1.5rem);
        background: white;
        border: 1px solid var(--vcsi-border, #ddd);
        border-radius: var(--vcsi-radius-md, 6px);
        flex-shrink: 0;
    }

    .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
    }

    .detail-title {
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
        color: var(--vcsi-gray-900, rgb(38, 38, 38));
    }

    .detail-close {
        border: none;
        background: none;
        font-size: 1.5rem;
        line-height: 1;
        cursor: pointer;
        color: var(--vcsi-gray-500, rgb(128, 128, 128));
        padding: 0;
        flex-shrink: 0;
    }

    .detail-close:hover {
        color: var(--vcsi-gray-900, rgb(38, 38, 38));
    }

    .detail-meta {
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: var(--vcsi-font-size-xs, 12px);
        color: var(--vcsi-gray-500, rgb(128, 128, 128));
        margin: 0 0 0.75rem;
    }

    .detail-abstract {
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: var(--vcsi-font-size-small, 14px);
        line-height: 1.6;
        color: var(--vcsi-gray-700, rgb(78, 78, 78));
        margin: 0 0 0.75rem;
    }

    .detail-footer {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .detail-badge {
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: var(--vcsi-font-size-xs, 12px);
        color: var(--vcsi-gray-500, rgb(128, 128, 128));
        background: var(--vcsi-sidebar-bg, #ebe6e1);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
    }

    .detail-link {
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: var(--vcsi-font-size-xs, 12px);
        color: var(--color-uvm-green, #007155);
        text-decoration: none;
    }

    .detail-link:hover {
        text-decoration: underline;
    }

    .detail-loading {
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: var(--vcsi-font-size-small, 14px);
        color: var(--vcsi-gray-500, rgb(128, 128, 128));
        margin: 0;
    }
</style>
