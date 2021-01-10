<script>
  import {GetCountries, GetLanguages} from './model/TMDbAPI.js';
  import {Config} from './config.js';
  import {Preferences} from './stores.js'
  import Selector from './form/Selector.svelte'
  export let MenuOpen = false;
</script>

<div>
  <button on:click={()=>MenuOpen=!MenuOpen}>
    Preferences
  </button>
  <div id="dialogBackground" class:open={MenuOpen}>
    <dialog class:open={MenuOpen}>
      <h1>Preferences</h1>
      <div id="controls">
        <fieldset>
          <legend>Region</legend>
          <Selector bind:bindedValue={$Preferences.country} fetchItemsFunction={GetCountries} selectID="countriesSelect" label="Country"/>
          <Selector bind:bindedValue={$Preferences.language} fetchItemsFunction={GetLanguages} selectID="languagesSelect" label="Language"/>
        </fieldset>
        <fieldset>
          <legend>Other</legend>
          <label for="include_adult" class="checkControl">include adult</label>
          <input id="include_adult" type="checkbox" bind:checked={$Preferences.include_adult}/>
        </fieldset>
      </div>
      <button on:click={()=>MenuOpen=!MenuOpen}>Save & Close</button>
    </dialog>
  </div>
</div>
<style>
  button{
    position: absolute;
    top:1rem;
    right: 1rem;
  }

  #dialogBackground{
    z-index: -1;
    position: absolute;
    top:0;
    left:0;
    width: 100vw;
    height: 100vh;
    background-color: transparent;
    transition: background-color 1s;
  }

  #dialogBackground.open{
    display: block;
    z-index: 1;
    background-color: #000000d4;
    transition: background-color 1s;
  }

  dialog{
    display: none;
    width: 80vw;
    color: var(--FontColor, black);
    background-color: var(--BackgroundColor, white);
    box-shadow: 0.5rem 0.5rem 3px 0px #00ff8c;

    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
       -khtml-user-select: none; /* Konqueror HTML */
         -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome, Edge, Opera and Firefox */
  }

  dialog.open{
    display: block;
    top:-100vh;
    top:25%;
    transition: top 1s;
  }

  fieldset{
    min-width: 33%
  }

  #controls{
    display: flex;
    justify-content: space-evenly;
  }

  .checkControl{
    display: inline-block;
    cursor: pointer;
  }
</style>
