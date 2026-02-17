<!--
@component
Diagram showing light and dark step theme options.

Shows:
- Light theme with active/inactive step states
- Dark theme with active/inactive step states

## Usage
```svelte
<StepThemesDiagram />
```
-->
<div class="layout-diagram">
  <div class="diagram-themes">
    <div class="diagram-theme diagram-theme-light">
      <div class="diagram-label">Light Theme</div>
      <div class="diagram-step-preview active">Active Step</div>
      <div class="diagram-step-preview inactive">Inactive Step</div>
    </div>
    <div class="diagram-theme diagram-theme-dark">
      <div class="diagram-label">Dark Theme</div>
      <div class="diagram-step-preview active">Active Step</div>
      <div class="diagram-step-preview inactive">Inactive Step</div>
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

  .diagram-themes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .diagram-theme {
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .diagram-theme-light {
    background: #f8f8f8;
  }

  .diagram-theme-dark {
    background: #1a1a1a;
  }

  .diagram-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--vcsi-gray-600);
    margin-bottom: 0.5rem;
  }

  .diagram-theme-dark .diagram-label {
    color: #999;
  }

  .diagram-step-preview {
    border-radius: 6px;
    padding: 0.75rem 1rem;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .diagram-theme-light .diagram-step-preview.active {
    background: #fff;
    color: #333;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .diagram-theme-light .diagram-step-preview.inactive {
    background: #f5f5f5;
    color: #ccc;
  }

  .diagram-theme-dark .diagram-step-preview.active {
    background: #2a2a2a;
    color: #e8e8e8;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .diagram-theme-dark .diagram-step-preview.inactive {
    background: #222;
    color: #666;
  }

  /* Dark mode - only affects the container */
  :global(.dark) .layout-diagram {
    background: var(--vcsi-gray-900);
  }
</style>
