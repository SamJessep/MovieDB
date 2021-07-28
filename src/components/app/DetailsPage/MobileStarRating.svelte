<script>
  import { createEventDispatcher, onMount } from "svelte";
  import {Rate} from "../../../model/TMDbAPI"
  import {User, IsLoggedIn} from '../../../stores/userStore'
  import { PostToast } from "../../../util";
  import SvgIcon from "../../general/SvgIcon.svelte";
  import tippy from "tippy.js"
import Modal from "../../general/Modal.svelte";
import { ModalView } from "../../../stores/store";
  
  export let rating;
  export let id;
  export let media_type;
  export let ratingCount;
  export let title;

  const dispatch = createEventDispatcher()
  
  let voted = false;
  let ratingElement
  let ratingElementUser
  let userRating = 0;
  const styles = `
  min-width:1.5rem;
  min-height:1.5rem;
  padding:0;
  margin:0;
  `
  onMount(()=>{
    ratingElement.style.clipPath=`inset(0% ${100-((rating/10)*100)}% 0% 0%)`;
    tippy("[data-tippy-content]");
  })
  
  const previewRating = star =>{
    ratingElementUser.style.clipPath=`inset(0% ${100-((star/5)*100)}% 0% 0%)`;
  }
  
  const stopPreview = ()=>{
    ratingElementUser.style.clipPath=`inset(0% ${100-((userRating/5)*100)}% 0% 0%)`;
  }
  
  const rateElement = async rating=>{
    if(!$IsLoggedIn) return alert("You need to be logged in to rate movies")
    try{
      const res = await Rate(id,$User.session_id,rating,media_type)
      if(res.success){
        PostToast(`You rated ${title} a ${rating}/5`, {duration:8000})
        voted = true;
        userRating = rating;
        ratingElementUser.style.clipPath=`inset(0% ${100-((rating/5)*100)}% 0% 0%)`;
        dispatch("submit", {rating:rating})
        ModalView.set({})
      }else{ throw("Rating failed")}
    }catch(e){
      console.error(e)
      PostToast("Somthing went wrong", {theme:"error"})
    }
  }
  
  </script>
  
  <div class="rating_wrapper">
    <div class="rating_container" on:mouseleave={()=>stopPreview()}>
      <div class="bg star_container">
        {#each [1,2,3,4,5] as rating}
        <span on:mouseover={()=>previewRating(rating)} on:click={()=>rateElement(rating)}>
          <SvgIcon src="images/star_outline.svg" {styles}/>
        </span>
        {/each}
      </div>
      
      
      <div class="fg star_container" bind:this={ratingElement}>
        {#each [1,2,3,4,5] as rating}
        <span on:mouseover={()=>previewRating(rating)} on:click={()=>rateElement(rating)}>
          <SvgIcon src="images/star_filled.svg" {styles}/>
        </span>
        {/each}
      </div>
    
      <div class="fg-user star_container" bind:this={ratingElementUser} class:voted>
        {#each [1,2,3,4,5] as rating}
        <span>
          <SvgIcon src="images/star_filled.svg" {styles}/>
        </span>
        {/each}
      </div>
    </div>
    <span data-tippy-content={"this "+(media_type=="movie"?"movie":"tv show")+" has "+ratingCount+" ratings"} tabindex="0">{ratingCount}</span>
    <div class="controls">
      <button>Clear Rating</button>
    </div>
  </div>
  
  <style lang="scss">
  .star_container{
    display: flex;
    flex-wrap: nowrap;
    height: 100%;
    span{
      width: 100%;
    }
  }

  .bg, .fg, .fg-user{
    transition: clip-path 0.2s;
  }
  
  .fg,.fg-user{
    position: absolute;
    left:0;
    top:0;
    color:$RatingGood;
    clip-path: inset(0% 100% 0% 0%);
    overflow: hidden;
    white-space: nowrap;
    pointer-events: none;
  }
  
  .fg-user{
    color: $RatingUser;
    filter: opacity(25%);
    &.voted{
      filter: opacity(50%);
    }
  }
  
  .bg{
    color:$RatingBlank;
    cursor: pointer;
  }
  
  .rating_container{
    position: relative;
    width: 100%;
  }
  
  .rating_wrapper{
    margin-top:3rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    &>span{
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