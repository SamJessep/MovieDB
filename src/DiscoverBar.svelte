<script>
  import QuickButton from './QuickButton.svelte'
  import GenreButton from './GenreButton.svelte'
  import {Popular, Latest, GetWatchList} from './model/TMDbAPI'
  import {User} from './stores.js'

  let buttons = [{
      text: "My Watchlist",
      click: GetWatchList
    },
    {
      text: "Popular",
      click: Popular
    },
    {
      text: "Recent Releases",
      click: Latest
    }
  ]
</script>

<nav on:loadResults>
  {#each buttons as btn}
    {#if btn.text != "My Watchlist" || $User.session_id != null}
      <QuickButton on:loadResults buttonText={btn.text} buttonClick={btn.click}/>
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
