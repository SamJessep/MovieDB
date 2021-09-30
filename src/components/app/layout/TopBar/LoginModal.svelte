<script>
  import {GetLanguageText, GetCountryText, GetBestImageSize} from '../../../../model/dataHelper'
  import Account from '../../../../model/account'
  import {location} from 'svelte-spa-router'
  import { clearLocalStorage } from '../../../../stores/userStore';
  import config from '../../../../config';
  import ProfilePicture from '../../../general/ProfilePicture.svelte'

  export let profilePromise;

  async function LogOut(){
    //Delete session on TMDB
    let sessionID = localStorage.getItem("session_id")
    Account.Logout(sessionID)
    //Delete session & account from local storage
    clearLocalStorage()
    //Refresh page
    window.location.reload()
  }

  function TryLoadProfile(){
    let id = localStorage.getItem("session_id")
    if(id){
      profilePromise = Account.GetDetails(id)
      profilePromise.then(user=>{
        profile_path = getProfilePath(user.avatar.tmdb.avatar_path)
        let userData = {...user, session_id:id}
        localStorage.setItem("user", JSON.stringify(userData))
        User.set(userData)
        window.location.href = window.location.origin +"#"+ $location;
        return userData
      })
    }
  }

  const getProfilePath = path => {
    if(path){
      return path.startsWith("/http") ? path.substr(1) : config.BASE_IMAGE_URL+GetBestImageSize("profile",100)+path
    }
  }

  var profile_path

</script>

<div>
  {#if profilePromise}
    {#await profilePromise}
      <p>Loading Profile...</p>
    {:then profile}
      <ProfilePicture src={profile.avatar.tmdb.avatar_path} alt="{profile.name || profile.username}'s profile picture" />
      {#if profile.name == ""}
        <h3 class="name">{profile.username}</h3>
      {:else}
        <h3 class="name">{profile.name}</h3>
        <small>{profile.username}</small>
      {/if}
      <p>Language: <b>{GetLanguageText(profile.iso_639_1)}</b></p>
      <p>Country: <b>{GetCountryText(profile.iso_3166_1)}</b></p>
    {:catch e}
      <p>error loading profile
        <button on:click={TryLoadProfile}>click here to try again</button>
      </p>
    {/await}
    <button on:click={LogOut} class="logout-btn">Log Out</button>
  {/if}
  </div>

  <style lang="scss">
    *{
      color: $FontColor;
    }

    div{
      text-align: center;
    }

    h3.name{
      color:white;
      margin: auto;
      font-size: $HeaderFontSize;
    }

    button{
      @include darkBtnOutline;
    }
  </style>