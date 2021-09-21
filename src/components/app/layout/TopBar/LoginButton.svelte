<script>
import Account from '../../../../model/account'
import {IsLoggedIn, User} from "../../../../stores/userStore.js"
import {GetSCSSVars, QueryToJSON} from '../../../../util'
import {location, push, querystring, replace} from 'svelte-spa-router'
import SvgIcon from "../../../general/SvgIcon.svelte"
import MobileButton from './MobileButton.svelte'
import AnimatedIcon from '../../../general/AnimatedIcon.svelte'
import { ModalView } from '../../../../stores/store';
import LoginModal from './LoginModal.svelte';

export let isMobile = false;
let profilePromise
const scss = GetSCSSVars()

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



const userBtnStyles = `
  width: 3.5rem;
  height: 3.5rem;
  padding: 0.3rem;
  transition: fill 0.5s;`;
const loadingstyles = `
  #ID * {
    stroke:${scss.FontColor};
  }
`


const OpenModal = ()=>{
  ModalView.set({
    component: LoginModal,
    props: {
      profilePromise:profilePromise
    },
    options:{
      title: "My Profile"
    }
  })
}
</script>
<div>
  {#if $IsLoggedIn}
    {#if isMobile}
    <MobileButton title="My Account" click={OpenModal}>
      <SvgIcon src="images/user.svg" styles={userBtnStyles}/>
    </MobileButton>
    {:else}
    <button id="openLogin" on:click={OpenModal} class="icon-btn roundedBtn dark login-btn" aria-label="My Account" title="My Account">
      <SvgIcon src="images/user.svg" styles={userBtnStyles}/>
    </button>
    {/if}
  {:else}
    {#if isMobile}
      {#if params["approved"]}
          <MobileButton title="Loading" disabled={false}>
            <AnimatedIcon src="images/animatedIcons/loading.json" autoplay={true} loop={true} styles={loadingstyles} id="loginLoadingIndicator" width="32px" height="32px"/>
          </MobileButton>
        {:else}
          <MobileButton title="Login" click={Account.StartLogin}>
            <SvgIcon src="images/user.svg" styles={userBtnStyles}/>
          </MobileButton>
        {/if}
    {:else}
    <button id="openLogin" on:click={Account.StartLogin} class="roundedBtn dark login-btn" title="Login">
      <div>
        <p>Login</p>
      </div>  
    </button>
    {/if}
  {/if}
</div>

<style lang="scss">

.login-btn{
  display: flex;
  align-items: center;
  cursor: pointer;
  &>div{
    display: flex;
    width: 3.5rem;
    height: 3.5rem;
    padding: 0.3rem;
    align-items: center;
    justify-content: center;
  }
}

</style>
