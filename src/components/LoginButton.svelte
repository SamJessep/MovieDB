<script>
import Popup from './Popup.svelte'
import { onMount } from 'svelte';
import {StartLogin, StartSession, GetDetails} from '../model/account.js'
import {Languages, Countries} from '../stores/store.js'
import {User, IsLoggedIn} from "../stores/userStore.js"
import {GetLanguageText, GetCountryText} from '../model/dataHelper.js'
import {QueryToJSON} from '../util.js'
import {location, querystring} from 'svelte-spa-router'

let LoginOpen = false;
let profilePromise
onMount(()=>{
  TryLoadProfile()

})

function TryLoadProfile(){
  let id = localStorage.getItem("session_id")
  if(id){
    profilePromise = GetDetails(id)
    profilePromise.then(user=>localStorage.setItem("user", JSON.stringify({...user, session_id:id})))
  }
}


var params = QueryToJSON(window.location.search.substring(1)) || $querystring;
if(params["approved"]){
  StartSession()
}

async function LogOut(){

}


</script>

{#if $IsLoggedIn}
  <button id="openLogin" on:click={()=>LoginOpen=!LoginOpen}>My Account</button>
{:else}
  <button id="openLogin" on:click={StartLogin()}>Login</button>
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

#openLogin{
  position: absolute;
  top:1rem;
  left: 1rem;
}

div[slot="contents"]{
  text-align: center;
}

</style>
