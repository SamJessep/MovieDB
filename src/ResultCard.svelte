<script>
import AddButton from './AddButton.svelte'
import SvgIcon from './SvgIcon.svelte'
import {Config} from './config.js';
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

let title = Result.title || Result.original_title || Result.name;

export function GetImageUrl(){
  //Update to get best size for screen size
  return Config.BASE_IMAGE_URL + "original/"+Result.poster_path
}

export function LoadResultPage(el){
  alert("Clicked "+ title)
}

</script>
<button class="resultCard nonStandard">
  {#if Result.poster_path}
    <img class="poster" src={GetImageUrl()} alt={title+" poster"} on:click={LoadResultPage}/>
  {:else}
    <div class="placeholder_container poster">
        <SvgIcon src="images/warning.svg" styles={placeholderStyles}/>
        <small>No Poster</small>
    </div>
  {/if}
  <div class='toolbar'>
    <AddButton/>
    <p>{title}</p>
  </div>
</button>
<style>
.toolbar{
  display: flex;
}

.toolbar>p{
  display: inline-block;
  flex-grow: 1;
}

.resultCard{
  height: auto;
  margin: 1%;
  flex: 1 0 36%;
  max-width: 300px;
  background-color: transparent;
  outline: none;
  border:none;
  color: var(--FontColor, black);
}

.resultCard:hover, .resultCard:focus, .resultCard:active{
  box-shadow: 0px 0px 20px 3px var(--AccentColor);
}

.poster{
  width: 100%;
  height: auto;
  min-height: 26rem;
}

.placeholder_container{
  background-color: var(--SecondBackgroundColor, grey);
  display: flex;
  justify-content: center;
  flex-direction: column;
}

</style>
