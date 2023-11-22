<script>
  import { createEventDispatcher } from "svelte";
  export let lake;

  const dispatch = createEventDispatcher();

  function handleButtonClick() {
    dispatch("zoomButtonClick", lake.coordinates);
  }
</script>

<button on:click={handleButtonClick}>{lake.name}</button>

<style>
  button {
    min-width: 115px;
    justify-content: center;
    align-items: center;
    background-image: radial-gradient(
      100% 100% at 100% 0,
      #def5e5 0,
      #569ec8 100%
    );
    border: 0;
    border-radius: 6px;
    box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px,
      rgba(58, 65, 111, 0.5) 0 -3px 0 inset;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    font-family: "JetBrains Mono", monospace;
    padding: 8px;
    margin: 3px;
    transition: box-shadow 0.15s, transform 0.15s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    font-size: 14px;
  }

  button:focus {
    box-shadow: #334c84 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #334c84 0 -3px 0 inset;
  }

  button:hover {
    box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #334c84 0 -3px 0 inset;
    transform: translateY(-2px);
  }

  button:active {
    box-shadow: #334c84 0 3px 7px inset;
    transform: translateY(4px);
  }
</style>
