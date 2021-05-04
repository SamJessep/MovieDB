<script>
  import {GetCountries, GetLanguages} from '../../../../model/api_config';
  import {Preferences, Settings} from '../../../../stores/store'
  import {User,IsLoggedIn} from '../../../../stores/userStore'
  import Selector from '../../../form/Selector.svelte'
  import Popup from '../../../general/Popup.svelte'
  import SvgIcon from '../../../general/SvgIcon.svelte'
  import MobileButton from './MobileButton.svelte'

  let isOpen = false;
  let madeChanges = false;
  export let isMobile = false;

  const initialSettings = JSON.stringify($Settings);

  Settings.subscribe(s=>{
    madeChanges = initialSettings !==  JSON.stringify(s);
  })

  let settingsStyles = `
  width: ${isMobile ? "2rem" : "3.5rem"};
  height: ${isMobile ? "2rem" : "3.5rem"};
  padding: 0.3rem;
  transition: fill 0.5s;
`;

let confirmStyles = `
  width: 2rem;
  height: 2rem;
  padding-left: 0.2rem;
`;

function resetAccountPreferences(){
  User.update(u=>u)
}

</script>

<div>
  {#if isMobile}
    <MobileButton title="Preferences" click={()=>isOpen=!isOpen}>
      <SvgIcon src="images/cog.svg" styles={settingsStyles}/>
    </MobileButton>
  {:else}
    <button on:click={()=>isOpen=!isOpen} class="icon-btn roundedBtn dark" aria-label="Settings">
      <SvgIcon src="images/cog.svg" styles={settingsStyles}/>
    </button>
  {/if}
  
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
        <fieldset disabled={$Settings.useAccountSettings && $IsLoggedIn}>
          <legend>Region</legend>
          <Selector bind:bindedValue={$Preferences.region} fetchItemsFunction={GetCountries} selectID="countriesSelect" label="Country"/>
          <Selector bind:bindedValue={$Preferences.language} fetchItemsFunction={GetLanguages} selectID="languagesSelect" label="Language"/>
        </fieldset>
        <fieldset disabled={$Settings.useAccountSettings && $IsLoggedIn}>
          <legend>Other</legend>
          <label for="include_adult" class="checkControl">include adult</label>
          <input id="include_adult" type="checkbox" bind:checked={$Preferences.include_adult}/>
        </fieldset>
      </div>
      <div class="confirm-section" class:visable={madeChanges}>
        <small>Your changes have been saved</small>
        <button aria-label="Save" class="sync standard" on:click={e=>window.location.reload()}>
          <p>click to update the page</p>
          <SvgIcon src="images/sync.svg" styles={confirmStyles}/>
        </button>
      </div>
    </div>
  </Popup>
</div>
<style lang="scss">
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
    cursor: pointer;
  }

  .confirm-section>button:hover{
    color: $AccentColor;
  }
  
  .sync>p{
    margin: auto;
  }

  button.sync{
    display: flex;
    padding: 0.4rem;
    margin-left: 0.4rem;
  }

  .confirm-section.visable{
    display: flex;
  }
  
  .confirm-section{
    display: none;
  }
</style>
