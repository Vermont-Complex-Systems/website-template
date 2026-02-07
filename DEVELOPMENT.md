
## Non-standard features

### [Route group](https://svelte.dev/tutorial/kit/route-groups)

This template static website is meant to host interactive stories which the styling is maximally controlled by the author. That is, the global styling should leak as little as possible into a story.

To do so, we are using [Route group](https://svelte.dev/tutorial/kit/route-groups) where we distinguish the "common" layout (Home, About, etc)  from the `(app)` layout.