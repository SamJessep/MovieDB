<script>
  import {GetCountries, GetLanguages} from '../model/api_config.js';
  import {Config} from '../config.js';
  import {Preferences} from '../stores/store.js'
  import Selector from './form/Selector.svelte'
  import Popup from './Popup.svelte'
  let isOpen = false;
</script>

<div>
  <button on:click={()=>isOpen=!isOpen}>
    Preferences
  </button>
  <Popup bind:MenuOpen={isOpen} HasDefaultClose=true>
    <div slot="contents">
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
    </div>
  </Popup>
</div>
<style>
  button{
    position: absolute;
    top:1rem;
    right: 1rem;
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
