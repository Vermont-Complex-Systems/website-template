<!--
@component
Diagram showing the split layout with sticky panel and scrolly content.

Shows:
- Grid structure with scrolly-content and sticky-panel columns
- Column sizing (1fr and minmax)
- Gap between columns
- Spacers at top/bottom
- Steps within the content column

## Usage
```svelte
<SplitLayoutDiagram />
```
-->
<div class="layout-diagram">
  <div class="diagram-story">
    <div class="diagram-label">.story</div>
    <div class="diagram-padding-top">
      <span>padding-top: 5.5rem</span>
    </div>
    <div class="diagram-prose">
      <div class="diagram-label">Centered prose (600px)</div>
      <p>Title & intro text...</p>
    </div>
    <div class="diagram-split-wrapper">
      <div class="diagram-padding-side left"></div>
      <div class="diagram-split">
        <div class="diagram-column-labels">
          <span class="diagram-col-label">1fr (remaining)</span>
          <span class="diagram-col-label">minmax(450px, 45%)</span>
        </div>
        <div class="diagram-split-grid">
          <div class="diagram-content">
            <div class="diagram-label">scrolly-content</div>
            <div class="diagram-spacer">spacer</div>
            <div class="diagram-steps">
              <div class="diagram-step">Step 1</div>
              <div class="diagram-step">Step 2</div>
              <div class="diagram-step">Step 3</div>
            </div>
            <div class="diagram-spacer">spacer</div>
          </div>
          <div class="diagram-gap-indicator">
            <span>2rem gap</span>
          </div>
          <div class="diagram-panel">
            <div class="diagram-label">sticky-panel</div>
            <div class="diagram-viz">Visualization</div>
          </div>
        </div>
      </div>
      <div class="diagram-padding-side right"></div>
    </div>
    <div class="diagram-prose">
      <p>More prose content...</p>
    </div>
    <div class="diagram-padding-bottom">
      <span>padding-bottom: 7.5rem</span>
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

  .diagram-story {
    border: 2px dashed var(--vcsi-border);
    border-radius: 4px;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: var(--vcsi-gray-50);
  }

  .diagram-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--vcsi-gray-600);
    margin-bottom: 0.5rem;
  }

  .diagram-prose {
    background: white;
    border: 1px solid var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem 1rem;
    max-width: 200px;
    margin: 0 auto;
    text-align: center;
    font-size: 0.8rem;
    color: var(--vcsi-gray-600);
  }

  .diagram-prose p {
    margin: 0;
  }

  .diagram-split-wrapper {
    display: flex;
    align-items: stretch;
    border: 1px dashed var(--vcsi-border);
    border-radius: 4px;
    overflow: hidden;
  }

  .diagram-split {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
  }

  .diagram-column-labels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 0.25rem;
  }

  .diagram-col-label {
    font-size: 0.65rem;
    font-family: var(--vcsi-font-mono);
    color: var(--vcsi-gray-500);
    text-align: center;
    padding: 0.125rem 0.25rem;
    background: var(--vcsi-gray-100);
    border-radius: 3px;
  }

  .diagram-split-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0;
    min-height: 180px;
    flex: 1;
  }

  .diagram-gap-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    position: relative;
  }

  .diagram-gap-indicator span {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 0.6rem;
    color: var(--vcsi-gray-500);
    white-space: nowrap;
  }

  .diagram-gap-indicator::before,
  .diagram-gap-indicator::after {
    content: '';
    position: absolute;
    left: 50%;
    width: 1px;
    height: 30%;
    background: var(--vcsi-gray-300);
    border-style: dashed;
  }

  .diagram-gap-indicator::before {
    top: 0;
  }

  .diagram-gap-indicator::after {
    bottom: 0;
  }

  .diagram-content,
  .diagram-panel {
    border: 2px dashed var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  .diagram-steps {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  .diagram-step {
    background: white;
    border: 1px solid var(--vcsi-border);
    border-radius: 4px;
    padding: 0.5rem;
    text-align: center;
    font-size: 0.8rem;
  }

  .diagram-spacer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    font-size: 0.65rem;
    color: var(--vcsi-gray-400);
    border: 1px dashed var(--vcsi-gray-300);
    border-radius: 3px;
    background: var(--vcsi-gray-100);
  }

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

  .diagram-padding-side {
    width: 24px;
    min-height: 50px;
    background: repeating-linear-gradient(
      45deg,
      var(--vcsi-gray-100),
      var(--vcsi-gray-100) 4px,
      var(--vcsi-gray-200) 4px,
      var(--vcsi-gray-200) 8px
    );
    border: 1px dashed var(--vcsi-gray-300);
    position: relative;
  }

  .diagram-padding-side::after {
    content: '2rem';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-90deg);
    font-size: 0.6rem;
    color: var(--vcsi-gray-500);
    white-space: nowrap;
  }

  .diagram-padding-top,
  .diagram-padding-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    font-size: 0.7rem;
    color: var(--vcsi-gray-500);
    border: 1px dashed var(--vcsi-gray-300);
    border-radius: 4px;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 4px,
      var(--vcsi-gray-100) 4px,
      var(--vcsi-gray-100) 8px
    );
  }

  /* Dark mode */
  :global(.dark) .layout-diagram {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-story {
    background: var(--vcsi-gray-900);
  }

  :global(.dark) .diagram-prose {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-300);
  }

  :global(.dark) .diagram-split-wrapper {
    border-color: var(--vcsi-gray-700);
  }

  :global(.dark) .diagram-col-label {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .diagram-gap-indicator span {
    color: var(--vcsi-gray-500);
  }

  :global(.dark) .diagram-gap-indicator::before,
  :global(.dark) .diagram-gap-indicator::after {
    background: var(--vcsi-gray-600);
  }

  :global(.dark) .diagram-step {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-fg);
  }

  :global(.dark) .diagram-viz {
    background: var(--vcsi-gray-800);
    color: var(--vcsi-gray-400);
  }

  :global(.dark) .diagram-spacer {
    color: var(--vcsi-gray-500);
    border-color: var(--vcsi-gray-700);
    background: var(--vcsi-gray-800);
  }

  :global(.dark) .diagram-padding-side {
    background: repeating-linear-gradient(
      45deg,
      var(--vcsi-gray-900),
      var(--vcsi-gray-900) 4px,
      var(--vcsi-gray-800) 4px,
      var(--vcsi-gray-800) 8px
    );
    border-color: var(--vcsi-gray-700);
  }

  :global(.dark) .diagram-padding-side::after {
    color: var(--vcsi-gray-500);
  }

  :global(.dark) .diagram-padding-top,
  :global(.dark) .diagram-padding-bottom {
    color: var(--vcsi-gray-500);
    border-color: var(--vcsi-gray-700);
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 4px,
      var(--vcsi-gray-800) 4px,
      var(--vcsi-gray-800) 8px
    );
  }

  :global(.dark) .diagram-label {
    color: var(--vcsi-gray-400);
  }
</style>
