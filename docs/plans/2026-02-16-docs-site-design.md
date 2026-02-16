# Docs Site Design

**Date:** 2026-02-16
**Status:** Approved

## Goal

Create a documentation site showcasing scrolly-kit layouts and CSS variables. Hosted on GitHub Pages, lives in the monorepo at `sites/docs/`.

## Audience

Users/developers who want to understand and customize the library.

## Pages

| Route | Purpose | Layout |
|-------|---------|--------|
| `/` | Getting Started - scaffold, install, customize | `.page` |
| `/reference` | Layout diagrams + CSS variables reference | `.page` |
| `/examples` | Gallery with screenshots linking to GitHub source | `.page` |

## Structure

```
sites/docs/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte      # Root layout with simple nav
│   │   ├── +page.svelte        # Getting Started (home)
│   │   ├── reference/
│   │   │   └── +page.svelte    # Layouts + CSS variables
│   │   └── examples/
│   │       └── +page.svelte    # Gallery of template stories
│   ├── lib/
│   │   └── components/         # Docs-specific components
│   └── styles/
│       └── app.css             # Docs styling using scrolly-kit tokens
├── static/
│   └── images/                 # Layout diagrams, screenshots
├── svelte.config.js            # Static adapter, GH Pages base path
├── vite.config.js
├── package.json                # workspace:* dep on scrolly-kit
└── tsconfig.json
```

## Reference Page Content

1. **Intro** - What layouts are for, when to use each
2. **Split Layout**
   - Annotated diagram (SVG or CSS mockup)
   - HTML structure snippet
   - CSS variables table (panel width, height, gap, etc.)
3. **Fullscreen Layout**
   - Same pattern
4. **Dashboard Layout**
   - Same pattern
5. **Global CSS Variables**
   - Tokens table (colors, spacing, typography, transitions)

## Styling Approach

- Imports `@the-vcsi/scrolly-kit/styles/all.css`
- Uses design tokens for consistent branding
- Static diagrams, no scrollytelling behavior on docs site
- Uses `.page` layout throughout

## Monorepo Changes

1. Add `"sites/*"` to root `package.json` workspaces array
2. Create `.github/workflows/docs.yml` for GitHub Pages deployment

## GitHub Actions Workflow

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths:
      - 'sites/docs/**'
      - 'packages/scrolly-kit/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build --workspace=sites/docs
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: sites/docs/build
      - uses: actions/deploy-pages@v4
```

## Base Path

For `github.io/vcsi-starter/`:

```js
// sites/docs/svelte.config.js
kit: {
  paths: {
    base: process.env.NODE_ENV === 'production' ? '/vcsi-starter' : ''
  }
}
```

## Examples Page

Links to GitHub source code for each template story:
- scrolly-story-1
- scrolly-story-2
- geo-story-1
- scrolly-explainer
- dashboard-1
- thematic-story-1

Each card shows: screenshot, title, brief description, link to source.

## Out of Scope

- Live interactive demos (static screenshots only)
- Triple layout documentation (not commonly used)
- Component API docs (focus is on layouts/CSS)
