<script>
import AddButton from './AddButton.svelte'
import SvgIcon from '../../general/SvgIcon.svelte'
import Config from '../../../config';
import {AddToWatchlist, IsOnWatchlist} from '../../../model/TMDbAPI.js'
import {IsLoggedIn} from '../../../stores/userStore.js'
import { createEventDispatcher } from 'svelte';
import { fade } from 'svelte/transition';
import {GetBestImageSize, RemToPx} from "../../../model/dataHelper.js"
import {GetSCSSVars, IsMobile} from "../../../util";
import { push } from 'svelte-spa-router';

const scssVars = GetSCSSVars();

const dispatch = createEventDispatcher();

export let Result;
export let cardId;
export let Loaded = true;
let loading = true;

const imgLoad = e=>{
  let image = e.target
  if(image.src == image.dataset.src){
    loading = false;
    return
  }
  image.src=image.dataset.src
}


let placeholderStyles = `
    width:50%;
    height:50%;
    transition: fill 0.3s;
    margin: auto;
`
let mediaTypeStyles = `
    display:block;
    fill:${scssVars.FontColor};
    transition: fill 0.3s;
    margin: var(--MediaIconPadding, auto 0.25rem);
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

export function LoadResultPage(el){
  alert("Clicked "+ title)
}

export function AddToList(event){
  var checked = event.detail.checked;
  var media_type = Result.media_type || "movie"
  AddToWatchlist(Result.id, media_type, checked)
}

var addButton;

const selectCard = e=>{
  let shouldShowDetailsPage
  try{
    shouldShowDetailsPage = !addButton.container.contains(e.target);
  }catch{
    shouldShowDetailsPage=true
  }
  if(shouldShowDetailsPage){
    push(`/${Result.media_type}/${Result.id}`)
  }
}

</script>
<button class="resultCard nonStandard" id={cardId} transition:fade title={title} on:click={selectCard}>
  {#if Loaded}
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
      <AddButton on:addClicked={AddToList} {Result} bind:this={addButton}/>
    {/if}
    <p>{title}</p>
    {#if Result.media_type}
      <SvgIcon src={"images/"+Result.media_type+".svg"} styles={mediaTypeStyles}/>
    {/if}
  </div>
  {/if}
</button>
<style lang="scss">
.toolbar{
  --MediaIconPadding: auto 0.5rem;
  display: grid;
  grid-template-columns: 16% 68% 16%;
  width: 100%;
  height: 50px;
  flex-grow:1;
  &>p{
    grid-column: 2;
    margin: auto;
    display: block;
    display: -webkit-box;
    max-height: 2.6em;
    line-height: 1.3em;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

:root{
  --cardWidth: 21rem;
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
  width: var(--cardWidth, 21rem);
  height: 35.225rem;
  &:hover, &:focus{
    box-shadow: 0px 0px 20px 3px $AccentColor;
  }
}


.poster{
  cursor: pointer;
  min-height: calc(21rem * (513 / 342));
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

@media only screen and (max-width: $MobileWidth){
  :root {
    --cardWidth: 10rem;
  }

  .toolbar{
    --MediaIconPadding: auto 0.25rem;
  }

  .poster{
    max-width: 100%;
    height: calc(10rem * (513 / 342));
    min-width: none;
    min-height: 0;
  }

  .resultCard{
    width: var(--cardWidth);
    height: 16.77rem;
    margin: 0.4rem;
  }
}

</style>
