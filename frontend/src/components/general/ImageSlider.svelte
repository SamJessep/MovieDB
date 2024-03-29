<script>
import LoadingIcon from "../app/ResultList/LoadingIcon.svelte";
import SvgIcon from "./SvgIcon.svelte";
import {fade} from 'svelte/transition'
import { createEventDispatcher, onMount } from "svelte";
import { ModalView } from "../../stores/store";
import ExpandedImage from "./ExpandedImage.svelte";
const dispatch = createEventDispatcher()

export let images=[]
export let useLazy=false;
export let ghost = false;
export let featureButton;
let activeImageIndex = 0;
let previewContainer;

const control_btn_styles = `
  width: 2rem;
  height: 2rem;
  transition: color 0.2s;`

// Swipe Variables
var swipeElement
var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
  evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];                                      
  xDown = firstTouch.clientX;                                      
  yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(evt) {
  if ( ! xDown || ! yDown ) {
    return;
  }
  
  var xUp = evt.touches[0].clientX;                                    
  var yUp = evt.touches[0].clientY;
  
  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;
  
  if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
    if ( xDiff > 0 ) {
      imgNext()
    } else {
      imgBack()
    }                                                                
  }
  /* reset values */
  xDown = null;
  yDown = null;                                             
};

onMount(()=>{
  swipeElement.addEventListener('touchstart', handleTouchStart, {passive: true});
  swipeElement.addEventListener('touchmove', handleTouchMove, {passive: true});
})

const removeDuplicateImages = ()=>{
  let imgIndex = 0;
  while(images[imgIndex]!=undefined){
    const i1 = images[imgIndex];
    const matches = images.filter(i2=>i2.initial==i1.initial)
    if(matches.length>1){
      images.splice(imgIndex,1);
    }
    imgIndex++;
  }

}
$:{
  if(useLazy && !ghost){
  removeDuplicateImages()
  images = images.map(i=>{
    i.loaded = false;
    return i;
  })
}
}

const imgLoad = e=>{
  let image = e.target
  if(image.src == image.dataset.src){
    image.classList.remove("loading")
    images.find(i=>i.final === image.src).loaded=true;
    return
  }
  image.src=image.dataset.src
}

const selectImage = index=>{
  const scrollOptions = {
    behavior: "smooth",
    block:"end"
  }
  activeImageIndex = index
  previewContainer.querySelectorAll(".preview_nav button")[index].scrollIntoView(scrollOptions)
}

const imgNext = ()=>{
  const newIndex = activeImageIndex+1 < images.length ?
   activeImageIndex+1 :
   0;
  selectImage(newIndex)
}

const imgBack = ()=>{
  const newIndex = activeImageIndex-1 >= 0 ?
    activeImageIndex-1 :
    images.length-1;
  selectImage(newIndex)
}

const handleImageSwipe = ({detail}) =>{
  const potentialIndex = detail.index + detail.change
  const newIndex = potentialIndex >= images.length ? 0 : potentialIndex < 0 ? images.length-1 : potentialIndex
  ExpandImage(images[newIndex].src, newIndex)
}

const ExpandImage = (src, index)=>{
  ModalView.set({
      component:ExpandedImage,
      props:{
        src: src,
        index: index,
        btnStyles:control_btn_styles,
        totalImages:images.length
      },
      events:{
        submit:handleImageSwipe
      },
      options:{useTitle:false, singleView:true}
    }) 
}
</script>
<div class="image_slider_container" class:ghost>
  {#if featureButton}
    <button class="featureButton" on:click={()=>dispatch("featureclick")} alt={featureButton.alt}>
    <SvgIcon src={featureButton.icon}/>
      {featureButton.text}
    </button>
  {/if}  
  <button class="controls back" on:click={imgBack} aria-label="previous image">
    <SvgIcon src="images/chevron-left.svg" styles={control_btn_styles}/>
  </button>
  <div class="active_image_container" class:ghost>
    {#if ghost}
    <div class="loading_container">
      <LoadingIcon Message="Fetching images"/>
    </div>
    {/if}
    <div class="image_container" bind:this={swipeElement}>
    {#each images as image,index}
      {#if useLazy}
        <img 
          src={image.initial} 
          data-src={image.final} 
          alt={index == 0 ? "main image" : "image"+index} 
          class:loading={!image.loaded}
          class:active={activeImageIndex == index}
          loading={index>1?"lazy":"eager"} 
          on:load={imgLoad}
          on:click={()=>ExpandImage(image.src, index)}
        />
      {:else}
        <img src={image} alt={"image"+index}/>
      {/if}
      {:else}
      <span style="display:flex; justify-content: center; align-items: center;">
        No Images
      </span>
    {/each}
    </div>
  </div>
  <button class="controls next" on:click={imgNext} aria-label="next image">
    <SvgIcon src="images/chevron-left.svg" styles={control_btn_styles} attributes={[{name:"transform", value:"rotate(180)"}]}/>
  </button>
  <div class="preview_nav" bind:this={previewContainer}>
    {#if ghost}
      {#each [1,2,3,4,5,6,7,8] as previews}
      <div class:ghost></div>
      {/each}
    {/if}
    {#each images as image,index}
    <button 
      on:click={()=>selectImage(index)} 
      style={`background-image: url(${useLazy ? image.initial : image})`} 
      class:active={activeImageIndex==index}
      aria-label={"image "+index}
    />
    {/each}
  </div>
</div>

<svelte:window on:keydown={(e)=>{
  const changeDir = e.code==="ArrowLeft"?-1:e.code==="ArrowRight"?1:0
  if(changeDir!=0) (changeDir==1?imgNext:imgBack)()
}}/>

<style lang="scss">

img{
  transition: filter 0.5s;
  &.loading{
    filter: blur(0.5rem);
  }
}

.featureButton{
  @include darkBtnOutline;
  grid-area: featureBtn;
  margin-top: 0.5rem;
  margin-left: 1rem;
  margin-right: 1rem;
  width: fit-content;
  display: flex;
  text-align: center;
  align-items: center;
  &:hover{
    color:$AccentColor;
  }
}

.image_container img:hover{
  cursor: zoom-in;
}

.image_slider_container{
  // height: 100%;
  height:50vmin;
  display: grid;
  grid-template-columns: 3rem 1fr 3rem;
  grid-template-rows: 1fr min-content min-content;
  grid-template-areas: "back img next"
                       "nav nav nav"
                       "featureBtn featureBtn featureBtn";
  .active_image_container{
    min-height: 100%;
    grid-area: img;
    display: flex;
    justify-content: center;
  }
  .active_image_container>.image_container{
    display: flex;
    &>img{
      align-self: center;
      min-width: 0;
      min-height: 0;
      max-width: 100%;
      max-height: 100%;
      margin: auto;
      display: none;
      &.active{
        display: block;
      }
    }
  }
}

.preview_nav{
  width: 100%;
  grid-area: nav;
  display: flex;
  overflow-x: scroll;
  button{
    background-color: gray;
    margin: 0.5rem 0.1rem;
    padding: 0;
    cursor: pointer;
    border: none;
    outline: none;
    background-size:cover;
    background-position:center;
    width: 5rem;
    height: 3rem;
    min-width: 5rem;
    border-radius: 0.25rem;
    &.active{
      border: solid 2px $AccentColor;
    }
    &:hover{
      border: solid 2px $SelectedColor;
    }
    border: solid 2px $FontColor;
  }
  div.ghost{
    border: solid 2px $FontColor;
    height: 3rem;
    margin: 0 0.1rem;
    padding: 0;
    cursor: progress;
    border: none;
    outline: none;
    background-size:cover;
    background-position:center;
    width: 5rem;
    height: 3rem;
    min-width: 5rem;
    border-radius: 0.25rem;
    @include placeholder;
  }
}

.controls{
  background-color: transparent;
  color:$FontColor;
  border:none;
  border-radius: 0.5rem;
  cursor: pointer;
  background-color: $TransparentBackground;
  grid-area: back;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover{
    color:$AccentColor;
    background-color: $TransparentBackgroundHover;
  }
  &.next{
    grid-area: next;
  }
}

.ghost{
  .active_image_container .image_container{
  @include placeholder;
  margin: 0.5rem;
  min-height: 0;
  width: 100%;
  }
  &.active_image_container{
    position: relative;
    &>.loading_container{
      top:10%;
      position: absolute;
      height: 80%;
      width:100%;
      display: flex;
      justify-content: center;
    }
  }
}

@media only screen and (max-width: $MobileWidth){
  .image_slider_container{
    display: grid;
    grid-template-columns: 3rem 1fr 3rem 0.25rem 3rem;
    grid-template-rows: 1fr 0.5rem 3rem min-content;
    grid-template-areas: "img img img img img"
                         ". . . . ."
                         "featureBtn featureBtn back . next"
                         "nav nav nav nav nav";
    height: 100%;
  }
 
  .featureButton{
    margin: 0;
    margin-right: 1rem;
  }
}
</style>