<script>
import { IsMobile, ModalView } from "../../../stores/store";
import { IsLoggedIn } from "../../../stores/userStore";
import MobileStarRating from "./MobileStarRating.svelte";
import RatingStars from "./RatingStars.svelte";



export let rating;
export let userRating = 0;
export let id;
export let media_type;
export let ratingCount;
export let title;
let isMobile = false;
IsMobile.subscribe(mobile=>isMobile=mobile)

const showMobileRater = ()=>{
  if(!$IsLoggedIn) return alert("You need to be logged in to rate movies")
  if(!isMobile) return
  ModalView.set({
    component:MobileStarRating,
    props:{
      ...$$props,
      userRating:userRating
    },
    events:{
      submit:(e)=>{
        if(e.detail.rating){
          userRating = Number(e.detail.rating)
          ModalView.set({})
        }
      },
      clear:()=>{
        userRating=0
        ModalView.set({})
      }
    },
    options:{
      title:"Rate this "+media_type == "movie" ? "movie" : "TV show"
    }
  })
}
</script>

<div class="starContainer">
  <RatingStars
    on:click={showMobileRater}
    ratingEnabled={!isMobile}
    {rating}
    bind:userRating={userRating}
    {id}
    {media_type}
    {title}
  />
  <span data-tippy-content={"this "+(media_type=="movie"?"movie":"tv show")+" has "+ratingCount+" ratings"} tabindex="0">{ratingCount}</span>
</div>

<style lang="scss">
.starContainer{
  display: flex;
  align-items: center;
  &>span{
    margin-left: 0.5rem;
    text-decoration: underline $AccentColor;
    cursor: help;
  }
}
</style>