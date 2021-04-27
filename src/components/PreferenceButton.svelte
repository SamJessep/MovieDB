<script>
  import { } from 'os';
import {GetCountries, GetLanguages} from '../model/api_config.js';
  import {Preferences, Settings} from '../stores/store.js'
  import {User} from '../stores/userStore'
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

function resetAccountPreferences(){
  User.update(u=>u)
}

Preferences.subscribe(p=>console.log("PP", p))
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
          <legend>Use account settings</legend>
          <label>Yes
            <input type="radio" name="useAccountSettings" checked={$Settings.useAccountSettings} on:change={val=>{
              $Settings.useAccountSettings=val.target.checked
              if(val.target.checked)resetAccountPreferences();
              }}/>
          </label>
          <label>No
            <input type="radio" name="useAccountSettings" checked={!$Settings.useAccountSettings} on:change={val=>$Settings.useAccountSettings=!val.target.checked}/>
          </label>
        </fieldset>
        <fieldset disabled={$Settings.useAccountSettings}>
          <legend>Region</legend>
          <Selector bind:bindedValue={$Preferences.region} fetchItemsFunction={GetCountries} selectID="countriesSelect" label="Country"/>
          <Selector bind:bindedValue={$Preferences.language} fetchItemsFunction={GetLanguages} selectID="languagesSelect" label="Language"/>
        </fieldset>
        <fieldset disabled={$Settings.useAccountSettings}>
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
