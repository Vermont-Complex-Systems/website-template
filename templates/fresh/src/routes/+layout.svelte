<script>
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { ModeWatcher } from 'mode-watcher';
	import '$lib/styles/app.css';

	const queryClient = new QueryClient();

	let { children } = $props();
</script>

<ModeWatcher defaultMode="system" />

<QueryClientProvider client={queryClient}>
	{@render children?.()}
</QueryClientProvider>
