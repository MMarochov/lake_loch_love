<!-- MapApp.svelte -->
<script lang="ts">
  // Imports
  import Map from "$lib/components/Map.svelte";
  import ZoomButton from "$lib/components/ZoomButton.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import type { Map as MapLibreMap, MapOptions } from "maplibre-gl";
  import maplibregl from "maplibre-gl";
  import { GeoJsonLayer } from "$lib/layers/geojsonlayer";
  import lakes_data from "$lib/data/merged_lakes.json";
  import OS_logo from "$lib/images/OS_logo_mono_dark_rgb.png";

  // Init
  export let data;
  let key = data.OS_API_KEY;
  let showModal = false;
  let map: MapLibreMap;

  let lakes = [
    { name: "Wastwater", coordinates: [-3.296972, 54.439684], zoom: 11.7 },
    {
      name: "Bassenthwaite Lake",
      coordinates: [-3.214059, 54.649457],
      zoom: 11.3,
    },
    { name: "Ullswater", coordinates: [-2.886104, 54.572089], zoom: 10.5 },
    {
      name: "Ennerdale Water",
      coordinates: [-3.379274, 54.521432],
      zoom: 11.8,
    },
    {
      name: "Haweswater Reservoir",
      coordinates: [-2.801575, 54.513816],
      zoom: 11.3,
    },
    { name: "Grasmere", coordinates: [-3.021468, 54.449453], zoom: 13 },
    {
      name: "Esthwaite Water",
      coordinates: [-2.984238, 54.358801],
      zoom: 12.5,
    },
    { name: "Rydal Water", coordinates: [-2.995182, 54.446928], zoom: 12 },
  ];
  // '/src/lib/images/wastwater.png'
  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          message: "Wastwater",
          iconSize: [250, 250],
          imageUrl:
            "https://github.com/MMarochov/lake_loch_love/blob/main/src/lib/images/wastwater.png?raw=true",
        },
        geometry: {
          type: "Point",
          coordinates: [-3.296972, 54.439684],
        },
      },
      {
        type: "Feature",
        properties: {
          message: "Haweswater",
          iconSize: [320, 320],
          imageUrl:
            "https://github.com/MMarochov/lake_loch_love/blob/main/src/lib/images/haweswater.png?raw=true",
        },
        geometry: {
          type: "Point",
          coordinates: [-2.811175, 54.508294],
        },
      },
      {
        type: "Feature",
        properties: {
          message: "Ullswater",
          iconSize: [320, 320],
          imageUrl:
            "https://github.com/MMarochov/lake_loch_love/blob/main/src/lib/images/ullswater.png?raw=true",
        },
        geometry: {
          type: "Point",
          coordinates: [-2.922229, 54.555297],
        },
      },
      {
        type: "Feature",
        properties: {
          message: "Grasmere",
          iconSize: [320, 320],
          imageUrl:
            "https://github.com/MMarochov/lake_loch_love/blob/main/src/lib/images/grasmere.png?raw=true",
        },
        geometry: {
          type: "Point",
          coordinates: [-3.024891, 54.451703],
        },
      },
      {
        type: "Feature",
        properties: {
          message: "Rydal",
          iconSize: [320, 320],
          imageUrl:
            "https://github.com/MMarochov/lake_loch_love/blob/main/src/lib/images/rydal.png?raw=true",
        },
        geometry: {
          type: "Point",
          coordinates: [-2.989745, 54.435421],
        },
      },
      {
        type: "Feature",
        properties: {
          message: "Ennerdale",
          iconSize: [320, 320],
          imageUrl:
            "https://github.com/MMarochov/lake_loch_love/blob/main/src/lib/images/ennerdale.png?raw=true",
        },
        geometry: {
          type: "Point",
          coordinates: [-3.388712, 54.511618],
        },
      },
      {
        type: "Feature",
        properties: {
          message: "Bassenthwaite",
          iconSize: [390, 390],
          imageUrl:
            "https://github.com/MMarochov/lake_loch_love/blob/main/src/lib/images/bassenthwaite.png?raw=true",
        },
        geometry: {
          type: "Point",
          coordinates: [-3.22194, 54.644154],
        },
      },
      {
        type: "Feature",
        properties: {
          message: "Esthwaite",
          iconSize: [380, 380],
          imageUrl:
            "https://github.com/MMarochov/lake_loch_love/blob/main/src/lib/images/esthwaite.png?raw=true",
        },
        geometry: {
          type: "Point",
          coordinates: [-2.99225, 54.354536],
        },
      },
      {
        type: "Feature",
        properties: {
          message: "Baz",
          iconSize: [40, 40],
          imageUrl:
            "https://3dprintingindustry.com/wp-content/uploads/2017/09/time-100-influential-photos-loch-ness-monster-21.jpg",
        },
        geometry: {
          type: "Point",
          coordinates: [-63.29223632812499, -18.28151823530889],
        },
      },
    ],
  };

  let layer = new GeoJsonLayer(
    "test",
    "Blue Shape",
    lakes_data,
    "fill-extrusion",
    {
      // See the MapLibre Style Specification for details on data expressions.
      // https://maplibre.org/maplibre-style-spec/expressions/

      // Get the fill-extrusion-color from the source 'color' property.
      "fill-extrusion-color": [
        "interpolate",
        ["linear"],
        ["get", "depth"],
        0,
        "#def5e5",
        10,
        "#99ddb6",
        20,
        "#4bc2ad",
        30,
        "#359fab",
        40,
        "#357ba3",
        50,
        "#3b5698",
        60,
        "#3e356b",
        70,
        "#2b1c35",
      ],

      // Get fill-extrusion-height from the source 'height' property.
      "fill-extrusion-height": ["get", "depth"],

      // Get fill-extrusion-base from the source 'base_height' property.
      "fill-extrusion-base": 80,

      // Make extrusions slightly opaque for see through indoor walls.
      "fill-extrusion-opacity": 1,
    }
  );

  const options: MapOptions = {
    container: "",
    minZoom: 6,
    maxZoom: 13,
    pitch: 35,
    dragRotate: true,
    style:
      "https://raw.githubusercontent.com/OrdnanceSurvey/OS-Vector-Tile-API-Stylesheets/master/OS_VTS_3857_Open_Greyscale.json",
    center: [-3.296972, 54.43968],
    zoom: 11.5,
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
    });

    // add markers to map
    geojson.features.forEach((marker) => {
      // create a DOM element for the marker
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = `url(${marker.properties.imageUrl})`;
      el.style.width = `${marker.properties.iconSize[0]}px`;
      el.style.height = `${marker.properties.iconSize[1]}px`;

      // add marker to map
      new maplibregl.Marker({ element: el })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

      let zoomThreshold = 10.4;

      // update marker visibility on map zoom
      map.on("zoom", () => {
        const zoom = map.getZoom();

        if (zoom < zoomThreshold) {
          // Hide the marker if the zoom level is below the threshold
          el.style.display = "none";
        } else {
          // Show the marker if the zoom level is at or above the threshold
          el.style.display = "block";
        }
      });
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
      speed: 0.8,
      bearing: 0,
    });
  }
</script>
<svelte:head>
	<title>Lake, Loch, Love</title>
	<meta name="description" content="The Bathymetry of the Lake District National Park" />
</svelte:head>

<main>
  <section class="header">
    <div class="banner">
      <a href="https://www.ordnancesurvey.co.uk/" target="_blank"
        ><picture>
          <source srcset={OS_logo} type="image/png" />
          <img src={OS_logo} alt="OS Logo" />
        </picture></a
      >
      <p>#30DayMapChallenge</p>
    </div>
    <button on:click={() => (showModal = true)}
      ><span class="material-symbols-outlined"> info </span></button
    >

    <Modal bind:showModal>
      <h2 slot="header">
        Bathymetry
        <small
          ><em>noun</em>/ˌbəˈθɪmətri/ the measurement of depth of water in
          oceans, seas, or lakes.</small
        >
      </h2>

      <p class="definition-list" />
      <p class="spaced">
        Welcome to this interactive 3D visualisation showing the bathymetry of
        the Lake District National Park! Take a dive into your favourite lakes
        by clicking on the buttons or panning around the map.
      </p>
      <p class="spaced">
        The data comes from historic bathymetric contours in Ordnance Survey's
        1:50,000 maps. Thanks go to Jess Baker and Paul Naylor from OS's
        GeoDataViz team for their manual digitisation of the depth data, which
        appears in 10m increments.
      </p>
      <p class="spaced">
        The map was made with Sveltekit, Maplibre GL JS, and Blender. You can view the code on <a href="https://github.com/MMarochov/lake_loch_love">Github.</a>
      </p>
      <p class="spaced">
        Inspired by William B Davis's <a
          href="https://willymaps.github.io/depth/"
          target="_blank">fantastic visualisation of the Great Lakes!</a
        >
      </p>
      <p>#30DayMapChallenge</p>
    </Modal>
  </section>
  <h1>The Bathymetry of the Lake District National Park</h1>

  <p>Choose a lake to explore!</p>
  <section class="content-container">
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
  </section>
  <p class="instructions">
    <span class="material-symbols-outlined"> drag_pan </span> Left click and
    drag to move <span class="material-symbols-outlined"> mouse </span> Scroll
    to zoom <span class="material-symbols-outlined"> right_click </span> Right click
    to pan
  </p>
</main>

<style>
  main {
    position: relative;
    height: 100%;
    width: 100%;
    border-radius: 20px;
    text-align: center;
    align-self: center;
  }

  .banner {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .banner > p {
    margin: 0 0 6 10px;
  }

  h1 {
    font-weight: bold;
    font-size: 1.5rem;
    margin: 0;
  }

  p {
    margin: 6px;
  }

  .spaced {
    margin: 14px;
  }

  .instructions {
    display: none;
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

  .content-container {
    display: flex;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 750px) {
    .content-container {
      flex-direction: row;
      flex-wrap: nowrap;
    }

    .button-container {
      max-width: min-content;
    }

    .instructions {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .instructions > span {
      padding: 0 2px 0 12px;
    }
  }
</style>
