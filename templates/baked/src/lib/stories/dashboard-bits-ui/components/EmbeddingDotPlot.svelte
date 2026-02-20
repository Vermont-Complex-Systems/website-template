<script>
    let {
        data,
        xScale,
        yScale,
        colorScale,
        hoveredCourse = $bindable(),
        hoveredElement = $bindable(null),
        isMobile = false
    } = $props();

</script>

{#each data as d (d.code)}
    <circle
        cx={xScale(d.x)}
        cy={yScale(d.y)}
        r={6}
        fill={colorScale(d.college)}
        opacity={hoveredCourse === d.code ? 1 : 0.7}
        stroke={hoveredCourse === d.code ? '#333' : 'white'}
        stroke-width={hoveredCourse === d.code ? 2 : 0.5}
        style="transition: cx 0.8s ease-in-out, cy 0.8s ease-in-out, r 0.4s ease-out;"
        role="button"
        tabindex="0"
        aria-label={d.code}
        onclick={() => hoveredCourse = d.code}
        onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') hoveredCourse = d.code; }}
        onmouseenter={(e) => { if (!isMobile) { hoveredCourse = d.code; hoveredElement = e.currentTarget; } }}
        onmouseleave={() => { if (!isMobile) { hoveredCourse = null; hoveredElement = null; } }}
    />
{/each}

<style>
    circle {
        cursor: pointer;
    }
</style>
