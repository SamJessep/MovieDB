<script>
import ImageSlider from "../../general/ImageSlider.svelte";
import Config from "../../../config"
import {RemToPx, GetBestImageSize} from "../../../model/dataHelper"
import {GetImages} from "../../../model/TMDbAPI"
import Certification from "./Certification.svelte";
import StarRating from "./StarRating.svelte";

export let media_type;
export let data;
console.log(data)



const getImages = async ()=>{
  const initialImage = data.backdrop_path
  const res = await GetImages(data.id,media_type)
  const OtherImages = res.backdrops.map(bd=>bd.file_path);
  console.log(OtherImages)
  return [initialImage,...OtherImages].map(path=>getLazyImage(path))
}

const getLazyImage = path => {
  let initialSize = GetBestImageSize("backdrop", 0);
  let finalSize = GetBestImageSize("backdrop", RemToPx(10000))
  return {
    initial:Config.BASE_IMAGE_URL + initialSize + path,
    final:Config.BASE_IMAGE_URL + finalSize + path
  }
}

</script>

{#if media_type == "movie"}
<section>
  {#await getImages()}
    <h1>LOADING IMAGES</h1>  
  {:then images} 
    <ImageSlider {images} useLazy={true}/>
  {/await}
<div class="quickinfo">
  <h1 class="title">{data.title}</h1>
  <h2>{data.runtime} minutes</h2>
  <Certification releaseDates={data.release_dates.results} {media_type}/>
  <StarRating rating={data.vote_average} ratings={data.vote_count} {media_type} id={data.id}/>
  <h2>{data.runtime} minutes</h2>
</div>
</section>
{:else if media_type == "tv"}
<section>
  <!-- <ImageSlider {images} useLazy={true}/> -->
  <h1>{data.name}</h1>
  <!-- <h1>{data.runtime}</h1> -->
</section>
{/if}


<style lang="scss">
  section{
    color:$FontColor;
    margin: 0 0.5rem 0.5rem 0.5rem;
    display: grid;
    grid-template-rows: 50vh 5vh;
    grid-template-areas: "hero"
                         "quickinfo";
    &:first-child{
      grid-area: hero;
    }
    .quickinfo{
      grid-area: quickinfo;
    }
  }

  .title{
    font-size: $TitleFontSize;
    color:$FontColor;
  }
</style>