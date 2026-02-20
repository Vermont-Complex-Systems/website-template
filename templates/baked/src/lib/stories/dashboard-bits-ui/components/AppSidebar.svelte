<script>
    import { Sidebar, SimpleSelect } from '@the-vcsi/scrolly-kit';
    import Legend from './Legend.svelte';

    let {
        searchQuery = $bindable(''),
        selectedYear = $bindable('2026'),
        selectedColleges = $bindable(new Set()),
        colleges,
        colorScale,
    } = $props();

    const yearItems = [{ value: '2026', label: 'Spring 2026' }];
</script>

<Sidebar.Content>
    <Sidebar.Header>
        <h2 class="sidebar-title">UVM Course Explorer</h2>
    </Sidebar.Header>

    <Sidebar.Group label="Search">
        <input
            id="search-input"
            type="text"
            placeholder="Title or description..."
            bind:value={searchQuery}
            class="search-input"
        />
    </Sidebar.Group>

    <Sidebar.Group label="Year">
        <SimpleSelect items={yearItems} bind:value={selectedYear} placeholder="Select year" />
    </Sidebar.Group>

    <Sidebar.Group label="Colleges">
        <Legend {colleges} {colorScale} bind:selectedColleges />
    </Sidebar.Group>

    <Sidebar.Footer>
        <a class="footer-link" href="https://github.com/jstonge/uvm-course-viewer/" target="_blank" rel="noopener">
            <svg class="footer-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            Data pipeline
        </a>
    </Sidebar.Footer>
</Sidebar.Content>

<Sidebar.Trigger />

<style>
    .sidebar-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
    }

    .search-input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .search-input:focus {
        outline: none;
        border-color: var(--color-uvm-green, #007155);
        box-shadow: 0 0 0 2px rgba(0, 113, 85, 0.1);
    }

    .footer-link {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-family: var(--vcsi-font-sans, system-ui, sans-serif);
        font-size: var(--vcsi-font-size-xs, 12px);
        color: var(--vcsi-gray-500, rgb(128, 128, 128));
        text-decoration: none;
    }

    .footer-link:hover {
        color: var(--vcsi-gray-900, rgb(38, 38, 38));
    }

    .footer-icon {
        flex-shrink: 0;
    }
</style>
