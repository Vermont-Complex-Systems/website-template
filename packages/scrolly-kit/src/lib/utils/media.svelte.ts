/**
 * Reactive media query utilities for Svelte 5.
 *
 * Usage:
 *   import { useIsMobile } from '@the-vcsi/scrolly-kit';
 *   const isMobile = useIsMobile();
 *   // In template: {#if isMobile.current} ...
 *
 * Custom query:
 *   import { useMediaQuery } from '@the-vcsi/scrolly-kit';
 *   const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
 *   // prefersReduced.current is a boolean
 */

/**
 * Subscribe to a CSS media query and return a reactive object.
 * The `.current` property updates whenever the query match changes.
 */
export function useMediaQuery(query: string): { readonly current: boolean } {
	let matches = $state(false);

	$effect(() => {
		const mql = window.matchMedia(query);
		matches = mql.matches;

		const handler = (e: MediaQueryListEvent) => {
			matches = e.matches;
		};
		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	});

	return {
		get current() {
			return matches;
		}
	};
}

/** Convenience wrapper: true when viewport is ≤ 768px. */
export function useIsMobile(): { readonly current: boolean } {
	return useMediaQuery('(max-width: 768px)');
}
