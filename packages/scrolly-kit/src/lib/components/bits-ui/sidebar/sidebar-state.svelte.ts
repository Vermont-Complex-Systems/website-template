import { setContext, getContext } from 'svelte';
import { useIsMobile } from '../../../utils/media.svelte';

const SIDEBAR_CTX_KEY = Symbol('sidebar');

export class SidebarState {
	collapsed = $state(false);
	drawerOpen = $state(false);

	readonly sidebarWidth: string;
	readonly collapsedWidth: string;

	#mobile: { readonly current: boolean };

	get isMobile(): boolean {
		return this.#mobile.current;
	}

	constructor(opts?: {
		collapsed?: boolean;
		sidebarWidth?: string;
		collapsedWidth?: string;
	}) {
		if (opts?.collapsed !== undefined) this.collapsed = opts.collapsed;
		this.sidebarWidth = opts?.sidebarWidth ?? '280px';
		this.collapsedWidth = opts?.collapsedWidth ?? '48px';
		this.#mobile = useIsMobile();

		$effect(() => {
			if (!this.isMobile) this.drawerOpen = false;
		});
	}

	toggle() {
		if (this.isMobile) {
			this.drawerOpen = !this.drawerOpen;
		} else {
			this.collapsed = !this.collapsed;
		}
	}

	expand() {
		this.collapsed = false;
	}
	collapse() {
		this.collapsed = true;
	}
	openDrawer() {
		this.drawerOpen = true;
	}
	closeDrawer() {
		this.drawerOpen = false;
	}
}

export function setSidebarState(state: SidebarState): void {
	setContext(SIDEBAR_CTX_KEY, state);
}

export function getSidebarState(): SidebarState {
	return getContext<SidebarState>(SIDEBAR_CTX_KEY);
}
