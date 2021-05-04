<script>
import AddButton from './AddButton.svelte'
import SvgIcon from '../../general/SvgIcon.svelte'
import Config from '../../../config';
import {AddToWatchlist, IsOnWatchlist} from '../../../model/TMDbAPI.js'
import {IsLoggedIn} from '../../../stores/userStore.js'
import { createEventDispatcher } from 'svelte';
import { fade } from 'svelte/transition';
import {GetBestImageSize} from "../../../model/dataHelper.js"
import {GetSCSSVars} from "../../../util";

const scssVars = GetSCSSVars();

const dispatch = createEventDispatcher();

export let Result;
export let cardId;
let OnWatchlist = false;
let loading = true;

const imgLoad = e=>{
  let image = e.target
  if(image.src == image.dataset.src){
    loading = false;
    return
  }
  image.src=image.dataset.src
}

IsLoggedIn.subscribe(async (val)=>{
  if(val){
    OnWatchlist = await IsOnWatchlist(Result.id, Result.media_type)
  }})

let placeholderStyles = `
    width:50%;
    height:50%;
    transition: fill 0.3s;
    margin: auto;
`
let mediaTypeStyles = `
    display:block;
    width:30px;
    fill:${scssVars.FontColor};
    transition: fill 0.3s;
    margin: auto;
`

let title = Result.title || Result.original_title || Result.name;

export function GetImageUrls(){
  //Update to get best size for screen size
  let final = GetBestImageSize("poster", RemToPx(21))
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
    <img src={ImageUrl.initial} data-src={ImageUrl.final} alt="" class="poster" class:loading loading="lazy" on:load={imgLoad} />
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
<style lang="scss">
.toolbar{
  display: grid;
  grid-template-columns: 16% 68% 16%;
  width: 100%;
  min-height: 50px;
  &>p{
    display: inline-block;
    grid-column: 2;
    margin: auto;
  }
}

.resultCard{
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: $SecondBackgroundColor;
  outline: none;
  border:none !important;
  color: $FontColor;
  border-radius: 10px;
  padding: 0.3rem;
  margin: 1rem;
  width: 21rem;
  &:hover, &:focus{
    box-shadow: 0px 0px 20px 3px $AccentColor;
  }
}


.poster{
  cursor: pointer;
  height: 30rem;
  transition: filter 0.5s;
  &.loading{
    filter: blur(0.5rem);
  }
}


.placeholder_container{
  background-color: $SecondBackgroundColor;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

@media only screen and (max-width: 750px){
  .poster{
    height: auto;
  }

  .resultCard{
    width: 15rem;
  }
}

</style>
