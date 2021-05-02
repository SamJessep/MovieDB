<script>
import AddButton from './AddButton.svelte'
import SvgIcon from '../../general/SvgIcon.svelte'
import Config from '../../../config';
import {AddToWatchlist, IsOnWatchlist} from '../../../model/TMDbAPI.js'
import {IsLoggedIn} from '../../../stores/userStore.js'
import { createEventDispatcher } from 'svelte';
import { fade } from 'svelte/transition';
import {GetBestImageSize} from "../../../model/dataHelper.js"

const dispatch = createEventDispatcher();

export let Result;
export let cardId;
let OnWatchlist = false;

let poster;

const imgLoad = e=>{
  let image = e.target
  image.src=image.dataset.src
  image.classList.remove("loading")
}

IsLoggedIn.subscribe(async (val)=>{
  if(val){
    OnWatchlist = await IsOnWatchlist(Result.id, Result.media_type)
  }})

let placeholderStyles = `
  svg#SVGID{
    width:50%;
    height:50%;
    transition: fill 0.3s;
    margin: auto;
    fill:var(--FontColor);
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

export function GetImageUrls(){
  //Update to get best size for screen size
  let final = GetBestImageSize("poster", RemToPx(22))
  let initial = GetBestImageSize("poster", 0);
  return {
    initial:Config.BASE_IMAGE_URL + initial + "/"+Result.poster_path,
    final:Config.BASE_IMAGE_URL + final + "/"+Result.poster_path
  }
}
const ImageUrl = GetImageUrls()

function RemToPx(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
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
<button class="resultCard nonStandard" id={cardId} transition:fade>
    {#if Result.poster_path}
    <img src={ImageUrl.initial} data-src={ImageUrl.final} alt="" class="poster loading" loading="lazy" on:load={imgLoad} />
      <!-- <div style={posterBackgroundStyles} class="poster"/> -->
    {:else}
      <div class="placeholder_container poster" on:click={LoadResultPage}>
          <SvgIcon src="images/warning.svg" styles={placeholderStyles}/>
          <small>No Poster</small>
      </div>
    {/if}
  <div class='toolbar'>
    {#if $IsLoggedIn}
      <AddButton checked={OnWatchlist} on:addClicked={AddToList}/>
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
  width: 100%;
  min-height: 50px;
}

.toolbar>p{
  display: inline-block;
  grid-column: 2;
  margin: auto;
}

.resultCard{
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: var(--SecondBackgroundColor);
  outline: none;
  border:none;
  color: var(--FontColor, black);
  border-radius: 10px;
  padding: 0.3rem;
  margin: 1rem;
  width: 22rem;
}

.resultCard:hover, .resultCard:focus, .resultCard:active{
  box-shadow: 0px 0px 20px 3px var(--AccentColor);
}

.poster{
  width: 100%;
  height: 30rem;
  transition: filter 0.5s;
}

.poster.loading{
  filter:blur(0.5rem);
}

.placeholder_container{
  background-color: var(--SecondBackgroundColor, grey);
  display: flex;
  justify-content: center;
  flex-direction: column;
}

</style>
