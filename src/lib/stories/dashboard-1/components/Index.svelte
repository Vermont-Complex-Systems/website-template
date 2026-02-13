<script>
    import { scaleLinear, scaleOrdinal, extent } from 'd3';

    // import BackToHome from '$lib/components/helpers/BackToHome.svelte';
    import courses_viz from '../data/courses_viz.csv';
    import EmbeddingDotPlot from './EmbeddingDotPlot.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Legend from './Legend.svelte';
    import ChartTooltip from './ChartToolTip.svelte';
    import Xaxis from './Xaxis.svelte';
    import Yaxis from './Yaxis.svelte';
	
    let width = $state(800);
    let height = $state(600);
    
    let hoveredCourse = $state(null);

    const margin = { top: 100, right: 200, bottom: 100, left: 200 };

    let innerWidth = $derived(width - margin.right);

    let innerHeight = $derived(height - margin.top);
    
    const colleges = [...new Set(courses_viz.map(d => d.college))];
    
    const colorScale = scaleOrdinal()
        .domain(colleges)
        .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]);

    let xrange = extent(courses_viz, d=>d.x)

    let xScale = $derived(
            scaleLinear()
                .domain(xrange)
                .range([margin.left, innerWidth])
    );

    
    let yScale = $derived(
        scaleLinear()
            .domain(extent(courses_viz, d=>d.y))
            .range([innerHeight, margin.bottom]) //lets squeeze a little bit 
    );

    let radiusScale = $derived(
        scaleLinear()
            .domain([0, 10])
            .range([3, 30])
    );

    let filteredData = courses_viz;

     let hoveredData = $derived(
        hoveredCourse
            ? filteredData.find(c => c.code === hoveredCourse)
            : null
    );
</script>

<article class="story" id="geo-story-1">
    
    <h1>UVM Spring 2026 course selector!</h1>
    
    <section class="fullscreen-layout">
        
        <div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
            <svg viewBox={`0 0 ${width} ${height}`} >
                
                <g transform={`translate(${margin.left + 20}, 20)`}>
                    <Legend {colleges} {colorScale} {innerWidth} />
                </g>
                
                <Xaxis {xScale} {innerHeight} />
                <Yaxis {yScale} {innerWidth} />

                <EmbeddingDotPlot
                        data={filteredData}
                        {xScale}
                        {yScale}
                        {colorScale}
                        {radiusScale}
                        bind:hoveredCourse
                />
            </svg>
        </div>

    </section>
</article>


<ChartTooltip
    data={hoveredData}
    {xScale}
    {yScale}
    {margin}
    {width}
/>

<Footer theme="light" />

<style>
    svg {
        width: 100%;
        height: 100%;
    }


    .chart-container {
        width: 100%;
        height: 100%;
        min-height: min(500px, 80vh);
        position: relative;
        overflow: hidden;
    }

    .story h1 {
        font-size: var(--font-size-lg);
        margin: 0rem 0 1rem;
        max-width: var(--story-max-width);
        margin-inline: auto;
    }
</style>
