<script>
	import './styles.css';
</script>

<div class="app">
	<main>
		<slot />
	</main>
	<footer>Designed and built by Mel Marochov, Data Scientist @ Ordnance Survey | Contains OS data © Crown copyright and database rights 2023</footer>
</div>

<style>
	.app {
		margin: 0;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		align-items: center;
		font-family: "JetBrains Mono", monospace;
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
			font-size: 1rem;
		}
	}
</style>
