<script>
import Popup from './Popup.svelte'
let LoginOpen = false;
</script>

<button id="openLogin" on:click={()=>LoginOpen=!LoginOpen}>Login</button>
<Popup bind:MenuOpen={LoginOpen} HasDefaultClose=true>
  <div slot="contents">
    <h1>Login</h1>

    <label for="email">Email</label>
    <input id="email" type="email"/>

    <label for="password">Email</label>
    <input id="password" type="password"/>

    <p>Dont have an account? <span class="link">click here</span> to sign up</p>
    <label for="remeberMe" class="inline" >Remeber Me</label>
    <input if="remeberMe" type="checkbox"/>
    <button id="login">Login</button>
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
