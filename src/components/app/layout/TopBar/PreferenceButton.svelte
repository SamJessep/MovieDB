<script>
  import {GetCountries, GetLanguages} from '../../../../model/api_config';
  import {Preferences, Settings} from '../../../../stores/store'
  import {User,IsLoggedIn} from '../../../../stores/userStore'
  import Selector from '../../../form/Selector.svelte'
  import Popup from '../../../general/Popup.svelte'
  import SvgIcon from '../../../general/SvgIcon.svelte'

  let isOpen = false;
  let madeChanges = false;

  const initialSettings = JSON.stringify($Settings);

  Settings.subscribe(s=>{
    madeChanges = initialSettings !==  JSON.stringify(s);
  })

  let settingsStyles = `
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

let confirmStyles = `
svg#SVGID{
  width: 3.5rem;
  height: 3.5rem;
  padding: 1vmin 0;
}
`;

function resetAccountPreferences(){
  User.update(u=>u)
}

</script>

<div>
  <button on:click={()=>isOpen=!isOpen} class="icon-btn" aria-label="Settings">
    <SvgIcon src="images/cog.svg" styles={settingsStyles}/>
  </button>
  <Popup bind:MenuOpen={isOpen} HasDefaultClose=true>
    <div slot="contents">
      <h1>Preferences</h1>
      <div id="controls">
        {#if $IsLoggedIn}
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
        {/if}
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
      <div class="confirm-section" class:visable={madeChanges}>
        <small>Your changes have been saved</small>
        <button aria-label="Save" class="icon-btn sync" on:click={e=>window.location.reload()}>
          <SvgIcon src="images/sync.svg" styles={confirmStyles}/>
          <p>click to update the page</p>
        </button>
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
  .confirm-section{
    display: flex;
    align-items: center;
    float: right;
  }

  .confirm-section>button{
    padding: 0;
    margin: 0;
    transition: color 0.5s;
    cursor: pointer;
  }

  .confirm-section>button:hover{
    color: var(--AccentColor, green);
  }
  
  .sync>p{
    margin: auto;
  }

  .sync{
    display: flex;
  }

  .confirm-section.visable{
    display: flex;
  }
  
  .confirm-section{
    display: none;
  }
</style>
