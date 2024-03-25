<script>
  import {GetCountries, GetLanguages} from '../../../../model/api_config';
  import {Preferences, Settings} from '../../../../stores/store'
  import {User,IsLoggedIn} from '../../../../stores/userStore'
  import Selector from '../../../form/Selector.svelte'
  import {slide} from "svelte/transition"
  import SvgIcon from '../../../general/SvgIcon.svelte'

//SVG Styles
const confirmStyles = `
  width: 2rem;
  height: 2rem;
  padding-left: 0.2rem;
`;
let madeChanges = false;

const initialSettings = JSON.stringify($Settings);

Settings.subscribe(s=>{
  madeChanges = initialSettings !==  JSON.stringify(s);
})

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

  {#if $IsLoggedIn}
    <fieldset>
      <legend>Use account settings</legend>
      <label class="fit-content">Yes
        <input type="radio" name="useAccountSettings" checked={$Settings.useAccountSettings} on:change={val=>{
          $Settings.useAccountSettings=val.target.checked
          if(val.target.checked)resetAccountPreferences();
          }}/>
      </label>
      <label class="fit-content">No
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
  <fieldset>
    <legend>Extra</legend>
    <label class="checkControl">
      Use highest definition images<input type="checkbox" bind:checked={$Preferences.use_HD_only}/>
    </label>
  </fieldset>
{#if madeChanges}
  <div class="confirm-section" transition:slide>
    <small>Your changes have been saved</small>
    <button aria-label="Save" class="sync standard" on:click={e=>window.location.reload()}>
      <p>click to update the page</p>
      <SvgIcon src="images/sync.svg" styles={confirmStyles}/>
    </button>
  </div>
{/if}

<style lang="scss">
  label{
    display: block;
  }
  fieldset{
    width: 100%;
    padding: 0 0.25rem;
    legend{
      font-size: $HeaderFontSize;
      margin-bottom: 0.5rem;
    }
    *:not(legend){
      margin-left: 0.4rem;
    }
    margin-bottom: 1rem;
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