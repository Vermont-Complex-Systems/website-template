# Dashboard DuckDB Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replicate the fresh template's `dashboard-1` dashboard in the baked template, powered by DuckDB-WASM querying a local parquet file instead of server-side remote functions.

**Architecture:** Copy all 6 UI subcomponents verbatim from fresh. Rewrite only `Index.svelte` to load data via DuckDB-WASM on mount, filter client-side with `$derived`, and use local array lookup for detail instead of TanStack Query. Add a loading spinner while DuckDB initializes.

**Tech Stack:** Svelte 5 (runes), DuckDB-WASM, @tanstack/svelte-table, D3, @the-vcsi/scrolly-kit (Sidebar, ChartTooltip, Spinner, useIsMobile, SimpleSelect)

---

### Task 1: Copy subcomponents from fresh

**Files:**
- Copy: `templates/fresh/src/lib/stories/dashboard-1/components/AppSidebar.svelte` → `templates/baked/src/lib/stories/dashboard-duckdb/components/AppSidebar.svelte`
- Copy: `templates/fresh/src/lib/stories/dashboard-1/components/SectionCards.svelte` → `templates/baked/src/lib/stories/dashboard-duckdb/components/SectionCards.svelte`
- Copy: `templates/fresh/src/lib/stories/dashboard-1/components/DataTable.svelte` → `templates/baked/src/lib/stories/dashboard-duckdb/components/DataTable.svelte`
- Copy: `templates/fresh/src/lib/stories/dashboard-1/components/EmbeddingDotPlot.svelte` → `templates/baked/src/lib/stories/dashboard-duckdb/components/EmbeddingDotPlot.svelte`
- Copy: `templates/fresh/src/lib/stories/dashboard-1/components/Grid.svelte` → `templates/baked/src/lib/stories/dashboard-duckdb/components/Grid.svelte`
- Copy: `templates/fresh/src/lib/stories/dashboard-1/components/Legend.svelte` → `templates/baked/src/lib/stories/dashboard-duckdb/components/Legend.svelte`

**Step 1: Copy all 6 files**

```bash
SRC=templates/fresh/src/lib/stories/dashboard-1/components
DEST=templates/baked/src/lib/stories/dashboard-duckdb/components

cp "$SRC/AppSidebar.svelte" "$DEST/AppSidebar.svelte"
cp "$SRC/SectionCards.svelte" "$DEST/SectionCards.svelte"
cp "$SRC/DataTable.svelte" "$DEST/DataTable.svelte"
cp "$SRC/EmbeddingDotPlot.svelte" "$DEST/EmbeddingDotPlot.svelte"
cp "$SRC/Grid.svelte" "$DEST/Grid.svelte"
cp "$SRC/Legend.svelte" "$DEST/Legend.svelte"
```

**Step 2: Commit**

```bash
git add templates/baked/src/lib/stories/dashboard-duckdb/components/
git commit -m "feat(dashboard-duckdb): copy subcomponents from fresh dashboard-1"
```

---

### Task 2: Rewrite Index.svelte for DuckDB

**Files:**
- Modify: `templates/baked/src/lib/stories/dashboard-duckdb/components/Index.svelte`

**Step 1: Write the full Index.svelte**

Key changes from fresh's Index.svelte:
- Replace `await getEmbeddings()` (top-level await, server) with `onMount` + `storyQuery()` (client DuckDB)
- Replace `createQuery()` detail fetching with `rows.find(d => d.id === id)`
- Add loading state with `Spinner` while DuckDB initializes
- Remove `@tanstack/svelte-query` import entirely
- Remove `academic.remote.js` import entirely

```svelte
<script>
	import { scaleLinear, scaleOrdinal, extent } from 'd3';
	import { onMount } from 'svelte';

	import { Sidebar, ChartTooltip, Spinner, useIsMobile } from '@the-vcsi/scrolly-kit';
	import { storyQuery } from '$lib/db/query';

	import AppSidebar from './AppSidebar.svelte';
	import SectionCards from './SectionCards.svelte';
	import DataTable from './DataTable.svelte';
	import EmbeddingDotPlot from './EmbeddingDotPlot.svelte';
	import Grid from './Grid.svelte';

	let { story, data } = $props();

	// Tier 1: all embeddings loaded via DuckDB on mount
	let rows = $state([]);
	let loading = $state(true);

	onMount(async () => {
		rows = await storyQuery(story.slug, `
			SELECT * FROM '${story.slug}.parquet'
		`);
		loading = false;
	});

	let width = $state(800);
	let height = $state(600);

	let hoveredId = $state(null);
	let hoveredElement = $state(null);

	// Tier 2: detail — just find in already-loaded rows
	let selectedId = $state(null);
	let detailData = $derived(
		selectedId ? rows.find(d => d.id === selectedId) : null
	);

	function onDotClick(id) {
		selectedId = selectedId === id ? null : id;
	}

	// Sidebar filter state
	let selectedYear = $state('all');
	let selectedColleges = $state(new Set());
	let searchQuery = $state('');

	// Chart-specific mobile awareness
	const mobile = useIsMobile();
	let isMobile = $derived(mobile.current);

	let margin = $derived(
		isMobile
			? { top: 10, right: 10, bottom: 10, left: 10 }
			: { top: 50, right: 50, bottom: 50, left: 50 }
	);

	let colleges = $derived([...new Set(rows.map(d => d.college).filter(Boolean))].sort());
	let years = $derived([...new Set(rows.map(d => d.publication_year))].sort());

	const colorScale = scaleOrdinal()
		.domain(["CALS","CAS","CEMS","CNHS","COM","CESS","GSB","GRAD","HON","LCOM","RSENR","SGA"])
		.range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf","#aec7e8","#ffbb78"]);

	let filteredData = $derived.by(() => {
		let d = rows;
		if (selectedColleges.size > 0) {
			d = d.filter(r => selectedColleges.has(r.college));
		}
		if (selectedYear !== 'all') {
			d = d.filter(r => r.publication_year === +selectedYear);
		}
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			d = d.filter(r => r.title?.toLowerCase().includes(q));
		}
		return d;
	});

	let xExtent = $derived.by(() => {
		const d = filteredData.length > 0 ? filteredData : rows;
		const [min, max] = extent(d, r => r.umap_1);
		const padding = (max - min) * 0.05;
		return [min - padding, max + padding];
	});

	let yExtent = $derived.by(() => {
		const d = filteredData.length > 0 ? filteredData : rows;
		const [min, max] = extent(d, r => r.umap_2);
		const padding = (max - min) * 0.05;
		return [min - padding, max + padding];
	});

	let xScale = $derived(
		scaleLinear()
			.domain(xExtent)
			.range([margin.left, width - margin.right])
	);

	let yScale = $derived(
		scaleLinear()
			.domain(yExtent)
			.range([height - margin.bottom, margin.top])
	);

	let hoveredData = $derived(
		hoveredId ? filteredData.find(d => d.id === hoveredId) : null
	);
</script>

{#if loading}
	<div class="loading-container">
		<Spinner />
		<p class="loading-text">Loading DuckDB...</p>
	</div>
{:else}
	<Sidebar.Provider>
		<Sidebar.Root id="dashboard-duckdb">
			<AppSidebar
				bind:searchQuery
				bind:selectedYear
				bind:selectedColleges
				{colleges}
				{years}
				{colorScale}
			/>

			<Sidebar.Inset>
				<SectionCards data={filteredData} totalCount={rows.length} />
				<h3 class="chart-title">Paper Similarity (UMAP Embedding)</h3>
				<div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
					<svg viewBox={`0 0 ${width} ${height}`}>
						<Grid {xScale} {yScale} {width} {height} {margin} />
					</svg>

					<EmbeddingDotPlot
						data={filteredData}
						{xScale}
						{yScale}
						{colorScale}
						{width}
						{height}
						{isMobile}
						bind:hoveredId
						bind:hoveredElement
						ondotclick={onDotClick}
					/>
				</div>

				{#if detailData}
					<div class="detail-panel">
						<div class="detail-header">
							<h3 class="detail-title">{detailData.title}</h3>
							<button class="detail-close" onclick={() => selectedId = null} aria-label="Close">&times;</button>
						</div>
						<p class="detail-meta">
							{detailData.ego_display_name} · {detailData.college} · {detailData.publication_year}
						</p>
						{#if detailData.abstract}
							<p class="detail-abstract">{detailData.abstract}</p>
						{/if}
						<div class="detail-footer">
							{#if detailData.cited_by_count != null}
								<span class="detail-badge">Cited by {detailData.cited_by_count}</span>
							{/if}
							{#if detailData.doi}
								<a class="detail-link" href={detailData.doi} target="_blank" rel="noopener">
									View on DOI &rarr;
								</a>
							{/if}
						</div>
					</div>
				{/if}

				<DataTable data={filteredData} />
			</Sidebar.Inset>
		</Sidebar.Root>
	</Sidebar.Provider>

	<ChartTooltip
		open={!!hoveredId}
		anchor={hoveredElement}
		onClose={() => { hoveredId = null; hoveredElement = null; }}
	>
		{#if hoveredData}
			<h1 class="tooltip-title">{hoveredData.title}</h1>
			<p class="tooltip-meta">{hoveredData.ego_display_name} · {hoveredData.college}</p>
			<p class="tooltip-detail">{hoveredData.publication_year} · Cited by {hoveredData.cited_by_count}</p>
		{/if}
	</ChartTooltip>
{/if}

<style>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100dvh;
		gap: 1rem;
	}

	.loading-text {
		font-family: var(--vcsi-font-sans, system-ui, sans-serif);
		font-size: var(--vcsi-font-size-small, 14px);
		color: var(--vcsi-gray-500, rgb(128, 128, 128));
	}

	svg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.chart-title {
		font-family: var(--vcsi-font-sans, system-ui, sans-serif);
		font-size: var(--vcsi-font-size-small, 14px);
		font-weight: 600;
		color: var(--vcsi-gray-700, rgb(78, 78, 78));
		margin: 0;
		padding: var(--vcsi-space-md, 1rem) var(--vcsi-space-lg, 1.5rem) 0;
		flex-shrink: 0;
	}

	.chart-container {
		flex: 1;
		width: 100%;
		min-height: 800px;
		position: relative;
		overflow: hidden;
	}

	.tooltip-title {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		font-weight: 600;
		padding-right: 1.5rem;
	}

	.tooltip-meta {
		margin: 0 0 0.25rem 0;
		font-size: 0.85rem;
		color: var(--vcsi-tooltip-muted, #aaa);
	}

	.tooltip-detail {
		margin: 0;
		font-size: 0.85rem;
		color: var(--vcsi-tooltip-muted, #aaa);
	}

	.detail-panel {
		margin: 0 var(--vcsi-space-lg, 1.5rem);
		padding: var(--vcsi-space-md, 1rem) var(--vcsi-space-lg, 1.5rem);
		background: white;
		border: 1px solid var(--vcsi-border, #ddd);
		border-radius: var(--vcsi-radius-md, 6px);
		flex-shrink: 0;
	}

	.detail-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.detail-title {
		font-family: var(--vcsi-font-sans, system-ui, sans-serif);
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
		color: var(--vcsi-gray-900, rgb(38, 38, 38));
	}

	.detail-close {
		border: none;
		background: none;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		color: var(--vcsi-gray-500, rgb(128, 128, 128));
		padding: 0;
		flex-shrink: 0;
	}

	.detail-close:hover {
		color: var(--vcsi-gray-900, rgb(38, 38, 38));
	}

	.detail-meta {
		font-family: var(--vcsi-font-sans, system-ui, sans-serif);
		font-size: var(--vcsi-font-size-xs, 12px);
		color: var(--vcsi-gray-500, rgb(128, 128, 128));
		margin: 0 0 0.75rem;
	}

	.detail-abstract {
		font-family: var(--vcsi-font-sans, system-ui, sans-serif);
		font-size: var(--vcsi-font-size-small, 14px);
		line-height: 1.6;
		color: var(--vcsi-gray-700, rgb(78, 78, 78));
		margin: 0 0 0.75rem;
	}

	.detail-footer {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.detail-badge {
		font-family: var(--vcsi-font-sans, system-ui, sans-serif);
		font-size: var(--vcsi-font-size-xs, 12px);
		color: var(--vcsi-gray-500, rgb(128, 128, 128));
		background: var(--vcsi-sidebar-bg, #ebe6e1);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}

	.detail-link {
		font-family: var(--vcsi-font-sans, system-ui, sans-serif);
		font-size: var(--vcsi-font-size-xs, 12px);
		color: var(--color-uvm-green, #007155);
		text-decoration: none;
	}

	.detail-link:hover {
		text-decoration: underline;
	}
</style>
```

**Step 2: Commit**

```bash
git add templates/baked/src/lib/stories/dashboard-duckdb/components/Index.svelte
git commit -m "feat(dashboard-duckdb): rewrite Index.svelte for DuckDB-WASM data loading"
```

---

### Task 3: Verify and test

**Step 1: Start dev server**

```bash
cd templates/baked && npm run dev
```

**Step 2: Open browser to `/dashboard-duckdb`**

Verify:
- [ ] Loading spinner appears briefly while DuckDB initializes
- [ ] Scatter plot renders with colored dots by college
- [ ] Sidebar filters work (year dropdown, college legend, search)
- [ ] SectionCards show correct counts
- [ ] Hovering dots shows tooltip
- [ ] Clicking a dot shows detail panel with title, author, abstract, DOI
- [ ] DataTable shows filtered data with sorting and pagination
- [ ] Mobile responsive (sidebar collapses, cards hide)

**Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix(dashboard-duckdb): address issues found during testing"
```
