<script>
import Popup from '../../../general/Popup.svelte'
import Account from '../../../../model/account'
import {IsLoggedIn, clearLocalStorage, User} from "../../../../stores/userStore.js"
import {GetLanguageText, GetCountryText} from '../../../../model/dataHelper'
import {QueryToJSON} from '../../../../util'
import {location, push, querystring, replace} from 'svelte-spa-router'
import SvgIcon from "../../../general/SvgIcon.svelte"
import MobileButton from './MobileButton.svelte'

export let isMobile = false;
let LoginOpen = false;
let profilePromise

function TryLoadProfile(){
  let id = localStorage.getItem("session_id")
  if(id){
    profilePromise = Account.GetDetails(id)
    profilePromise.then(user=>{
      let userData = {...user, session_id:id}
      localStorage.setItem("user", JSON.stringify(userData))
      User.set(userData)
      window.location.href = window.location.origin +"#"+ $location;
      return userData
    })
  }
}

async function StartSession(requestToken){
    try{
      let res = await Account.CreateAccessToken(requestToken)
      localStorage.setItem("session_id", res.session_id)
      TryLoadProfile()
    }
    catch(e){
      console.error("user wasn't authenticated correctly", e)
    }
  }

let regularQS = QueryToJSON(window.location.search.slice(1))
let hashQS = QueryToJSON($querystring)
var params = JSON.stringify(regularQS) == "{}" ? hashQS : regularQS
if(params["approved"]){
  StartSession(params.request_token)
}

if($IsLoggedIn){
  TryLoadProfile()
}

async function LogOut(){
  //Delete session on TMDB
  let sessionID = localStorage.getItem("session_id")
  Account.Logout(sessionID)
  //Delete session & account from local storage
  clearLocalStorage()
  //Refresh page
  window.location.reload()
  //Show toast
  alert("logged out")
}

let userBtnStyles = `
  width: 3.5rem;
  height: 3.5rem;
  padding: 0.3rem;
  transition: fill 0.5s;`;

</script>
<div>
  {#if $IsLoggedIn}
    {#if isMobile}
    <MobileButton title="My Account" click={()=>LoginOpen=!LoginOpen}>
      <SvgIcon src="images/user.svg" styles={userBtnStyles}/>
    </MobileButton>
    {:else}
    <button id="openLogin" on:click={()=>LoginOpen=!LoginOpen} class="icon-btn roundedBtn dark" aria-label="My Account">
      <SvgIcon src="images/user.svg" styles={userBtnStyles}/>
    </button>
    {/if}
  {:else}
    <button id="openLogin" on:click={Account.StartLogin} class="roundedBtn dark login-btn">
      <div>
        <p>Login</p>
      </div>  
    </button>
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
      <button on:click={LogOut} class="standard">Log Out</button>
    {/if}
    </div>
  </Popup>
</div>

<style lang="scss">

div[slot="contents"]{
  text-align: center;
}

.login-btn>div{
  display: flex;
  width: 3.5rem;
  height: 3.5rem;
  padding: 0.3rem;
  align-items: center;
  justify-content: center;
}

.icon-btn{
  display: flex;
  align-items: center;
}

h1.title{
  color:white;
  margin: auto;
  font-size: $HeaderFontSize;
}
</style>
