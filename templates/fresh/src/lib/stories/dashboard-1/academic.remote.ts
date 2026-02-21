import * as v from 'valibot';
import { query } from '$app/server';
import { error } from '@sveltejs/kit';

const API = 'https://api.complexstories.uvm.edu/open-academic-analytics';

// Server-side cache — shared across both tiers so the full dataset is fetched at most once.
// When the API adds /embeddings/overview, remove this cache and hit each endpoint directly.
let _cache: any[] | null = null;

async function fetchAllEmbeddings() {
  if (!_cache) {
    const res = await fetch(`${API}/embeddings`);
    if (!res.ok) error(502, 'Failed to fetch embeddings from API');
    _cache = await res.json();
  }
  return _cache;
}

// ---------------------------------------------------------------------------
// Tier 1: Overview — fetched once on page load, drives scatter plot + filters + table.
// Runs on the SvelteKit server; the client calls it like a local function.
// TODO: swap to /embeddings/overview when the API adds a lightweight endpoint.
// ---------------------------------------------------------------------------
export const getEmbeddings = query(async () => {
  return await fetchAllEmbeddings();
});

// ---------------------------------------------------------------------------
// Tier 2: Detail — fetched on demand when a user clicks a dot.
// Returns the full record for a single paper (abstract, co-authors, DOI, etc.).
// TODO: swap to /embeddings/:id when the API adds a per-record endpoint.
// ---------------------------------------------------------------------------
export const getEmbeddingDetail = query(v.string(), async (id) => {
  const all = await fetchAllEmbeddings();
  const paper = all.find((d: any) => d.id === id);
  if (!paper) error(404, 'Paper not found');
  return paper;
});
