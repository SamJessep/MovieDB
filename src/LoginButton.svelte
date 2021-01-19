<script>
import Popup from './Popup.svelte'
import {CreateRequestToken, GetUserApproval, CreateAccessToken, GetDetails} from './model/account.js'

let LoginOpen = false;
let profilePromise

TryLoadProfile()

function LoggedIn(){
  return !(localStorage.getItem("session_id") == "undefined" || localStorage.getItem("session_id") == null)
}

function TryLoadProfile(){
  let id = localStorage.getItem("session_id")
  if(LoggedIn()){
    profilePromise = GetDetails(id)
  }
}

async function login(){
  let res = await CreateRequestToken()
  const requestToken = res.request_token
  localStorage.setItem('authToken', requestToken);
  GetUserApproval(requestToken)
}

var params = location.search.substring(1);
if(params.includes("LoggedIn")){
  startSession()
}
async function startSession(){
  var querySTR = JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
  try{
    if(querySTR['LoggedIn']){
      let token = localStorage.getItem("authToken")
      let res = await CreateAccessToken(token)
      localStorage.setItem("session_id", res.session_id)
      TryLoadProfile()
    }
    window.location.href = window.location.origin + window.location.pathname;
  }
  catch(e){
    console.error("user wasn't authenticated correctly", e)
  }
}

async function LogOut(){
  
}


</script>

{#if LoggedIn()}
  <button id="openLogin" on:click={()=>LoginOpen=!LoginOpen}>My Account</button>
{:else}
  <button id="openLogin" on:click={login}>Login</button>
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
      <p>Language: <b>{profile.iso_639_1}</b></p>
      <p>Country: <b>{profile.iso_3166_1}</b></p>
    {:catch e}
      <p>error loading profile
        <button>click here to try again</button>
      </p>
    {/await}
    <button on:click={LogOut}>Log Out</button>
  {:else}
    <p>No Promise</p>
  {/if}
    <!-- <h1>Login</h1>

    <label for="email">Email</label>
    <input id="email" type="email"/>

    <label for="password">Email</label>
    <input id="password" type="password"/>

    <p>Dont have an account? <span class="link">click here</span> to sign up</p>
    <label for="remeberMe" class="inline" >Remeber Me</label>
    <input if="remeberMe" type="checkbox"/>
    <button id="login" on:click={login}>Login</button> -->
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

input[type="email"], input[type="password"], button#login{
  min-width:60%;
}

button#login{
  display: block;
  margin: 0 auto;
}

</style>
