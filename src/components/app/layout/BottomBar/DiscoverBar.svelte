<script>
  import QuickButton from './QuickButton.svelte'
  import GenreButton from './GenreButton.svelte'

  import {querystring, location} from 'svelte-spa-router'
  import {User, IsLoggedIn} from '../../../../stores/userStore'

  console.log($location)
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
  color: $FontColor, white;
  font-size: $BaseFontSize;
  outline-color: $AccentColor;
}

nav{
  display:flex;
  justify-content:space-evenly;
  background-color: rgba(0, 0, 0, 0.705);
  border-radius: 0 1rem 0 0;
}

.hero-foot{
  position: fixed;
  bottom: 0;
}
</style>
