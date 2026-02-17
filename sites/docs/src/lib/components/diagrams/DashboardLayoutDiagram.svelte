<!--
@component
Diagram showing the dashboard layout with sidebar and main content.

Shows:
- Sidebar for controls
- Main content area for visualization

## Usage
```svelte
<DashboardLayoutDiagram />
```
-->
<div class="layout-diagram">
  <div class="diagram-dashboard">
    <div class="diagram-sidebar">
      <div class="diagram-label">sidebar</div>
      <div class="diagram-controls">Controls</div>
    </div>
    <div class="diagram-main">
      <div class="diagram-label">main</div>
      <div class="diagram-viz">Chart / Visualization</div>
    </div>
  </div>
</div>

<style>
  .layout-diagram {
    border: 1px solid var(--vcsi-border);
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    background: var(--vcsi-gray-50);
  }

  .diagram-dashboard {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 0.5rem;
    height: 200px;
  }

  .diagram-sidebar,
  .diagram-main {
    border: 2px dashed var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  .diagram-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--vcsi-gray-600);
    margin-bottom: 0.5rem;
  }

  .diagram-controls,
  .diagram-viz {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vcsi-gray-200);
    border-radius: 4px;
    font-size: 0.8rem;
    color: var(--vcsi-gray-600);
  }

  /* Dark mode */
  :global(.dark) .layout-diagram {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-controls,
  :global(.dark) .diagram-viz {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .diagram-label {
    color: var(--vcsi-gray-400);
  }
</style>
