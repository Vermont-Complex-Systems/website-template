# Story Theming via Data Attributes

## Summary

Migrate story theming from CSS classes (`.story.dark`) to data attributes (`data-theme="dark"`), following patterns established by Pico CSS and Bits UI.

## Motivation

Data attributes provide:
- Explicit semantic intent (`data-theme="dark"` vs ambiguous `.dark` class)
- Cleaner JavaScript integration (`element.dataset.theme`)
- Better separation of concerns (class = what it is, data-attr = state/appearance)

## Scope

**In scope:** Story-level theming in `layouts.css`

**Out of scope:**
- Global dark mode (`:root.dark` via mode-watcher) - different concern
- Footer theme prop - separate component system
- Component states (sidebar open/collapsed) - future consideration

## Design

### CSS Changes

**Before:**
```css
.story.dark {
  color-scheme: dark;
  --scrolly-story-bg: #353839;
  ...
}

.story.dark h1,
.story.dark h2,
... {
  color: var(--scrolly-story-fg);
}
```

**After:**
```css
.story[data-theme="dark"] {
  color-scheme: dark;
  --scrolly-story-bg: #353839;
  ...
}

.story[data-theme="dark"] h1,
.story[data-theme="dark"] h2,
... {
  color: var(--scrolly-story-fg);
}
```

### Usage

```svelte
<!-- Light story (default) -->
<article class="story">

<!-- Dark story -->
<article class="story" data-theme="dark">
```

## Files to Change

1. `packages/scrolly-kit/src/lib/styles/layouts.css` - Update selectors
2. `CLAUDE.md` - Update documentation

## Notes

- No existing stories use `.story.dark`, so no template migration needed
- Light theme remains the default (no `data-theme` attribute required)
- Pattern can extend to other theming needs in the future
