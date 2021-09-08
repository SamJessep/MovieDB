<script>
import AddButton from './AddButton.svelte'
import SvgIcon from '../../general/SvgIcon.svelte'
import Config from '../../../config';
import {IsLoggedIn} from '../../../stores/userStore.js'
import { onMount } from 'svelte';
import { fade } from 'svelte/transition';
import {GetBestImageSize} from "../../../model/dataHelper.js"
import {AddToList, GetSCSSVars, PostToast} from "../../../util";
import { push } from 'svelte-spa-router';
import AltMenu from './AltMenu.svelte';

var poster_container
onMount(()=>{
  if(poster_container){
    const maxPosterWidth = poster_container.getBoundingClientRect().width > 0 ? poster_container.getBoundingClientRect().width : window.innerWidth/2
    ImageUrl =  GetImageUrls(maxPosterWidth)
  } 
})
const scssVars = GetSCSSVars();

export let Result;
export let cardId;
export let Loaded = true;
export let page = null;
export let className = ""
let loading = true;

var toolbarElement;

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
    width:100%;
    height:100%;
`

let title = Result.title || Result.original_title || Result.name;

export function GetImageUrls(max_width){
  
  //Update to get best size for screen size
  let final = GetBestImageSize("poster", max_width)
  let initial = GetBestImageSize("poster", 0);
  return {
    initial:Config.BASE_IMAGE_URL + initial + "/"+Result.poster_path,
    final:Config.BASE_IMAGE_URL + final + "/"+Result.poster_path
  }
}
var ImageUrl

export function LoadResultPage(el){
  alert("Clicked "+ title)
}


const selectCard = e=>{
  let shouldShowDetailsPage
  try{
    shouldShowDetailsPage = !toolbarElement.contains(e.target);
  }catch{
    shouldShowDetailsPage=true
  }
  if(shouldShowDetailsPage){
    push(`/${Result.media_type}/${Result.id}`)
  }
}

</script>
<button class={"resultCard nonStandard "+className} id={cardId} transition:fade title={title} on:click={selectCard} data-page={page}>
  <AltMenu/>
  <div class="card-content">
    {#if Loaded}
    <div class="poster-container" bind:this={poster_container}>
      {#if Result.poster_path}
        {#if ImageUrl != undefined}
          <img src={ImageUrl.initial} data-src={ImageUrl.final} alt="" class="poster aspect-ratio-box-inside" class:loading loading="lazy" on:load={imgLoad} />
        {/if}
      {:else}
        <div class="placeholder_container poster aspect-ratio-box-inside" on:click={LoadResultPage}>
            <SvgIcon src="images/warning.svg" styles={placeholderStyles}/>
            <small>No Poster</small>
        </div>
      {/if}
      
    </div>
    <div class='toolbar' bind:this={toolbarElement}>
      {#if $IsLoggedIn}
        <AddButton on:clicked={AddToList} {Result} id={"AddButton_"+Result.id}/>
      {/if}
      <p>{title}</p>
      <div class="mediaIcon">
        {#if Result.media_type}
          <SvgIcon src={"images/"+Result.media_type+".svg"} styles={mediaTypeStyles}/>
        {/if}
      </div>
    </div>
    {/if}
  </div>
</button>
<style lang="scss">
.poster-container{
  height: 0;
  overflow: hidden;
  padding-top:  513px / 342px * 100%;
  position: relative;
  width:100%;
}

.aspect-ratio-box-inside {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.toolbar{
  --MediaIconPadding: auto 0.5rem;
  display: grid;
  grid-template-columns: 16% 68% 16%;
  width: 100%;
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
  & .mediaIcon{
    margin: 0.5rem;
  }
}

:root{
  --cardWidth: 21rem;
}

.card-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 0;
  padding:0;
}

.resultCard{
  position: relative;
  display: inline;

  background-color: $SecondBackgroundColor;
  outline: none;
  border:none !important;
  color: $FontColor;
  border-radius: 10px;
  margin: 1rem;
  width: var(--cardWidth, 21rem);
  transition: box-shadow 0.5s, transform 0.25s;
  box-shadow: 0px 4px 4px black;
  &:hover, &:focus{
    box-shadow: 7px 12px 4px 0px black;
    transform: matrix(1, 0, 0, 1, -2, 0);
  }
  &:focus-visible{
    background-color: darken($SelectedColor, 0%);
  }
}


.poster{
  cursor: pointer;
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
    & .mediaIcon{
      margin: 0.25rem;
    }
  }

  .resultCard{
    width: var(--cardWidth);
    height: 16.77rem;
    margin: 0.4rem;
  }
}

</style>
