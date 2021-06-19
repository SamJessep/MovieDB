<script>
import { onMount } from "svelte";
import {Rate} from "../../../model/TMDbAPI"
import {User, IsLoggedIn} from '../../../stores/userStore'

import SvgIcon from "../../general/SvgIcon.svelte";

export let rating;
export let id;
export let media_type;
export let ratingCount;

let voted = false;
let ratingElement
let ratingElementUser
let userRating = 0;
const styles = `
width:min(5vw,3rem);
height:min(5vw,3rem);
min-width:1.5rem;
min-height:1.5rem;
padding:0;
margin:0;
`

onMount(()=>{
  ratingElement.style.width = (rating/10)*100+"%"
})

const previewRating = star =>{
  ratingElementUser.style.width = (star/5)*100+"%"
}

const stopPreview = ()=>{
  ratingElementUser.style.width = (userRating/5)*100+"%"
}

const rateElement = async rating=>{
  if(!$IsLoggedIn) return alert("You need to be logged in to rate movies")
  const res = await Rate(id,$User.session_id,rating,media_type)
  if(res.success){
    //TODO: Create toasts
    alert("you rated this "+rating+"/5")
    voted = true;
    userRating = rating;
    ratingElementUser.style.width=(rating/5)*100+"%";
  }else{
    alert("Somthing went wrong")
  }
}
</script>

<div class="rating_wrapper">
  <div class="rating_container" on:mouseleave={()=>stopPreview()}>
    <div class="bg">
      {#each [1,2,3,4,5] as rating}
      <span on:mouseover={()=>previewRating(rating)} on:click={()=>rateElement(rating)}>
        <SvgIcon src="images/star_outline.svg" {styles}/>
      </span>
      {/each}
    </div>
    
    
    <div class="fg" bind:this={ratingElement}>
      {#each [1,2,3,4,5] as rating}
      <span on:mouseover={()=>previewRating(rating)} on:click={()=>rateElement(rating)}>
        <SvgIcon src="images/star_filled.svg" {styles}/>
      </span>
      {/each}
    </div>
  
    <div class="fg-user" bind:this={ratingElementUser} class:voted>
      {#each [1,2,3,4,5] as rating}
      <span>
        <SvgIcon src="images/star_filled.svg" {styles}/>
      </span>
      {/each}
    </div>
  </div>
  <span title={"this "+(media_type=="movie "?"movie":"tv show")+" has "+ratingCount+" ratings"}>{ratingCount}</span>

</div>

<style lang="scss">

.bg, .fg, .fg-user{
  transition: width 0.2s;
}

.fg,.fg-user{
  position: absolute;
  left:0;
  top:0;
  color:$RatingGood;
  width: 0;
  overflow: hidden;
  height: 3rem;
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
  width: fit-content;
}

.rating_wrapper{
  display: flex;
  align-items: center;
  &>span{
    margin-left: 0.5rem;
    text-decoration: underline $AccentColor;
    cursor: help;
  }
}
</style>