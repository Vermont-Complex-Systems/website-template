<script>
    import SimpleDAMap from './SimpleDAMap.svelte';
    import FlatGeobufDAMap from './FlatGeobufDAMap.svelte';
    import ZoomMapDuckDB from './ZoomMapDuckDB.svelte';
    import ZoomMapFlatGeobuf from './ZoomMapFlatGeobuf.svelte';

    let { story, data } = $props();
</script>


<div class="story">
    <div style="padding: 2rem;">
    <h2 class="section-title">Static Bbox Comparison</h2>
    <p class="section-desc">Same hardcoded bounding box, same ~164 DAs</p>
    <div class="comparison">
        <div>
            <h3 class="col-label">DuckDB-WASM + Spatial Extension</h3>
            <SimpleDAMap />
        </div>
        <div>
            <h3 class="col-label">FlatGeobuf (HTTP range requests)</h3>
            <FlatGeobufDAMap />
        </div>
    </div>

    <hr class="divider" />

    <h2 class="section-title">Interactive District Zoom</h2>
    <p class="section-desc">Click any electoral district to load its dissemination areas</p>
    <div class="comparison">
        <div>
            <h3 class="col-label">DuckDB-WASM + Spatial Extension</h3>
            <ZoomMapDuckDB />
        </div>
        <div>
            <h3 class="col-label">FlatGeobuf (HTTP range requests)</h3>
            <ZoomMapFlatGeobuf />
        </div>
    </div>
</div>
</div>

<style>
    .section-title { font-family: system-ui; text-align: center; margin: 0 0 0.25rem; }
    .section-desc { font-family: system-ui; text-align: center; color: #666; font-size: 0.9rem; margin: 0 0 1.5rem; }
    .col-label { font-family: system-ui; font-size: 0.9rem; color: #666; margin: 0 0 0.5rem; }
    .divider { margin: 3rem 0; border: none; border-top: 1px solid #ddd; }
    .comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        max-width: 1600px;
        margin: 0 auto;
    }
    @media (max-width: 900px) {
        .comparison { grid-template-columns: 1fr; }
    }
</style>
