<script>
  import QuickButton from './QuickButton.svelte'
  import GenreButton from './GenreButton.svelte'
  import {Popular, Latest} from './model/TMDbAPI'

  let buttons = [{
      text: "In Theatres",
      click: (el) => console.log(el)
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
    <QuickButton on:loadResults buttonText={btn.text} buttonClick={btn.click}/>
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
