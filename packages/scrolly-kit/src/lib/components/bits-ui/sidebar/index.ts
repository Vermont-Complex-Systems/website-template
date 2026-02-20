import Provider from './SidebarProvider.svelte';
import Root from './SidebarRoot.svelte';
import Content from './SidebarContent.svelte';
import Trigger from './SidebarTrigger.svelte';
import Header from './SidebarHeader.svelte';
import Footer from './SidebarFooter.svelte';
import Group from './SidebarGroup.svelte';
import Main from './SidebarMain.svelte';
import Inset from './SidebarInset.svelte';

export { Provider, Root, Content, Trigger, Header, Footer, Group, Main, Inset };

// Re-export state for advanced usage
export { SidebarState, getSidebarState } from './sidebar-state.svelte';
