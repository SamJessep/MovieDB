<script>
import AddButton from './AddButton.svelte'
import SvgIcon from './SvgIcon.svelte'
import {Config} from './config.js';
import {AddToWatchlist, IsOnWatchlist} from './model/TMDbAPI.js'
import {User} from './stores.js'

export let Result;
let placeholderStyles = `
  svg#SVGID{
    width:50%;
    height:50%;
    fill:var(--FontColor, black);
    transition: fill 0.3s;
    margin: auto;
  }

  *:hover>svg#SVGID, *:focus>svg#SVGID{
    fill:var(--AccentColor, green);
  }
  *:active>svg#SVGID{
    fill:var(--SelectedColor, green);
  }
`
let mediaTypeStyles = `
  svg#SVGID{
    display:block;
    width:30px;
    fill:var(--FontColor, black);
    transition: fill 0.3s;
    margin: auto;
  }
`

let title = Result.title || Result.original_title || Result.name;

export function GetImageUrl(){
  //Update to get best size for screen size
  return Config.BASE_IMAGE_URL + "original/"+Result.poster_path
}

export function LoadResultPage(el){
  alert("Clicked "+ title)
}

export function AddToList(event){
  var checked = event.detail.checked;
  var media_type = Result.media_type || "movie"
  AddToWatchlist(Result.id, media_type, checked)
}

</script>
<button class="resultCard nonStandard">
  {#if Result.poster_path}
    <img class="poster" src={GetImageUrl()} alt={title+" poster"} on:click={LoadResultPage}/>
  {:else}
    <div class="placeholder_container poster" on:click={LoadResultPage}>
        <SvgIcon src="images/warning.svg" styles={placeholderStyles}/>
        <small>No Poster</small>
    </div>
  {/if}
  <div class='toolbar'>
  {#if $User.session_id}
    {#await IsOnWatchlist(Result.id, Result.media_type)}
    {:then onWatchlist}
      <AddButton checked={onWatchlist} on:addClicked={AddToList}/>
    {/await}
  {/if}
    <p>{title}</p>
    {#if Result.media_type}
      <SvgIcon src={"images/"+Result.media_type+".svg"} styles={mediaTypeStyles}/>
    {/if}
  </div>
</button>
<style>
.toolbar{
  display: grid;
  grid-template-columns: 16% 68% 16%;
}

.toolbar>p{
  display: inline-block;
  grid-column: 2;
  margin: auto;
}

.resultCard{
  height: auto;
  margin: 1%;
  flex: 1 0 36%;
  max-width: 300px;
  background-color: var(--SecondBackgroundColor);
  outline: none;
  border:none;
  color: var(--FontColor, black);
  border-radius: 10px;
  padding: 0.3rem;
}

.resultCard:hover, .resultCard:focus, .resultCard:active{
  box-shadow: 0px 0px 20px 3px var(--AccentColor);
}

.poster{
  width: 100%;
  height: auto;
  min-height: 26rem;
  cursor: pointer;
}

.placeholder_container{
  background-color: var(--SecondBackgroundColor, grey);
  display: flex;
  justify-content: center;
  flex-direction: column;
}

</style>
