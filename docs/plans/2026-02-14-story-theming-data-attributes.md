# Story Theming Data Attributes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate story theming from `.story.dark` class to `data-theme="dark"` attribute pattern.

**Architecture:** Replace all `.story.dark` CSS selectors with `.story[data-theme="dark"]` attribute selectors in layouts.css, then update CLAUDE.md documentation to reflect the new pattern.

**Tech Stack:** CSS (attribute selectors)

---

### Task 1: Update Dark Story Theme Selectors in layouts.css

**Files:**
- Modify: `packages/scrolly-kit/src/lib/styles/layouts.css:88-119`

**Step 1: Update the comment block**

Change line 90-91 from:
```css
   DARK STORY THEME
   Add class="story dark" for stories with dark backgrounds.
```
To:
```css
   DARK STORY THEME
   Add data-theme="dark" for stories with dark backgrounds.
```

**Step 2: Update the main dark theme selector**

Change line 94 from:
```css
.story.dark {
```
To:
```css
.story[data-theme="dark"] {
```

**Step 3: Update the text color selectors**

Change lines 111-118 from:
```css
.story.dark,
.story.dark h1,
.story.dark h2,
.story.dark h3,
.story.dark p,
.story.dark a,
.story.dark section {
```
To:
```css
.story[data-theme="dark"],
.story[data-theme="dark"] h1,
.story[data-theme="dark"] h2,
.story[data-theme="dark"] h3,
.story[data-theme="dark"] p,
.story[data-theme="dark"] a,
.story[data-theme="dark"] section {
```

**Step 4: Verify the changes**

Run: `grep -n "story.dark\|data-theme" packages/scrolly-kit/src/lib/styles/layouts.css`
Expected: Only `data-theme` references, no `.story.dark`

**Step 5: Commit**

```bash
git add packages/scrolly-kit/src/lib/styles/layouts.css
git commit -m "refactor: use data-theme attribute for story dark mode

Replaces .story.dark class selector with .story[data-theme=\"dark\"]
attribute selector, following Pico CSS and Bits UI conventions."
```

---

### Task 2: Update CLAUDE.md Documentation

**Files:**
- Modify: `CLAUDE.md:270-282`

**Step 1: Update the Story Theming Pattern section**

Change lines 274-282 from:
```markdown
```svelte
<!-- Light story (default) -->
<article class="story">...</article>
<Footer theme="light" />

<!-- Dark story -->
<article class="story dark">...</article>
<Footer theme="dark" />
```
```

To:
```markdown
```svelte
<!-- Light story (default) -->
<article class="story">...</article>
<Footer theme="light" />

<!-- Dark story -->
<article class="story" data-theme="dark">...</article>
<Footer theme="dark" />
```
```

**Step 2: Update Key Principles section**

Change line 230 from:
```markdown
- Stories that want dark mode use `class="story dark"` which sets `color-scheme: dark`
```
To:
```markdown
- Stories that want dark mode use `data-theme="dark"` which sets `color-scheme: dark`
```

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for data-theme attribute pattern"
```

---

### Task 3: Build and Verify

**Step 1: Build the scrolly-kit package**

Run: `cd packages/scrolly-kit && npm run package`
Expected: Build completes without errors

**Step 2: Verify CSS output includes new selectors**

Run: `grep -n "data-theme" packages/scrolly-kit/dist/styles/layouts.css`
Expected: Shows `[data-theme="dark"]` selectors in output

**Step 3: Final commit (if any cleanup needed)**

If all looks good, no additional commit needed.
