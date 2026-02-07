
## Non-standard features

### [Route group](https://svelte.dev/tutorial/kit/route-groups)

This template static website is meant to host interactive stories which the styling is maximally controlled by the author. That is, the global styling should leak as little as possible into a story.

To do so, we are using [Route group](https://svelte.dev/tutorial/kit/route-groups) where we distinguish the "common" layout (Home, About, etc)  from the `(app)` layout. Hence, the users is in charge of all the styling of its story, to the exception of the Footer. We provide the Footer as default and users need to overwrite globally if they want to modify it, but it is crucial to scope it 

```js
// src/lib/stories/thematic-story-1.svelte
:global(body:has(.landing-page)) :global(.footer) {
    background-color: var(--story-bg);
    border-top-color: var(--story-border);
}
```

