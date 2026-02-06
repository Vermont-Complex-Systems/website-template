<script>
    let {data, xScale, yScale, colorScale } = $props();

</script>

{#each data as d (d.entity)}
    <circle
        cx={xScale(d.x_value)}
        cy={yScale(d.life_expectancy)}
        r="6"
        fill={colorScale(d.owid_region)}
        opacity='1'
        stroke='white'
        stroke-width='0.5'
        style="transition: cx 0.8s ease-in-out, cy 0.8s ease-in-out, r 0.4s ease-out;"
    />
{/each}
