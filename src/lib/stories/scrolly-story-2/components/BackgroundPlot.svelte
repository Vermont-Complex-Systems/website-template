<script>
    import { scaleLinear, scaleLog, scaleOrdinal, scaleSqrt } from 'd3';
    import { Tween } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import Tooltip from '$lib/components/helpers/Tooltip.svelte';
    import RegressionLines from './RegressionLines.svelte';
    import RegionLegend from './RegionLegend.svelte';
    import ScatterDots from './ScatterDots.svelte';
    import allData from '../data/combined-data.csv';

    let { scrollyIndex } = $props();
    let tooltip = $state({ visible: false, x: 0, y: 0, content: '' });

    // X-axis variable options
    const xVariables = [
        { value: 'democracy', label: 'Electoral Democracy Index', domain: [0, 1], scale: 'linear' },
        { value: 'gdp', label: 'GDP per Capita', domain: [200, 150000], scale: 'log' },
    ];
    let selectedXVar = $state('democracy');
    let xConfig = $derived(xVariables.find(v => v.value === selectedXVar));

    // Population-based dot sizing
    let usePopulationSize = $state(true);

    // Chart dimensions
    let width = $state(800);
    let height = $state(600);
    const navHeight = 200;
    const margin = { top: 60, right: 40, bottom: 70, left: 70 };

    let innerWidth = $derived(width - margin.left - margin.right);
    let innerHeight = $derived(height - margin.top - margin.bottom - navHeight / 2);

    // Years matching the steps in copy.json
    const years = [2001, 2007, 2013, 2020, 2022];

    // Map scrollyIndex to year
    let currentYear = $derived(years[Math.min(scrollyIndex ?? 0, years.length - 1)] ?? years[0]);

    // Filter data for current year AND selected x variable
    let currentData = $derived(
        allData.filter(d => d.year === currentYear && d.x_variable === selectedXVar)
    );

    // Color scale for regions
    const regions = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America', 'Unknown'];
    const colorScale = scaleOrdinal()
        .domain(regions)
        .range(['#e15759', '#f28e2c', '#4e79a7', '#76b7b2', '#59a14f', '#edc949', '#999999']);

    // Radius scale for population (area-proportional using sqrt)
    let radiusScale = $derived(
        scaleSqrt()
            .domain([0, 1.4e9]) // Max ~1.4 billion (China/India)
            .range([3, 30])
    );

    // X-scale - dynamic based on selected variable
    let xScale = $derived(
        xConfig.scale === 'log'
            ? scaleLog().domain(xConfig.domain).range([0, innerWidth])
            : scaleLinear().domain(xConfig.domain).range([0, innerWidth])
    );

    // X-axis ticks
    let xTicks = $derived(
        xConfig.scale === 'log'
            ? [200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000]
            : [0, 0.2, 0.4, 0.6, 0.8, 1.0]
    );

    // Filter state - null means show all, otherwise show only selected regions
    let selectedRegions = $state(new Set());

    // Filtered data based on selected regions
    let filteredData = $derived(
        selectedRegions.size === 0
            ? currentData
            : currentData.filter(d => selectedRegions.has(d.owid_region))
    );

    // Compute min/max life expectancy for filtered data with padding
    let lifeExpExtent = $derived.by(() => {
        const data = filteredData.length > 0 ? filteredData : currentData;
        if (data.length === 0) return [40, 90];
        return [
            Math.floor(Math.min(...data.map(d => d.life_expectancy))) - 5,
            Math.ceil(Math.max(...data.map(d => d.life_expectancy))) + 5
        ];
    });

    // Tweened values for smooth scale transitions
    const yMin = Tween.of(() => lifeExpExtent[0], { duration: 800, easing: cubicOut });
    const yMax = Tween.of(() => lifeExpExtent[1], { duration: 800, easing: cubicOut });

    let yScale = $derived(scaleLinear()
        .domain([yMin.current, yMax.current])
        .range([innerHeight, 0]));

    const yTicks = [20, 30, 40, 50, 60, 70, 80, 90];

    // Tooltip state
    let hoveredCountry = $state(null);

    // Update tooltip content when hovered country changes
    $effect(() => {
        const d = hoveredCountry && filteredData.find(c => c.entity === hoveredCountry);
        tooltip.visible = !!d;
        tooltip.content = d ? `${d.entity}\nLife exp: ${d.life_expectancy.toFixed(1)}\n${xConfig.label}: ${xConfig.scale === 'log' ? d.x_value.toLocaleString() : d.x_value.toFixed(2)}\nPopulation size: ${(d.population/1e6).toFixed(2)}M` : '';
    });

    function handleHover(e) {
        if (e) {
            tooltip.x = e.clientX;
            tooltip.y = e.clientY;
        }
    }

    function formatXTick(tick) {
        if (xConfig.scale === 'log') {
            return tick >= 1000 ? `${tick / 1000}k` : tick;
        }
        return tick;
    }
</script>

<div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
    <svg viewBox={`0 0 ${width} ${height-navHeight}`}>
        <defs>
            <clipPath id="chart-area">
                <rect x={0} y={0} width={innerWidth} height={innerHeight} />
            </clipPath>
            <clipPath id="chart-area-y">
                <rect x={-60} y={0} width={60} height={innerHeight} />
            </clipPath>
        </defs>
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
            <g clip-path="url(#chart-area)">
                {#each yTicks as tick (tick)}
                    <line
                        x1={0}
                        x2={innerWidth}
                        y1={yScale(tick)}
                        y2={yScale(tick)}
                        stroke="#e0e0e0"
                        stroke-width="1"
                    />
                {/each}
            </g>

            <!-- Regression lines per region -->
            <RegressionLines data={filteredData} {xScale} {yScale} {colorScale} />

            <!-- Dots -->
            <ScatterDots
                data={filteredData}
                {xScale}
                {yScale}
                {colorScale}
                {radiusScale}
                {usePopulationSize}
                bind:hoveredCountry
                onHover={handleHover}
            />

            <!-- X-axis -->
            <line x1={0} x2={innerWidth} y1={innerHeight} y2={innerHeight} stroke="#333" stroke-width="1" />
            {#each xTicks as tick}
                <text
                    x={xScale(tick)}
                    y={innerHeight + 20}
                    text-anchor="middle"
                    font-size="12"
                >
                    {formatXTick(tick)}
                </text>
            {/each}
            <text
                x={innerWidth / 2}
                y={innerHeight + 50}
                text-anchor="middle"
                font-size="14"
                font-weight="500"
            >
                {xConfig.label}
            </text>

            <!-- Y-axis -->
            <line x1={0} x2={0} y1={0} y2={innerHeight} stroke="#333" stroke-width="1" />
            <g clip-path="url(#chart-area-y)">
                {#each yTicks as tick (tick)}
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
            </g>
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

        <!-- Legend and X-variable selector -->
        <g transform={`translate(${margin.left + 20}, 20)`}>
            <RegionLegend {regions} {colorScale} bind:selectedRegions {innerWidth} />
        </g>

        <!-- X-variable selector (using foreignObject for HTML select) -->
        <foreignObject x={width - 215} y={10} width="180" height="40">
            <select class="x-selector" bind:value={selectedXVar}>
                {#each xVariables as opt}
                    <option value={opt.value}>{opt.label}</option>
                {/each}
            </select>
        </foreignObject>

        <!-- Population size toggle -->
        <foreignObject x={width - 215} y={50} width="180" height="30">
            <label class="pop-toggle">
                <input type="checkbox" bind:checked={usePopulationSize} />
                <span>Size by population</span>
            </label>
        </foreignObject>
    </svg>
</div>

<Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y} content={tooltip.content} />

<style>
    .chart-container {
        width: 100%;
        height: 100%;
    }

    .x-selector {
        padding: 6px 12px;
        font-size: 13px;
        border-radius: 4px;
        border: 1px solid #555;
        background: #2a2a2a;
        color: #fff;
        cursor: pointer;
        width: 100%;
    }

    .pop-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #fff;
        cursor: pointer;
    }

    .pop-toggle input {
        cursor: pointer;
    }

    svg {
        width: 100%;
        height: 100%;
    }

    text {
        fill: #333;
    }
</style>
