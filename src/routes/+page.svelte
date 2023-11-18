<!-- MapApp.svelte -->
<script lang="ts">
  // Imports
  import Map from "$lib/components/Map.svelte";
  import ZoomButton from "$lib/components/ZoomButton.svelte";
  import type { Map as MapLibreMap, MapOptions } from "maplibre-gl";
  import { GeoJsonLayer } from "$lib/layers/geojsonlayer";
  import data from "$lib/data/merged_lakes.json";
  // import { config } from 'dotenv';
  // config();
  // let key = process.env.OS_API_KEY;
  // console.log(key)

  // Init
  let key = "";
  let map: MapLibreMap;

  let lakes = [
    { name: "Bassenthwaite Lake", coordinates: [-3.217598, 54.654174], zoom: 12 },
    { name: "Ennerdale Water", coordinates: [-3.379274, 54.521432], zoom: 12 },
    { name: "Esthwaite Water", coordinates: [-2.984238, 54.358801], zoom: 12 },
    { name: "Grasmere", coordinates: [-3.021468, 54.449453], zoom: 12 },
    { name: "Haweswater Reservoir", coordinates: [-2.805862, 54.517521], zoom: 12 },
    { name: "Rydal Water", coordinates: [-2.995182, 54.446928], zoom: 12 },
    { name: "Ullswater", coordinates: [-2.884731, 54.576467], zoom: 12 },
    { name: "Wast Water", coordinates: [-3.294099, 54.442123], zoom: 12 },
  ];

  let layer = new GeoJsonLayer("test", "Blue Shape", data, "fill-extrusion", {
    // See the MapLibre Style Specification for details on data expressions.
    // https://maplibre.org/maplibre-style-spec/expressions/

    // Get the fill-extrusion-color from the source 'color' property.
    "fill-extrusion-color": [
      "interpolate",
      ["linear"],
      ["get", "depth"],
      0,
      "#C2C2FF",
      10,
      "#9999FF",
      20,
      "#7070ff",
      30,
      "#4747ff",
      40,
      "#1f1fff",
      50,
      "#0000f5",
      60,
      "#00007a",
      70,
      "#00003d",
    ],

    // Get fill-extrusion-height from the source 'height' property.
    "fill-extrusion-height": ["get", "depth"],

    // Get fill-extrusion-base from the source 'base_height' property.
    "fill-extrusion-base": 80,

    // Make extrusions slightly opaque for see through indoor walls.
    "fill-extrusion-opacity": 1,
  });

  const options: MapOptions = {
    container: "",
    minZoom: 6,
    maxZoom: 18,
    pitch: 50,
    dragRotate: true,
    style:
      "https://raw.githubusercontent.com/OrdnanceSurvey/OS-Vector-Tile-API-Stylesheets/master/OS_VTS_3857_Open_Greyscale.json",
    center: [-2.803704, 54.51065],
    zoom: 13,
    transformRequest: (url) => {
      if (!/[?&]key=/.test(url)) url += `?key=${key}`;
      return {
        url: url + "&srs=3857",
      };
    },
  };

  $: if (map) {
    map.on("load", () => {
      layer.setMap(map).render();
      // map.flyTo({
      // center: [-2.875814, 54.578490],
      // pitch:30,
      // zoom:12 });
    });
  }

  function handleZoomButtonClick(event) {
  let coordinates = event.coordinates;
  let zoom = event.zoom;

  // Perform the map zoom using the coordinates
  map.flyTo({
    center: coordinates,
    pitch: 30,
    zoom: zoom
  });
}
</script>

<main>
	<h1>The Bathymetry of the Lake District National Park</h1>
	<p>Choose a lake to explore!</p>
	<section class="button-container">
	{#each lakes as lake}
	<ZoomButton {lake} on:zoomButtonClick={() => handleZoomButtonClick({ coordinates: lake.coordinates, zoom: lake.zoom })} />
		{/each}
	</section>

  <Map {options} bind:map />
</main>

<style>
  main {
	font-family: "JetBrains Mono", monospace;
    position: relative;
    height: 100%;
    width: 100%;
    border-radius: 20px;
	text-align: center;
  }

  .button-container {
	display: flex;
	flex-wrap: wrap;
    justify-content: center;
  }
</style>
