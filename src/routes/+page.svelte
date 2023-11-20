<!-- MapApp.svelte -->
<script lang="ts">
  // Imports
  import Map from "$lib/components/Map.svelte";
  import ZoomButton from "$lib/components/ZoomButton.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import type { Map as MapLibreMap, MapOptions } from "maplibre-gl";
  import { GeoJsonLayer } from "$lib/layers/geojsonlayer";
  import lakes_data from "$lib/data/merged_lakes.json";
  import OS_logo from "$lib/images/OS_logo_mono_dark_rgb.png";
  
  
  // Init
  export let data
  let key = data.OS_API_KEY
  let showModal = false;
  let map: MapLibreMap;

  let lakes = [
    { name: "Wast Water", coordinates: [-3.296972, 54.439684], zoom: 11.7 },
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

  let layer = new GeoJsonLayer("test", "Blue Shape", lakes_data, "fill-extrusion", {
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
    maxZoom: 13,
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
    });
    // url: '/src/lib/images/bassenthwaite.png'

    let images = [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png',
        coordinates: [-3.237511, 54.647718]
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png',
        coordinates: [-2.797794, 54.515428]
      }
    ];

    images.forEach((imageObj, index) => {
      map.loadImage(imageObj.url, (error, image) => {
        if (error) throw error;
        map.addImage(`image-${index}`, image);
        map.addSource(`point-${index}`, {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features' : [
              {
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': imageObj.coordinates
                }
              }
            ]
          }
        });
        map.addLayer({
          'id': `points-${index}`,
          'type': 'symbol',
          'source': `point-${index}`,
          'layout': {
            'icon-image': `image-${index}`,
            'icon-size': 0.5
          }
        });
        // Move the image layer above other layers
        map.moveLayer(`points-${index}`);
      });
    })
  }

  // Helper function to find the layer ID by name
function findLayerIdByName(style, layerName) {
  const layers = style.layers;
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    if (layer.type !== 'background' && layer.id.indexOf(layerName) !== -1) {
      return layer.id;
    }
  }
  return null;
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
