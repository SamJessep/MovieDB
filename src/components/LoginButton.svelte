<script>
import Popup from './Popup.svelte'
import { onMount } from 'svelte';
import Account from '../model/account.js'
import {Languages, Countries} from '../stores/store.js'
import {User, IsLoggedIn} from "../stores/userStore.js"
import {GetLanguageText, GetCountryText} from '../model/dataHelper.js'
import {QueryToJSON} from '../util.js'
import {location, querystring} from 'svelte-spa-router'
import SvgIcon from "./SvgIcon.svelte"

let LoginOpen = false;
let profilePromise
onMount(()=>{
  TryLoadProfile()

})

function TryLoadProfile(){
  let id = localStorage.getItem("session_id")
  if(id){
    profilePromise = Account.GetDetails(id)
    profilePromise.then(user=>localStorage.setItem("user", JSON.stringify({...user, session_id:id})))
  }
}

async function StartSession(requestToken){
    try{
      let res = await Account.CreateAccessToken(requestToken)
      console.log(res)
      localStorage.setItem("session_id", res.session_id)
      TryLoadProfile()
      window.location.href = window.location.origin +"#"+ $location;
    }
    catch(e){
      console.error("user wasn't authenticated correctly", e)
    }
  }


  var params = QueryToJSON($querystring)
if(params["approved"]){
  StartSession(params.request_token)
}

async function LogOut(){

}

let userBtnStyles = `
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

{#if $IsLoggedIn}
  <button id="openLogin" on:click={()=>LoginOpen=!LoginOpen} class="icon-btn">
    <SvgIcon src="images/user.svg" styles={userBtnStyles}/>
  </button>
{:else}
  <button id="openLogin" on:click={Account.StartLogin}>Login</button>
{/if}
<Popup bind:MenuOpen={LoginOpen} HasDefaultClose=true>
  <div slot="contents">
  {#if profilePromise}
    {#await profilePromise}
      <p>Loading Profile...</p>
    {:then profile}
      {#if profile.name == ""}
        <h1>{profile.username}</h1>
      {:else}
        <h1>{profile.name}</h1>
        <small>{profile.username}</small>
      {/if}
      <p>Language: <b>{GetLanguageText(profile.iso_639_1)}</b></p>
      <p>Country: <b>{GetCountryText(profile.iso_3166_1)}</b></p>
    {:catch e}
      <p>error loading profile
        <button on:click={TryLoadProfile}>click here to try again</button>
      </p>
    {/await}
    <button on:click={LogOut}>Log Out</button>
  {/if}
  </div>
</Popup>

<style>

div[slot="contents"]{
  text-align: center;
}
</style>
