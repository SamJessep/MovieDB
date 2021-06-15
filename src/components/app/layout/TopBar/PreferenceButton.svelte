<script>
  import {GetCountries, GetLanguages} from '../../../../model/api_config';
  import {Preferences, Settings} from '../../../../stores/store'
  import {User,IsLoggedIn} from '../../../../stores/userStore'
  import Selector from '../../../form/Selector.svelte'
  import Popup from '../../../general/Popup.svelte'
  import SvgIcon from '../../../general/SvgIcon.svelte'
  import MobileButton from './MobileButton.svelte'
  import {slide} from "svelte/transition"

  let isOpen = false;
  let madeChanges = false;
  export let isMobile = false;

  const initialSettings = JSON.stringify($Settings);

  Settings.subscribe(s=>{
    madeChanges = initialSettings !==  JSON.stringify(s);
  })

  let settingsStyles = `
  width: 3.5rem;
  height: 3.5rem;
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

const GetRatings = async()=>{
  return new Promise((resolve, reject) => {
    let options = [...Array(10).keys()].map(i=>{ return {text:i+1, value:i+1}})
    resolve([{text:"Disabled", value:null}, ...options]) 
  })
}

</script>

<div>
  {#if isMobile}
    <MobileButton title="Preferences" click={()=>isOpen=!isOpen}>
      <SvgIcon src="images/cog.svg" styles={settingsStyles}/>
    </MobileButton>
  {:else}
    <button on:click={()=>isOpen=!isOpen} class="icon-btn roundedBtn dark" aria-label="Settings" title="Preferences">
      <SvgIcon src="images/cog.svg" styles={settingsStyles}/>
    </button>
  {/if}
  
  <Popup bind:MenuOpen={isOpen} HasDefaultClose=true>
    <div slot="contents">
      <h1>Preferences</h1>
      <div id="controlsContainer">
        {#if $IsLoggedIn}
          <fieldset>
            <legend></legend>
            <h2>Use account settings</h2>
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
          <Selector bind:bindedValue={$Preferences.RequestParams.region} fetchItemsFunction={GetCountries} selectID="countriesSelect" label="Country"/>
          <Selector bind:bindedValue={$Preferences.RequestParams.language} fetchItemsFunction={GetLanguages} selectID="languagesSelect" label="Language"/>
        </fieldset>
        <fieldset>
          <legend>Filtering</legend>
          <label class="checkControl">
            include adult<input id="include_adult" type="checkbox" bind:checked={$Preferences.RequestParams.include_adult} disabled={$Settings.useAccountSettings && $IsLoggedIn}/>
          </label>
          <label>Must have poster
            <input type="checkbox" bind:checked={$Preferences.must_have_poster}/>
          </label>
          <Selector bind:bindedValue={$Preferences.RequestParams["vote_average.gte"]} fetchItemsFunction={GetRatings} selectID="minRating" label="Minimum rating"/>
        </fieldset>
      </div>
      {#if madeChanges}
        <div class="confirm-section" transition:slide>
          <small>Your changes have been saved</small>
          <button aria-label="Save" class="sync standard" on:click={e=>window.location.reload()}>
            <p>click to update the page</p>
            <SvgIcon src="images/sync.svg" styles={confirmStyles}/>
          </button>
        </div>
      {/if}
      
    </div>
  </Popup>
</div>
<style lang="scss">
  h1{
    font-size: $TitleFontSize;
  }
  label{
    display: block;
  }
  fieldset{
    legend{
      font-size: $HeaderFontSize;
      margin-bottom: 0.5rem;
    }
    *:not(legend){
      margin-left: 0.4rem;
    }
    // border-bottom: solid $FontColor 1px;
    margin-bottom: 1rem;
  }

  #controlsContainer{
    max-height: 75vh;
    overflow-y: auto;
    fieldset{
      width: 100%;
      padding: 0 0.25rem;
    }
  }

  .checkControl{
    display: inline-block;
    cursor: pointer;
  }
  .confirm-section{
    display: flex;
    align-items: center;
    float: right;
    height: 2.8rem;
  }

  .confirm-section>button{
    padding: 0;
    margin: 0;
    cursor: pointer;
    background-color: transparent;
    color: $AccentColor2;
    border:none;
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

  *:focus{
    outline: solid #00d676 2px;
  }

  label{
    margin: 0.25rem 0;
  }


</style>
