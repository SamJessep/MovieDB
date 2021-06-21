<script>
  import QuickButton from './QuickButton.svelte'
  import GenreButton from './GenreButton.svelte'

  import {location} from 'svelte-spa-router'
  import {User, IsLoggedIn} from '../../../../stores/userStore'

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  let buttons = [{
      text: "My Watchlist",
      url: `/${$User ? $User.username : null}/movie/Watchlist`,
      needsLogin: true
    },
    {
      text: "Popular",
      url: '/Discover/movie/Popular',
      needsLogin: false
    },
    {
      text: "Recent Releases",
      url: '/Discover/movie/Latest',
      needsLogin: false
    },
    {
      text: "Advanced Search",
      url: '/AdvancedSearch',
      needsLogin: false
    }
  ]

  var discoverPopupOpen = false
  var isMobile;
  var popupElement;
  var popup_btn;

  const openPopup = ()=>{
    discoverPopupOpen = !discoverPopupOpen
  }
  
  const checkIfMobile = e=>{
    isMobile=window.innerWidth<=750;
    discoverPopupOpen=false;
  }
  const tryCloseMenu = e=>{
    if(popupElement == null) return
    if(!popup_btn.contains(e.target)){
      discoverPopupOpen = false
    }
    if(popupElement.contains(e.target)){
      discoverPopupOpen=false
    }
  }

  checkIfMobile()
</script>

<div class="hero-foot">
  <nav class="tabs is-boxed is-fullwidth" on:loadResults>
    <div class="container">
      <ul>
        {#if isMobile}
        <div class="flex-btn" bind:this={popup_btn}>
          <QuickButton text="Discover" on:quick_button_clicked={openPopup} url={null}/>
          {#if discoverPopupOpen}
            <div class="popup" bind:this={popupElement} style={"width:"+popup_btn.getBoundingClientRect().width+"px;"}>
              {#each buttons as btn}
                {#if $IsLoggedIn || !btn.needsLogin}
                  <QuickButton text={btn.text} url={btn.url} active={$location.startsWith(btn.url)} on:quick_button_clicked={(e)=>dispatch(e.type, e.detail)}/>
                {/if}
              {/each}
            </div>
          {/if}
        </div>
        {:else}
          {#each buttons as btn}
            {#if $IsLoggedIn || !btn.needsLogin}
              <QuickButton text={btn.text} url={btn.url} active={$location.startsWith(btn.url)} on:quick_button_clicked={(e)=>dispatch(e.type, e.detail)}/>
            {/if}
          {/each}
          {/if}
        <GenreButton/>
      </ul>
    </div>
  </nav>
</div>
<svelte:window on:resize={checkIfMobile} on:click={tryCloseMenu}/>

<style lang="scss">
*{
  color: $FontColor;
  font-size: $BaseFontSize;
  outline-color: $AccentColor;
}

.popup{
  position: absolute;
  bottom: 100%;
  background-color: $TransparentPanel;
}

.flex-btn{
  flex:1;
}

nav{
  display:flex;
  justify-content:space-evenly;
  background-color: $TransparentPanel;
  border-radius: 0 1rem 0 0;
  &.tabs{
    overflow-x: visible;
    overflow: visible;
  }
}

.hero-foot{
  position: fixed;
  bottom: 0;
}
@media only screen and (max-width: $MobileWidth){
  .hero-foot{
    width: 100%;
  }
  nav{
    border-radius: 0;
  }
}
</style>
