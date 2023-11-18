<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import maplibregl, { type MapOptions, Map } from 'maplibre-gl';

	// Props
	export let map: Map;
	export let options: MapOptions;

	options = { ...options, container: 'map' };

	onMount(() => {
		// Initialize the map object.
		map = new maplibregl.Map(options);

		map.on('load', function () {
			map.addSource('selected', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
				}
			});
		});
	});

	onDestroy(() => {
		if (map) map.remove();
	});
</script>

<svelte:head>
	<link href="https://unpkg.com/maplibre-gl@3.0.1/dist/maplibre-gl.css" rel="stylesheet" />
</svelte:head>

<div id="map-container">
<div id="map">
	{#if map}
		<slot />
	{/if}
</div>
</div>

<style>

	#map-container {
		position: relative;
    width: 100%;
    padding-bottom: 100%; /* Maintain 1:1 aspect ratio */
	margin:10px;
}
	#map {
		position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 20px); /* Subtract twice the margin value from the width */
    height: calc(100% - 20px); /* Subtract twice the margin value from the height */
    border-radius: 50%;
    overflow: hidden; /* Ensure map content stays within the circular shape */
	}

	@media (min-width: 768px) {
    /* Update styles for screens larger than 768px width */
    #map-container {
      margin: 20px;
    }

    #map {
      width: calc(100% - 40px); /* Subtract twice the new margin value from the width */
      height: calc(100% - 40px); /* Subtract twice the new margin value from the height */
    }
  }
</style>
