<script>
  import {GetCountries, GetLanguages} from '../model/api_config.js';
  import Config from '../config.js';
  import {Preferences} from '../stores/store.js'
  import Selector from './form/Selector.svelte'
  import Popup from './Popup.svelte'
  import SvgIcon from './SvgIcon.svelte'

  let isOpen = false;

  let cogStyles = `
svg#SVGID{
  fill: var(--FontColor, black);
  width: 3.5rem;
  height: 3.5rem;
  padding: 1vmin 0;
  transition: fill 0.5s;
}
svg#SVGID:hover{
  fill: var(--AccentColor, green);
}`;
</script>

<div>
  <button on:click={()=>isOpen=!isOpen} class="icon-btn">
    <SvgIcon src="images/cog.svg" styles={cogStyles}/>
  </button>
  <Popup bind:MenuOpen={isOpen} HasDefaultClose=true>
    <div slot="contents">
      <h1>Preferences</h1>
      <div id="controls">
        <fieldset>
          <legend>Region</legend>
          <Selector bind:bindedValue={$Preferences.region} fetchItemsFunction={GetCountries} selectID="countriesSelect" label="Country"/>
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
