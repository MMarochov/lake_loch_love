<!-- MapApp.svelte -->
<script lang="ts">
  // Imports
  import Map from "$lib/components/Map.svelte";
  import ZoomButton from "$lib/components/ZoomButton.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import type { Map as MapLibreMap, MapOptions } from "maplibre-gl";
  import { GeoJsonLayer } from "$lib/layers/geojsonlayer";
  import data from "$lib/data/merged_lakes.json";
  import OS_logo from "$lib/images/OS_logo_mono_dark_rgb.png";
  // import { config } from 'dotenv';
  // config();
  // let key = process.env.OS_API_KEY;
  // console.log(key)

  // Init
  let showModal = false;
  let key = "";
  let map: MapLibreMap;

  let lakes = [
    {
      name: "Bassenthwaite Lake",
      coordinates: [-3.214059, 54.649457],
      zoom: 11.3,
    },
    {
      name: "Ennerdale Water",
      coordinates: [-3.379274, 54.521432],
      zoom: 11.8,
    },
    { name: "Esthwaite Water", coordinates: [-2.984238, 54.358801], zoom: 12.5 },
    { name: "Grasmere", coordinates: [-3.021468, 54.449453], zoom: 13 },
    {
      name: "Haweswater Reservoir",
      coordinates: [-2.801575, 54.513816],
      zoom: 11.3,
    },
    { name: "Rydal Water", coordinates: [-2.995182, 54.446928], zoom: 12 },
    { name: "Ullswater", coordinates: [-2.886104, 54.572089], zoom: 10.5 },
    { name: "Wast Water", coordinates: [-3.296972, 54.439684], zoom: 11.7 },
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
    zoom: 11.6,
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
      zoom: zoom,
    });
  }
</script>

<main>
  <section class="header">
    <picture>
      <source srcset={OS_logo} type="image/png" />
      <img src={OS_logo} alt="OS Logo" />
    </picture>
	<button on:click={() => (showModal = true)}><span class="material-symbols-outlined">
		info
		</span></button>

<Modal bind:showModal>
	<h2 slot="header">
		modal
		<small><em>adjective</em> mod·al \ˈmō-dəl\</small>
	</h2>

	<ol class="definition-list">
		<li>of or relating to modality in logic</li>
		<li>
			containing provisions as to the mode of procedure or the manner of taking effect —used of a
			contract or legacy
		</li>
		<li>of or relating to a musical mode</li>
		<li>of or relating to structure as opposed to substance</li>
		<li>
			of, relating to, or constituting a grammatical form or category characteristically indicating
			predication
		</li>
		<li>of or relating to a statistical mode</li>
	</ol>

	<a href="https://www.merriam-webster.com/dictionary/modal">merriam-webster.com</a>
</Modal>
  </section>
  <h1>The Bathymetry of the Lake District National Park</h1>
  <p>Choose a lake to explore!</p>
  <section class="button-container">
    {#each lakes as lake}
      <ZoomButton
        {lake}
        on:zoomButtonClick={() =>
          handleZoomButtonClick({
            coordinates: lake.coordinates,
            zoom: lake.zoom,
          })}
      />
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

  h1 {
    font-size: 1.5rem;
	margin: 0;
  }

  p {
	margin: 6px;
  }

  .header {
	display: flex;
	justify-content: space-between;
  }

  img {
    width: 130px;
    margin: 10px;
  }

  .button-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  button {
	display: flex;
	border-radius: 50%;
	height: fit-content;
    border: none;
    padding: 3px;
	margin: 8px;
  }

  span {
	color: #333333;
  }
</style>
