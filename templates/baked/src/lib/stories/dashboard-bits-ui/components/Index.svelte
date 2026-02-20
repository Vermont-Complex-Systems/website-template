<script>
    import { scaleLinear, scaleOrdinal, extent } from 'd3';
    import { Tween } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    import { Sidebar, ChartTooltip, useIsMobile } from '@the-vcsi/scrolly-kit';

    import courses_viz from '../data/courses_viz.csv';
    import AppSidebar from './AppSidebar.svelte';
    import SectionCards from './SectionCards.svelte';
    import DataTable from './DataTable.svelte';
    import EmbeddingDotPlot from './EmbeddingDotPlot.svelte';
    import Grid from './Grid.svelte';

    let width = $state(800);
    let height = $state(600);

    let hoveredCourse = $state(null);
    let hoveredElement = $state(null);

    // Sidebar filter state
    let selectedYear = $state('2026');
    let selectedColleges = $state(new Set()); // empty = all selected
    let searchQuery = $state('');

    // Chart-specific mobile awareness (for margins)
    const mobile = useIsMobile();
    let isMobile = $derived(mobile.current);

    let margin = $derived(
        isMobile
            ? { top: 10, right: 10, bottom: 10, left: 10 }
            : { top: 50, right: 50, bottom: 50, left: 50 }
    );

    const colleges = [...new Set(courses_viz.map(d => d.college))];

    const colorScale = scaleOrdinal()
        .domain(colleges)
        .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]);

    let filteredData = $derived.by(() => {
        let data = courses_viz;
        if (selectedColleges.size > 0) {
            data = data.filter(d => selectedColleges.has(d.college));
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            data = data.filter(d =>
                d.title?.toLowerCase().includes(query) ||
                d.description?.toLowerCase().includes(query)
            );
        }
        return data;
    });

    let xExtent = $derived.by(() => {
        const data = filteredData.length > 0 ? filteredData : courses_viz;
        const [min, max] = extent(data, d => d.x);
        const padding = (max - min) * 0.05;
        return [min - padding, max + padding];
    });

    let yExtent = $derived.by(() => {
        const data = filteredData.length > 0 ? filteredData : courses_viz;
        const [min, max] = extent(data, d => d.y);
        const padding = (max - min) * 0.05;
        return [min - padding, max + padding];
    });

    const xMin = Tween.of(() => xExtent[0], { duration: 600, easing: cubicOut });
    const xMax = Tween.of(() => xExtent[1], { duration: 600, easing: cubicOut });
    const yMin = Tween.of(() => yExtent[0], { duration: 600, easing: cubicOut });
    const yMax = Tween.of(() => yExtent[1], { duration: 600, easing: cubicOut });

    let xScale = $derived(
        scaleLinear()
            .domain([xMin.current, xMax.current])
            .range([margin.left, width - margin.right])
    );

    let yScale = $derived(
        scaleLinear()
            .domain([yMin.current, yMax.current])
            .range([height - margin.bottom, margin.top])
    );

    let radiusScale = $derived(
        scaleLinear()
            .domain([0, 10])
            .range([3, 30])
    );

    let hoveredData = $derived(
        hoveredCourse
            ? filteredData.find(c => c.code === hoveredCourse)
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
            {colorScale}
        />

        <Sidebar.Inset>
            <SectionCards data={filteredData} totalCount={courses_viz.length} />
            <div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
                <svg viewBox={`0 0 ${width} ${height}`}>
                    <Grid {xScale} {yScale} {width} {height} {margin} />

                    <EmbeddingDotPlot
                        data={filteredData}
                        {xScale}
                        {yScale}
                        {colorScale}
                        {radiusScale}
                        {isMobile}
                        bind:hoveredCourse
                        bind:hoveredElement
                    />
                </svg>
            </div>
            <DataTable data={filteredData} />
        </Sidebar.Inset>
    </Sidebar.Root>
</Sidebar.Provider>

<ChartTooltip
    open={!!hoveredCourse}
    anchor={hoveredElement}
    onClose={() => { hoveredCourse = null; hoveredElement = null; }}
>
    {#if hoveredData}
        <h1 class="tooltip-title">{hoveredData.title}</h1>
        <p class="tooltip-code">{hoveredData.code}</p>
        <p class="tooltip-description">{hoveredData.description_clean}</p>
    {/if}
</ChartTooltip>

<style>
    svg {
        width: 100%;
        height: 100%;
    }

    .chart-container {
        width: 100%;
        height: 75vh;
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
    }

    .tooltip-title {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
        padding-right: 1.5rem;
    }

    .tooltip-code {
        margin: 0 0 0.75rem 0;
        font-size: 0.85rem;
        color: #aaa;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #444;
    }

    .tooltip-description {
        margin: 0;
        font-size: 0.85rem;
        line-height: 1.4;
    }
</style>
