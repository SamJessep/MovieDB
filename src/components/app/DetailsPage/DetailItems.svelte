<script>
import ImageSlider from "../../general/ImageSlider.svelte";
import Config from "../../../config"
import {RemToPx, GetBestImageSize} from "../../../model/dataHelper"
import {GetImages} from "../../../model/TMDbAPI"
import Certification from "./Certification.svelte";
import StarRating from "./StarRating.svelte";
import ReleaseDate from "./ReleaseDate.svelte";
import RelatedResults from "./RelatedResults.svelte";
import Reviews from "./Reviews.svelte";
import MediaSection from "./media/MediaSection.svelte";
import {GetSCSSVars} from '../../../util'

export let media_type;
export let data;
const scss = GetSCSSVars()



const getImages = async ()=>{
  const initialImage = data.backdrop_path
  const res = await GetImages(data.id,media_type)
  const OtherImages = res.backdrops.map(bd=>bd.file_path);
  return [initialImage,...OtherImages].map(path=>getLazyImage(path))
}

const getLazyImage = path => {
  const isDesktop = window.innerWidth > scss.MobileWidth;
  const imageGallaryWidth = window.innerWidth*(isDesktop ? 0.45 : 0.9) 
  let initialSize = GetBestImageSize("backdrop", 0);
  let finalSize = GetBestImageSize("backdrop", imageGallaryWidth)
  return {
    initial:Config.BASE_IMAGE_URL + initialSize + path,
    final:Config.BASE_IMAGE_URL + finalSize + path
  }
}

let images;
let loadingImages=true;
getImages().then(i=>{
  images = i
  loadingImages=false
})
</script>

{#if media_type == "movie"}
<div class="mainContainer">
<section class="imagesSlider">
  <ImageSlider {images} useLazy={true} ghost={loadingImages}/>
</section>
<section class="quickinfo">
  <h1 class="title">{data.title}</h1>
  <ReleaseDate releaseDates={data.release_dates.results} {media_type}/>
  <Certification releaseDates={data.release_dates.results} {media_type}/>
  <p class="runtime">{data.runtime} minutes</p>
  <StarRating rating={data.vote_average} ratingCount={data.vote_count} {media_type} id={data.id}/>
  <p class="synopsis">{data.overview}</p>
</section>
<section class="media_section">
  <MediaSection title={data.title} {media_type} id={data.id}/>
</section>
<section class="reviews">
  <Reviews id={data.id} {media_type}/>
</section>
<section class="suggestions">
  <RelatedResults id={data.id} {media_type}/>
</section>
</div>
{:else if media_type == "tv"}
<div>
  <!-- <ImageSlider {images} useLazy={true}/> -->
  <h1>{data.name}</h1>
  <!-- <h1>{data.runtime}</h1> -->
</div>
{/if}


<style lang="scss">
  div.mainContainer{
    color:$FontColor;
    padding: 1rem;
    margin: 0 0.5rem 0.5rem 0.5rem;
    display: grid;
    grid-template: "quickinfo quickinfo images images images" auto
                   "media media media media media" auto
                   "reviews reviews reviews reviews reviews" auto
                   "suggestions suggestions suggestions suggestions suggestions" auto / 1fr 1fr 1fr 1fr 1fr;
    .imagesSlider{
      grid-area: images;
      max-height: 50vh;
    }
    .quickinfo{
      grid-area: quickinfo;
    }
    .suggestions{
      grid-area:suggestions;
    }
    .reviews{
      grid-area: reviews;
    }
    .media_section{
      grid-area: media;
    }
  }

  .imagesSlider{
    max-width: 900px;
  }

  .title{
    font-size: $TitleFontSize;
    color:$FontColor;
  }

  @media only screen and (max-width: $MobileWidth){
    div.mainContainer{
      grid-template: "images images images images images" 40vh
                     "quickinfo quickinfo quickinfo quickinfo quickinfo" auto
                     "media media media media media" auto
                     "reviews reviews reviews reviews reviews" auto
                     "suggestions suggestions suggestions suggestions suggestions" auto / 1fr 1fr 1fr 1fr 1fr;
    }
  }
  
</style>