<script>
	import './styles.css';
</script>

<div class="app">
	<main>
		<slot />
	</main>
	<footer>Mel Marochov, Data Scientist @ Ordnance Survey | Thanks to Jess Baker and Paul Naylor from GeoDataViz for the data | Inspiration: https://willymaps.github.io/depth/ | Contains OS data © Crown copyright and database rights 2023</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		
		width: 100%;
		height: 100%;
		max-width: 64rem;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
		text-align: center;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
