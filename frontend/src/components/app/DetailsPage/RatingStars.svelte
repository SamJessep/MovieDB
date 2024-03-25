<script>
  import { createEventDispatcher, onMount } from "svelte";
  import {Rate} from "../../../model/TMDbAPI"
  import {User, IsLoggedIn} from '../../../stores/userStore'
  import { PostToast, PromptLogin } from "../../../util";
  import SvgIcon from "../../general/SvgIcon.svelte";
  import tippy from "tippy.js"
  
  export let rating;
  export let id;
  export let media_type;
  export let title;
  export let userRating = 0;
  export let ratingEnabled=true
  export let starSize = "3rem"
  export let fullscreen = false;

  const dispatch = createEventDispatcher()
  let ratingElement
  let ratingElementUser
  $:showUserRating(userRating)
  const normalStyles = `
  max-width:10vw;
  max-height:10vw;
  `
  
  const fullScreenStyles = `
  
  `
  const styles = `
  min-width:${starSize};
  min-height:${starSize};
  padding:0;
  margin:0;
  `+ (fullscreen ? fullScreenStyles : normalStyles);

  onMount(()=>{
    ratingElement.style.clipPath=`inset(0% ${100-((rating/10)*100)}% 0% 0%)`;
    tippy("[data-tippy-content]");
    showUserRating(userRating)
  })
  
  const previewRating = star =>{
    if(!ratingEnabled) return
    ratingElementUser.style.clipPath=`inset(0% ${100-((star/5)*100)}% 0% 0%)`;
  }
  
  const stopPreview = ()=>{
    if(!ratingEnabled) return
    ratingElementUser.style.clipPath=`inset(0% ${100-((userRating/5)*100)}% 0% 0%)`;
  }
  
  const rateElement = async rating=>{
    if(!ratingEnabled) return
    if(!$IsLoggedIn) return PromptLogin()
    try{
      const res = await Rate(id,$User.session_id,rating,media_type)
      if(res.success){
        PostToast(`You rated ${title} a ${rating}/5`, {duration:8000})
        userRating = rating;
        showUserRating(userRating)
        dispatch("submit", {rating:rating})
        
      }else{ throw("Rating failed")}
    }catch(e){
      console.error(e)
      PostToast("Somthing went wrong", {theme:"error"})
    }
  }

  export const showUserRating = rating => {
    if(!ratingElementUser) return
    ratingElementUser.style.clipPath=`inset(0% ${100-((rating/5)*100)}% 0% 0%)`;
  }
  
  </script>
  
  <div class="rating_wrapper" on:click={e=>dispatch("click")}>
    <div class="rating_container" on:mouseleave={()=>stopPreview()} class:fullscreen>
      <div class="bg star_container" class:LoggedIn={$IsLoggedIn}>
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
    
      <div class="fg-user star_container" bind:this={ratingElementUser} class:voted={userRating!=0}>
        {#each [1,2,3,4,5] as rating}
        <span>
          <SvgIcon src="images/star_filled.svg" {styles}/>
        </span>
        {/each}
      </div>
    </div>
  </div>
  <svelte:options accessors={true}/>
  
  <style lang="scss">
  .star_container{
    display: flex;
    flex-wrap: nowrap;
    height: 100%;
    span{
      width: min-content;
    }
  }
  .fullscreen div.star_container span{
    width:100%;
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
    cursor: not-allowed;
    &.LoggedIn{
      cursor: pointer;
    }
  }
  
  .rating_container{
    position: relative;
    width: 100%;
  }
  
  .rating_wrapper{
    display: inline-flex;
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