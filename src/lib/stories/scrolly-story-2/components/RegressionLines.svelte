<script>
    import { regressionLinear } from 'd3-regression';
    import { Tween } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    let { data, xScale, yScale, colorScale } = $props();

    // Compute regression lines per region
    let regressionData = $derived.by(() => {
        const regression = regressionLinear()
            .x(d => d.democracy)
            .y(d => d.lifeExp);

        // Group data by region
        const byRegion = new Map();
        for (const d of data) {
            if (!byRegion.has(d.region)) byRegion.set(d.region, []);
            byRegion.get(d.region).push(d);
        }

        // Compute regression for each region with enough data
        const lines = {};
        for (const [region, regionData] of byRegion) {
            if (regionData.length >= 2) {
                const line = regression(regionData);
                lines[region] = {
                    y0: line.predict(0),
                    y1: line.predict(1),
                    slope: line.b,
                    intercept: line.a
                };
            }
        }
        return lines;
    });

    // Create tweened values for each region
    const regions = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];

    const tweenedLines = Object.fromEntries(
        regions.map(region => [
            region,
            {
                y0: Tween.of(() => regressionData[region]?.y0 ?? 50, { duration: 800, easing: cubicOut }),
                y1: Tween.of(() => regressionData[region]?.y1 ?? 50, { duration: 800, easing: cubicOut }),
                slope: Tween.of(() => regressionData[region]?.slope ?? 0, { duration: 800, easing: cubicOut }),
                intercept: Tween.of(() => regressionData[region]?.intercept ?? 50, { duration: 800, easing: cubicOut })
            }
        ])
    );

    // Get visible regions (those with regression data)
    let visibleRegions = $derived(Object.keys(regressionData));

    // Box dimensions for equations
    const boxWidth = 220;
    const boxPadding = 10;
    const lineHeight = 18;
    let boxHeight = $derived(visibleRegions.length * lineHeight + boxPadding * 2);
</script>

<!-- Regression lines -->
{#each visibleRegions as region (region)}
    <line
        x1={xScale(0)}
        y1={yScale(tweenedLines[region].y0.current)}
        x2={xScale(1)}
        y2={yScale(tweenedLines[region].y1.current)}
        stroke={colorScale(region)}
        stroke-width="2.5"
        stroke-dasharray="6,4"
        opacity="0.9"
        clip-path="url(#chart-area)"
    />
{/each}

<!-- Equation box in bottom right -->
{#if visibleRegions.length > 0}
    <g transform={`translate(${xScale(1) - boxWidth - 10}, ${yScale.range()[0] - boxHeight - 10})`}>
        <rect
            width={boxWidth}
            height={boxHeight}
            fill="#2a2a2a"
            fill-opacity="0.9"
            stroke="#555"
            stroke-width="1"
            rx="4"
        />
        {#each visibleRegions as region, i (region)}
            <text
                x={boxPadding}
                y={boxPadding + (i + 1) * lineHeight - 3}
                font-size="13"
                style="fill: {colorScale(region)};"
            >
                <tspan font-weight="500">{region}:</tspan> y = {tweenedLines[region].slope.current.toFixed(1)}x + {tweenedLines[region].intercept.current.toFixed(1)}
            </text>
        {/each}
    </g>
{/if}
