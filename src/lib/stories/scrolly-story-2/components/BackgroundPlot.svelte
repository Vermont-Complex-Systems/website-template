<script>
    import { scaleLinear, scaleOrdinal } from 'd3';

    import RegionLegend from './RegionLegend.svelte';
    import ScatterDots from './ScatterDots.svelte';
    import XAxis from './XAxis.svelte';
    import YAxis from './YAxis.svelte';
    import data from '../data/owid_democracy.csv';

    let { scrollyIndex } = $props();

    // VARIABLES 

    let width = $state(800);
    const height = 800;

    const navHeight = 200;
    const margin = { top: 60, right: 40, bottom: 70, left: 70 };

    let innerWidth = $derived(
        width - margin.left - margin.right
    );

    let innerHeight = height - margin.top - margin.bottom - navHeight / 2;

    const years = [2001, 2007, 2013, 2020, 2022];
    
    // We want regions to be an array, not a set...
    const regions = [...new Set(data.map(d => d.owid_region))];
    
    // FILTERING BASED ON SCROLLY INDEX

    let currentYear = $derived(years[scrollyIndex ?? 0]);
    let currentData = $derived(data.filter(d =>d.year === currentYear && d.life_expectancy > 40));


    // SCALES 

    const colorScale = scaleOrdinal()
        .domain(regions)
        .range(['#e15759', '#f28e2c', '#4e79a7', '#76b7b2', '#59a14f', '#edc949']);

    let xScale = $derived(
        scaleLinear().domain([0, 1.0]).range([0, innerWidth])
    );

    // Harcoding xTicks
    let xTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

    //                           ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ Cheating a little bit because of an outlier
    const ymin = Math.min(...data.filter(d => d.life_expectancy > 40).map(d => d.life_expectancy)) - 10;
    const ymax = Math.max(...data.map(d => d.life_expectancy)) + 10;

    let yScale = scaleLinear().domain([ymin, ymax]).range([innerHeight, 0]);

    const yTicks = [30, 40, 50, 60, 70, 80, 90];

</script>


<div class="chart-container" bind:clientWidth={width}>
    <svg viewBox={`0 0 ${width} ${height-navHeight}`}>
        
        <g transform={`translate(${margin.left},${margin.top})`}>
            <XAxis {xScale} {innerWidth} {innerHeight} ticks={xTicks} label="Democracy Index"/>
            <YAxis {yScale} {innerWidth} {innerHeight} ticks={yTicks} label="Life Expectancy (years)" />

            <ScatterDots
                data={currentData}
                {xScale}
                {yScale}
                {colorScale}
            />

            <!-- Year label -->
            <text
                x={margin.left + 35}
                y={30}
                text-anchor="end"
                font-size="48"
                font-weight="700"
                fill="#ccc"
                opacity="0.5"
            >
                {currentYear}
            </text>
        </g>

        <!-- Legend and X-variable selector -->
        <g transform={`translate(${margin.left + 20}, 20)`}>
            <RegionLegend {regions} {colorScale} {innerWidth} />
        </g>

    </svg>
</div>

<style>
    .chart-container {
        width: 100%;
        height: 100%;
    }
    
    svg {
        width: 100%;
        height: 100%;
    }
</style>
