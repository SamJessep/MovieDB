<script>
  import QuickButton from './QuickButton.svelte'
  import GenreButton from './GenreButton.svelte'

  let buttons = [{
      text: "In Theatres",
      click: (el) => console.log(el)
    },
    {
      text: "Popular",
      click: (el) => console.log(el)
    },
    {
      text: "Recent Releases",
      click: (el) => console.log(el)
    }
  ]
</script>

<nav>
  {#each buttons as btn}
    <QuickButton buttonText={btn.text} buttonClick={btn.click}/>
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
