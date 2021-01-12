<script>
import AddButton from './AddButton.svelte'
import {Config} from './config.js';
export let Result;

let title = Result.title || Result.original_title || Result.name;

export function GetImageUrl(){
  //Update to get best size for screen size
  return Config.BASE_IMAGE_URL + "original/"+Result.poster_path
}

</script>
<button class="resultCard nonStandard">
  <img class="poster" src={GetImageUrl()} alt={title+" poster"}/>
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
}

</style>
