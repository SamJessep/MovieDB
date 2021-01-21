<script>
  import QuickButton from './QuickButton.svelte'
  import GenreButton from './GenreButton.svelte'
  import {Popular, Latest, GetWatchList} from '../model/TMDbAPI'
  import {User} from '../stores/store.js'

  let buttons = [{
      text: "My Watchlist",
      url: `/${$User.username}/Watchlist`
    },
    {
      text: "Popular",
      url: '/Discover/Popular'
    },
    {
      text: "Recent Releases",
      url: '/Discover/Latest'
    }
  ]
</script>

<nav on:loadResults>
  {#each buttons as btn}
    {#if btn.text != "My Watchlist" || $User.session_id != null}
      <QuickButton text={btn.text} url={btn.url}/>
    {/if}
  {/each}
  <GenreButton/>
</nav>

<style>
*{
  color: var(--FontColor, white);
  font-size: var(--BaseFontSize);
  outline-color: var(--AccentColor);
}

nav{
  display:flex;
  justify-content:space-evenly;
  padding-top: 1rem;
}
</style>
