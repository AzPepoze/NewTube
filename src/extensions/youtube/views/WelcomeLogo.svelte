<div class="logo-halo">
	<img src="https://imgs-newtube.azpepoze.com/logo.png" alt="NewTube" />
</div>

<style lang="scss">
	.logo-halo {
		width: clamp(240px, 32vw, 380px);
		aspect-ratio: 1;
		display: grid;
		place-items: center;
		position: relative;
		isolation: isolate;
		animation: logoFloat 4s ease-in-out infinite;
	}

	/* White glow behind the logo. */
	.logo-halo::before {
		content: "";
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.35), transparent 68%);
		pointer-events: none;
	}

	img {
		position: relative;
		width: 95%;
		height: 95%;
		object-fit: contain;
		filter: drop-shadow(0 12px 24px rgba(255, 255, 255, 0.35));
	}

	@keyframes logoFloat {
		0%,
		100% {
			transform: translateY(0) rotate(-2deg);
		}
		50% {
			transform: translateY(-14px) rotate(2deg);
		}
	}

	@media (max-width: 760px) {
		.logo-halo {
			width: min(240px, 64vw);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.logo-halo {
			animation: none;
		}
	}
</style>
