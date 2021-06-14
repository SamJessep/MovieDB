<script>
import { onMount } from "svelte";
import {Rate} from "../../../model/TMDbAPI"
import {User} from '../../../stores/userStore'

import SvgIcon from "../../general/SvgIcon.svelte";

export let rating;
export let count;
export let id;
export let media_type;
let ratingElement
let ratingElementUser
const styles = `
width:3rem;
height:3rem;
padding:0;
margin:0;
`
onMount(()=>{
  ratingElement.style.width = (rating/10)*100+"%"
})

const previewRating = star =>{
  ratingElement.style.width = (star/5)*100+"%"
}

const stopPreview = ()=>{
  ratingElement.style.width = (rating/10)*100+"%"
}

const rateElement = async rating=>{
  const res = await Rate(id,$User.session_id,rating,media_type)
  if(res.success){
    //TODO: Create toasts
    alert("you rated this "+rating+"/5")
    ratingElementUser.style.width=(rating/5)*100+"%";
    console.log(ratingElementUser.style.width)
  }else{
    alert("Somthing went wrong")
  }
}
</script>

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

  <div class="fg-user" bind:this={ratingElementUser}>
    {#each [1,2,3,4,5] as rating}
    <span>
      <SvgIcon src="images/star_filled.svg" {styles}/>
    </span>
    {/each}
  </div>
</div>

<style lang="scss">

.fg,.fg-user{
  position: absolute;
  left:0;
  top:0;
  color:$RatingGood;
  width: 0;
  overflow: hidden;
  height: 3rem;
  white-space: nowrap;
}

.fg-user{
  color: #ffa60083;
  pointer-events: none;
}

.bg{
  color:$RatingBlank;
}

.rating_container{
  position: relative;
  width: fit-content;
}
</style>