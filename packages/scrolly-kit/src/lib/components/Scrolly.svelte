<!--
@component
Base scroll detection using IntersectionObserver.

Tracks which child element is most in view and updates the `value` binding.
Used internally by ScrollyContent, but can be used directly for custom layouts.

## Props
- `value` - Index of most visible child (bindable)
- `root` - IntersectionObserver root element (default: null = viewport)
- `top` - Top margin offset in pixels (default: 0)
- `bottom` - Bottom margin offset in pixels (default: 0)
- `increments` - Number of threshold steps (default: 100)

## Usage
Wrap step elements and bind to track active index:
`<Scrolly bind:value={index}>...steps...</Scrolly>`
-->
<script>
	let {
		root = null,
		top = 0,
		bottom = 0,
		increments = 100,
		value = $bindable(undefined),
		children
	} = $props();

	let steps = [];
	let threshold = [];
	let nodes = [];
	let intersectionObservers = [];
	let container = $state(undefined);

	function mostInView () {
		let maxRatio = 0;
		let maxIndex = 0;
		for (let i = 0; i < steps.length; i++) {
			if (steps[i] > maxRatio) {
				maxRatio = steps[i];
				maxIndex = i;
			}
		}

		if (maxRatio > 0) value = maxIndex;
		else value = undefined;
	};

	function createObserver(node, index) {
		const handleIntersect = (e) => {
			const intersecting = e[0].isIntersecting;
			const ratio = e[0].intersectionRatio;
			steps[index] = ratio;
			mostInView();
		};

		const marginTop = top ? top * -1 : 0;
		const marginBottom = bottom ? bottom * -1 : 0;
		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
		const options = { root, rootMargin, threshold };

		if (intersectionObservers[index]) intersectionObservers[index].disconnect();

		const io = new IntersectionObserver(handleIntersect, options);
		io.observe(node);
		intersectionObservers[index] = io;
	}

	function update() {
		if (!nodes.length) return;
		nodes.forEach(createObserver);
	}

	$effect(() => {
		if (!container) return;

		for (let i = 0; i < increments + 1; i++) {
			threshold.push(i / increments);
		}
		nodes = container.querySelectorAll(":scope > *:not(iframe)");
		update();
	});

	$effect(() => {
		top;
		bottom;
		update();
	});

</script>

<div bind:this={container}>
	{@render children?.()}
</div>
