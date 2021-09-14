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
import {AddToList, GetSCSSVars} from '../../../util'
import Genres from "./Genres.svelte";
import QuickInfoLabel from "./QuickInfoLabel.svelte";
import AddButton from "../ResultList/AddButton.svelte";
import { FeaturedBackground, IsMobile } from "../../../stores/store";

export let media_type;
export let data;
const scss = GetSCSSVars()
var mediaElement;


const getImages = async ()=>{
  const initialImage = data.backdrop_path
  const res = await GetImages(data.id,media_type)
  const OtherImages = res.backdrops.map(bd=>bd.file_path);
  if(!initialImage) return [getLazyImage(res.posters[0].file_path)]
  return [initialImage,...OtherImages].map(path=>getLazyImage(path))
}

const getLazyImage = path => {
  const isDesktop = window.innerWidth > scss.MobileWidth;
  const imageGallaryWidth = window.innerWidth*(isDesktop ? 0.45 : 0.9) 
  let initialSize = GetBestImageSize("backdrop", 0);
  let finalSize = GetBestImageSize("backdrop", imageGallaryWidth)
  return {
    initial:Config.BASE_IMAGE_URL + initialSize + path,
    final:Config.BASE_IMAGE_URL + finalSize + path,
    src:Config.BASE_IMAGE_URL + "original" + path
  }
}

let images;
let loadingImages=true;
getImages().then(i=>{
  images = i
  loadingImages=false
})
console.log(data)
const setBackground = () => {
  if(data.backdrop_path && !$IsMobile){
    FeaturedBackground.update(_=>Config.BASE_IMAGE_URL+"original"+data.backdrop_path)
  }
}
IsMobile.subscribe(_=>setBackground())

setBackground()
</script>

{#if media_type == "movie"}
<div class="mainContainer">
<section class="imagesSlider">
  <ImageSlider {images} useLazy={true} ghost={loadingImages} featureButton={{text:"Watch Trailer",icon:"images/play-filled.svg"}} on:featureclick={()=>mediaElement.ShowTrailer()}/>
</section>
<section class="quickinfo">
  <h1 class="title">{data.name}</h1>
  <QuickInfoLabel label="Release date:">
    <ReleaseDate releaseDates={data.release_dates.results} {media_type}/>
  </QuickInfoLabel>
  <QuickInfoLabel label="Age Rating:">
    <Certification releaseDates={data.release_dates.results} {media_type}/>
  </QuickInfoLabel>
  <QuickInfoLabel label="Genres:">
    <Genres genres={data.genres} {media_type}/>
  </QuickInfoLabel>
  <QuickInfoLabel label="Run Time:">
    <p class="runtime">{data.runtime} minutes</p>
  </QuickInfoLabel>
  <StarRating rating={data.vote_average} ratingCount={data.vote_count} userRating={data.account_states ? data.account_states.rated.value : 0} {media_type} id={data.id} title={data.name}/>
  <p class="synopsis">{data.overview}</p>
  <AddButton on:clicked={AddToList} Result={data} id={"AddButton_"+data.id} compact={false}/>
</section>
<section class="media_section">
  <MediaSection title={data.name} {media_type} id={data.id} bind:this={mediaElement} result={data}/>
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
  <div class="mainContainer">
    <section class="imagesSlider">
      <ImageSlider {images} useLazy={true} ghost={loadingImages} featureButtonText="Watch Trailer"/>
    </section>
    <section class="quickinfo">
      <h1 class="title">{data.name}</h1>
      <!-- <QuickInfoLabel label="Release date:">
        <ReleaseDate releaseDates={data.release_dates.results} {media_type}/>
      </QuickInfoLabel> -->
      <!-- <QuickInfoLabel label="Age Rating:">
        <Certification releaseDates={data.release_dates.results} {media_type}/>
      </QuickInfoLabel> -->
      <QuickInfoLabel label="Genres:">
        <Genres genres={data.genres} {media_type}/>
      </QuickInfoLabel>
      <!-- <QuickInfoLabel label="Run Time:">
        <p class="runtime">{data.runtime} minutes</p>
      </QuickInfoLabel> -->
      <StarRating rating={data.vote_average} ratingCount={data.vote_count} userRating={data.account_states ? data.account_states.rated.value : 0} {media_type} id={data.id} title={data.name}/>
      <p class="synopsis">{data.overview}</p>
      <AddButton on:clicked={AddToList} Result={data} id={"AddButton_"+data.id} compact={false}/>
    </section>
    <section class="media_section">
      <MediaSection title={data.name} {media_type} id={data.id} result={data}/>
    </section>
    <section class="reviews">
      <Reviews id={data.id} {media_type}/>
    </section>
    <section class="suggestions">
      <RelatedResults id={data.id} {media_type}/>
    </section>
  </div>
</div>
{/if}


<style lang="scss">

  div.mainContainer{
    color:$FontColor;
    padding: 1rem;
    margin: 0 0.5rem 0.5rem 0.5rem;
    display: grid;
    grid-template: "quickinfo quickinfo images images images" auto
                   "media media media reviews reviews" auto
                   "suggestions suggestions suggestions suggestions suggestions" auto / 1fr 1fr 1fr 1fr 1fr;
    .imagesSlider{
      grid-area: images;
      max-height: 50vh;
    }
    .quickinfo{
      grid-area: quickinfo;
      margin-right: 1rem;
      display:flex;
      flex-direction: column;
      align-items: baseline;
      .synopsis{
        flex-grow: 1;
      }
    }
    .suggestions{
      grid-area:suggestions;
    }
    .reviews{
      grid-area: reviews;
    }
    .media_section{
      grid-area: media;
      padding-right: 1rem;
    }
  }

  .imagesSlider{
    max-width: 900px;
  }

  .title{
    font-size: $TitleFontSize;
    color:$FontColor;
  }

  @media only screen and (max-width: $LargeWidth){
    div.mainContainer{
      grid-template: "quickinfo quickinfo images images images" auto
                    "media media reviews reviews reviews" auto
                    "suggestions suggestions suggestions suggestions suggestions" auto / 1fr 1fr 1fr 1fr 1fr;
    }
  }

  @media only screen and (max-width: $MediumWidth){
    div.mainContainer{
      grid-template: "quickinfo quickinfo images images images" auto
                    "media reviews reviews reviews reviews" auto
                    "suggestions suggestions suggestions suggestions suggestions" auto / 1fr 1fr 1fr 1fr 1fr;
    }
  }

  @media only screen and (max-width: $MobileWidth){
    div.mainContainer{
      grid-template: "images images images images images" minmax(40vh, 346px)
                     "quickinfo quickinfo quickinfo quickinfo quickinfo" auto
                     "media media media media media" auto
                     "reviews reviews reviews reviews reviews" auto
                     "suggestions suggestions suggestions suggestions suggestions" auto/1fr 1fr 1fr 1fr 1fr;
      .imagesSlider{
        max-height: 100%;
      }
    }

    .media_section{
      padding-right: 0;
    }
    section{
      margin-bottom: 1.5rem;
    }
  }
  
</style>