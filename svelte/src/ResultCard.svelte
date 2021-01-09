<script>
import {Config} from './config.js';
export let Result;

export function GetImageUrl(){
  //Update to get best size for screen size
  return Config.BASE_IMAGE_URL + "original/"+Result.poster_path
}
</script>
<div>
  <img class="poster" src={GetImageUrl()} alt={Result.original_title+" poster"}/>
  <p>{Result.original_title}</p>
</div>
<style>

.poster{
  width: 300px;
  height: 500px;
}

</style>
