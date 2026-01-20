<script lang="ts">
	import { base } from '$app/paths';
	import { Youtube, Github, Linkedin, MessageCircle, ExternalLink } from "@lucide/svelte";
</script>

<footer class="footer">
	<div class="footer-content">
		<div class="footer-logo">
			<div class="logo-row">
				<img src="{base}/UVM_Logo_Primary_Horiz_W_PunchOut.png" alt="Logo" class="logo-img" />
			</div>
			<ul class="social-icons">
				<li>
					<a href="https://www.youtube.com/@UVMcomplexity" target="_blank" rel="noreferrer" aria-label="YouTube">
						<Youtube class="icon" size={20} />
					</a>
				</li>
				<li>
					<a href="https://github.com/Vermont-complex-systems" target="_blank" rel="noreferrer" aria-label="GitHub">
						<Github class="icon" size={20} />
					</a>
				</li>
				<li>
					<a href="https://bsky.app/profile/vcsi.bsky.social" target="_blank" rel="noreferrer" aria-label="Bluesky">
						<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
						</svg>
					</a>
				</li>
				<li>
					<a href="https://linkedin.com/school/uvm-vcsc/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
						<Linkedin class="icon" size={20} />
					</a>
				</li>
			</ul>
		</div>

		<div class="footer-bottom">
			<a class="cc-footer-copy" href="https://www.uvm.edu/equal-opportunity/americans-disabilities-act-and-reasonable-accommodations" target="_blank" rel="noreferrer">
				<span class="link-text">Accessibility <ExternalLink class="icon" size={14} /></span>
			</a>
			<a class="cc-footer-copy" href="https://www.uvm.edu/compliance/website-privacy-policy/terms-use" target="_blank" rel="noreferrer">
				<span class="privacy-text">Privacy/Terms of Use <ExternalLink class="icon" size={14} /></span>
			</a>
			<div class="cc-footer-copy">© 2026, TODO</div>
		</div>
	</div>
</footer>

<style>
	.footer {
	margin-top: auto;
	background-color: var(--color-uvm-green);
	border-top: 1px solid var(--color-border);
	padding: 3rem 1rem 2rem;
	width: 100%;
	box-sizing: border-box;
}

:global(.dark) .footer {
	background-color: var(--color-gray-800);
	border-top-color: var(--color-gray-700);
}

.footer-content {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 2rem;
	padding: 0 var(--margin-left) 0 var(--margin-left);
	align-items: start;
}


.footer-logo {
	grid-column: 1;
}


.footer-bottom {
	grid-column: 1 / -1;
	display: flex;
	gap: 1.5rem;
	align-items: center;
	padding-top: 1.5rem;
	margin-top: 1rem;
	border-top: 1px solid rgba(255, 255, 255, 0.2);
}

:global(.dark) .footer-bottom {
	border-top-color: var(--color-gray-700);
}

.footer-bottom .cc-footer-copy:last-child {
	margin-left: auto;
}

.social-icons {
	display: flex;
	gap: 1rem;
	list-style: none;
	padding: 0;
	margin: 0;
}

.social-icons a {
	text-decoration: none;
}

.footer-logo {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	max-width: 12rem;
	min-width: 0;
	gap: 0.5rem;
	flex-shrink: 1;
	overflow: hidden;
}

.footer-logo a {
	color: var(--color-uvm-gold);
}

.logo-img {
	height: auto;
	max-height: 3rem;
	border-radius: var(--border-radius);
	transition: transform var(--transition-medium);
}

.cc-footer-copy {
	color: var(--color-white);
	font-weight: 500;
	font-size: 1rem;
	transition: color var(--transition-medium);
	text-align: left;
	display: block;
	max-width: 100%;
}

.link-text {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	flex-wrap: nowrap;
}

.link-text :global(.icon),
.privacy-text :global(.icon) {
	width: 14px !important;
	height: 14px !important;
	flex-shrink: 0;
	transform: translateY(-0.1rem);
}

.privacy-text {
	display: inline-flex;
	align-items: flex-end;
	gap: 0.25rem;
	flex-wrap: nowrap;
	line-height: 1.2;
}

:global(.dark) .cc-footer-copy {
	color: var(--color-gray-300);
}

.cc-footer-copy:hover {
	color: var(--color-gray-300);
}

:global(.dark) .cc-footer-copy:hover {
	color: var(--color-gray-100);
}

.cc-footer-copy:not(a) {
	color: var(--color-white);
	text-decoration: none;
	justify-content: flex-start;
}

:global(.dark) .cc-footer-copy:not(a) {
	color: var(--color-gray-300);
}

/* ---------- Mobile adjustments ---------- */
@media (max-width: 768px) {
	.footer {
		padding: 2rem 1rem 1.5rem;
	}

	.footer-content {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: auto auto auto auto;
		gap: 1.5rem 1rem;
		padding: 0 var(--margin-left-mobile);
	}

	/* Logo + social icons in first row, spanning both columns */
	.footer-logo {
		grid-column: 1 / 3;
		grid-row: 1;
		max-width: 100%;
		min-width: 0;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.logo-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		width: 100%;
	}

	.footer-logo .logo-img,
	
	.footer-logo .social-icons {
		padding: 0;
		margin: 0;
	}

	
	/* Footer bottom spanning both columns at the end */
	.footer-bottom {
		grid-column: 1 / 3;
		grid-row: 4;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
	}

	.footer-bottom .cc-footer-copy {
		flex: 0 1 auto;
	}

	.footer-bottom .cc-footer-copy:last-child {
		width: 100%;
	}


	.cc-footer-copy {
		font-size: 0.85rem;
	}
}

</style>