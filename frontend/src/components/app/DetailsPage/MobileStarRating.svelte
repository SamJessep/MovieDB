<script>
import { createEventDispatcher } from "svelte";
import { DeleteRating } from "../../../model/TMDbAPI";
import { User } from "../../../stores/userStore";
import { PostToast } from "../../../util";

  import RatingStars from "./RatingStars.svelte";
  export let rating;
  export let id;
  export let media_type;
  export let ratingCount;
  export let title;
  export let userRating = 0;
  
  const dispatch = createEventDispatcher()
  const RatingSelected = e =>{
    userRating = Number(e.detail.rating)
    dispatch('submit', {rating:e.detail.rating})
  }

  const ClearRating = async () => {
    const res = await DeleteRating(id,$User.session_id,media_type)
    if(res.success){
      PostToast("Your rating has been removed", {duration:8000})
      dispatch("clear")
    }else{
      PostToast("Somthing went wrong", {theme:"error"})
    }
  }
  </script>

  <div class="rating_wrapper">
    <RatingStars {...$$props} fullscreen={true} on:submit={RatingSelected}/>
    <span data-tippy-content={"this "+(media_type=="movie"?"movie":"tv show")+" has "+ratingCount+" ratings"} tabindex="0" class="rating_count">{ratingCount}</span>
    <div class="controls">
      {#if userRating != 0}
      <button on:click={ClearRating}>Clear Rating</button>
      {/if}
    </div>
  </div>
  
  <style lang="scss">
    div{
      color:$FontColor;
    }
  .rating_wrapper{
    margin-top:3rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    & .rating_count{
      margin-left: 0.5rem;
      text-decoration: underline $AccentColor;
      cursor: help;
    }
  }


  .controls{
    margin-top: 1rem;
    &>button{
      @include darkBtnOutline;
    }
  }
  </style>