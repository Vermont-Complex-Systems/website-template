<script>
	import { innerHeight } from "svelte/reactivity/window";

    let { scrollyIndex } = $props();
    
    let width = $state(800);
    const height = innerHeight;
</script>

<div class="chart-container" bind:clientWidth={width}>
    <svg viewBox={`0 0 ${width} ${height}`}>
           <!-- TODO -->
    </svg>
</div>

<style>
    .chart-container {
        width: 100%;
        height: auto;
    }

    svg {
        width: 100%;
        height: auto;
    }
</style>
