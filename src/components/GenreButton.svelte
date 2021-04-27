<script>
import QuickButton from './QuickButton.svelte'
import {push} from 'svelte-spa-router'
import Popup from "./Popup.svelte"

export let isOpen = false;
let root;

export let genresPromises = [
  {
    name:'Tv',
    promise:GetTVGenres()
  },
  {
    name:'Movie',
    promise:GetMovieGenres()
  }
]

export async function GetTVGenres(){
  return await GetGenres('https://api.themoviedb.org/3/genre/tv/list?language=en_US&api_key=579872d8976e8f07d27624584808fee2');
}

export async function GetMovieGenres(){
  return await GetGenres('https://api.themoviedb.org/3/genre/movie/list?language=en_US&api_key=579872d8976e8f07d27624584808fee2');
}

async function GetGenres(url){
  return await fetch(url)
  .then(data=>data.json())
  .then(json=>json.genres);
}

export function Refresh(){
  genresPromises[0].promise = GetTVGenres();
  genresPromises[1].promise = GetMovieGenres();
}

export function ToggleGenreContainer(){
  isOpen = !isOpen;
}

export function Click(e){
  //Close genre drop down if user clicks elsewhere
  if (!e.target.matches('#root') && !root.contains(e.target)) {
    if(isOpen){
      //Close inner lists
      isOpen = false;
      var containers = document.getElementsByClassName("genreContainer")
      for(let i = 0; i<containers.length; i++){
        containers[i].open = false;
      }
    }
  }
}

export function GenreSelected(id, type){
  push(`/Genre/${type}/${id}`)
  isOpen = false
}
</script>
<div id="root" bind:this={root}>
  <QuickButton text="Genre" click={ToggleGenreContainer}/>
  <Popup bind:MenuOpen={isOpen} HasDefaultClose={true}>
    <div slot="contents">
      {#each genresPromises as genreType}
        {#await genreType.promise}
          <p>Loading {genreType.name} genres...</p>
        {:then genres}
        <details class="genreContainer">
          <summary class="genreSectionHeader">{genreType.name}</summary>
          {#each genres as genre}
            <p id={genre.id} on:click={GenreSelected(genre.id, genreType.name)}>{genre.name}</p>
          {/each}
          </details>
        {:catch error}
          <div>
            Opps Genres couldn't be loaded
            <button class="inlineBtn" on:click={Refresh}>Click here to try again</button>
            <details>
              <summary>click here for more info</summary>
              <pre>{error}</pre>
            </details>
          </div>
        {/await}
      {/each}
    </div>
  </Popup>
  <div id="container" class:isOpen={isOpen}>
  </div>
</div>

<svelte:window on:click={Click}/>

<style>
*{
  color:white;
}

.inlineBtn{
  display: inline;
}

#container{
  position: absolute;
  display: block;
  visibility: hidden;
  opacity: 0;
  transition: 0.4s;
  right: 0;
}

#container.isOpen{
  visibility: visible;
  opacity: 1;
  background-color: var(--BackgroundColor);
  border-radius: 5px;
  box-shadow: 0px 0px 12px 0px grey;
  }

.genreContainer{
  display: flex;
  flex-direction: column;
}

.genreContainer>summary{
  padding: 0.5rem 4rem;
}

details, details *{
  cursor: pointer;
  transition: 0.5s;
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

.genreSectionHeader{
  font-size: var(--BaseFontSize, 3vmin);
  outline: none;
}

details:not([open]) .genreSectionHeader:hover{
  color: var(--SelectedColor);
}

details[open] .genreSectionHeader{
  color:var(--AccentColor, green);
}

details p{
  padding: 0.5rem 0.4rem;
  text-align: center;
  margin: 0.1rem 0;
}

details p:hover{
  color:var(--AccentColor, green);
  background-color:var(--SecondBackgroundColor, grey);;
  border-radius: 1vmin;
}
</style>
