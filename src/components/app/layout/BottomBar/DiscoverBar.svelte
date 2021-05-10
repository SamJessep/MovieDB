<script>
  import QuickButton from './QuickButton.svelte'
  import GenreButton from './GenreButton.svelte'

  import {location} from 'svelte-spa-router'
  import {User, IsLoggedIn} from '../../../../stores/userStore'
  
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
    }
  ]
</script>

<div class="hero-foot">
  <nav class="tabs is-boxed is-fullwidth" on:loadResults>
    <div class="container">
      <ul>
        {#each buttons as btn}
          {#if $IsLoggedIn || !btn.needsLogin}
            <QuickButton text={btn.text} url={btn.url} active={$location.startsWith(btn.url)}/>
          {/if}
        {/each}
        <GenreButton/>
      </ul>
    </div>
  </nav>
</div>

<style lang="scss">
*{
  color: $FontColor;
  font-size: $BaseFontSize;
  outline-color: $AccentColor;
}

nav{
  display:flex;
  justify-content:space-evenly;
  background-color: $TransparentPanel;
  border-radius: 0 1rem 0 0;
}

.hero-foot{
  position: fixed;
  bottom: 0;
}
@media only screen and (max-width: 750px){
  .hero-foot{
    width: 100%;
  }
  nav{
    border-radius: 0;
  }
}
</style>
