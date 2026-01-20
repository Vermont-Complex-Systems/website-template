<script>
    import { scaleLinear, scaleOrdinal } from 'd3';
    import rawData from '../data/life-expectancy-vs-electoral-democracy-index-modern.csv';

    let { scrollyIndex } = $props();

    // Chart dimensions - bind to container for responsiveness
    let width = $state(800);
    let height = $state(600);
    let navHeight = 200
    const margin = { top: 60, right: 40, bottom: 70, left: 70 };

    let innerWidth = $derived(width - margin.left - margin.right);
    let innerHeight = $derived(height - margin.top - margin.bottom - navHeight/2);

    // Build region lookup from rows that have region data
    const regionLookup = {};
    rawData.forEach(d => {
        const region = d['World region according to OWID'];
        if (region && region.trim() !== '') {
            regionLookup[d.Entity] = region.trim();
        }
    });

    // Filter and prepare data - exclude aggregate regions like "Africa", "World", etc.
    const aggregateEntities = new Set(['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'World', 'High-income countries', 'Low-income countries', 'Lower-middle-income countries', 'Upper-middle-income countries']);

    const allData = rawData
        .filter(d => {
            const lifeExp = d['Period life expectancy at birth'];
            const democracy = d['Electoral democracy index (central estimate)'];
            const year = +d.Year;
            return lifeExp && democracy && !aggregateEntities.has(d.Entity) && year >= 2001;
        })
        .map(d => ({
            entity: d.Entity,
            code: d.Code,
            year: +d.Year,
            lifeExpectancy: +d['Period life expectancy at birth'],
            democracy: +d['Electoral democracy index (central estimate)'],
            region: regionLookup[d.Entity] || 'Unknown'
        }));

    // Get unique years for scrolling
    const years = [...new Set(allData.map(d => d.year))].sort((a, b) => a - b);

    // Map scrollyIndex to year
    let currentYear = $derived(years[Math.min(scrollyIndex ?? 0, years.length - 1)] ?? years[0]);

    // Filter data for current year
    let currentData = $derived(allData.filter(d => d.year === currentYear));

    // Color scale for regions
    const regions = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America', 'Unknown'];
    const colorScale = scaleOrdinal()
        .domain(regions)
        .range(['#e15759', '#f28e2c', '#4e79a7', '#76b7b2', '#59a14f', '#edc949', '#999999']);

    // Scales
    let xScale = $derived(scaleLinear()
        .domain([0, 1])
        .range([0, innerWidth]));

    let yScale = $derived(scaleLinear()
        .domain([15, 90])
        .range([innerHeight, 0]));

    // Axis ticks
    const xTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
    const yTicks = [15, 30, 40, 50, 60, 70, 80, 90];

    // Tooltip state
    let hoveredCountry = $state(null);
</script>

<div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
    <svg viewBox={`0 0 ${width} ${height-navHeight}`}>
        <g transform={`translate(${margin.left},${margin.top})`}>
            <!-- Grid lines -->
            {#each xTicks as tick}
                <line
                    x1={xScale(tick)}
                    x2={xScale(tick)}
                    y1={0}
                    y2={innerHeight}
                    stroke="#e0e0e0"
                    stroke-width="1"
                />
            {/each}
            {#each yTicks as tick}
                <line
                    x1={0}
                    x2={innerWidth}
                    y1={yScale(tick)}
                    y2={yScale(tick)}
                    stroke="#e0e0e0"
                    stroke-width="1"
                />
            {/each}

            <!-- Dots -->
            {#each currentData as d (d.entity)}
                <circle
                    cx={xScale(d.democracy)}
                    cy={yScale(d.lifeExpectancy)}
                    r={6}
                    fill={colorScale(d.region)}
                    opacity={hoveredCountry === d.entity ? 1 : 0.7}
                    stroke={hoveredCountry === d.entity ? '#333' : 'white'}
                    stroke-width={hoveredCountry === d.entity ? 2 : 0.5}
                    style="transition: cx 0.8s ease-in-out, cy 0.8s ease-in-out;"
                    onmouseenter={() => hoveredCountry = d.entity}
                    onmouseleave={() => hoveredCountry = null}
                >
                    <title>{d.entity}: Life exp. {d.lifeExpectancy.toFixed(1)}, Democracy {d.democracy.toFixed(2)}</title>
                </circle>
            {/each}

            <!-- X-axis -->
            <line x1={0} x2={innerWidth} y1={innerHeight} y2={innerHeight} stroke="#333" stroke-width="1" />
            {#each xTicks as tick}
                <text
                    x={xScale(tick)}
                    y={innerHeight + 20}
                    text-anchor="middle"
                    font-size="12"
                >
                    {tick}
                </text>
            {/each}
            <text
                x={innerWidth / 2}
                y={innerHeight + 50}
                text-anchor="middle"
                font-size="14"
                font-weight="500"
            >
                Electoral Democracy Index
            </text>

            <!-- Y-axis -->
            <line x1={0} x2={0} y1={0} y2={innerHeight} stroke="#333" stroke-width="1" />
            {#each yTicks as tick}
                <text
                    x={-10}
                    y={yScale(tick)}
                    text-anchor="end"
                    alignment-baseline="middle"
                    font-size="12"
                >
                    {tick}
                </text>
            {/each}
            <text
                x={-innerHeight / 2}
                y={-45}
                text-anchor="middle"
                font-size="14"
                font-weight="500"
                transform="rotate(-90)"
            >
                Life Expectancy (years)
            </text>

            <!-- Year label -->
            <text
                x={innerWidth - 10}
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

        <!-- Legend -->
        <g transform={`translate(${margin.left + 20}, 20)`}>
            {#each regions.filter(r => r !== 'Unknown') as region, i}
                <g transform={`translate(${i * 110}, 0)`}>
                    <circle cx={0} cy={0} r={6} fill={colorScale(region)} opacity={0.7} />
                    <text x={12} y={4} font-size="10">{region}</text>
                </g>
            {/each}
        </g>
    </svg>
</div>

<style>
    .chart-container {
        width: 100%;
        height: 100%;
        background: var(--color-bg, #f4efe9);
    }

    svg {
        width: 100%;
        height: 100%;
    }

    text {
        fill: #333;
    }

    circle {
        cursor: pointer;
    }
</style>
