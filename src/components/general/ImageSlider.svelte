<script>
import SvgIcon from "./SvgIcon.svelte";

export let images=[]
export let useLazy=false;
let activeImageIndex = 0;
let previewContainer;

const control_btn_styles = `
  width: 2rem;
  height: 2rem;
  transition: color 0.2s;`

let imgIndex = 0;
while(images[imgIndex]!=undefined){
  const i1 = images[imgIndex];
  const matches = images.filter(i2=>i2.initial==i1.initial)
  if(matches.length>1){
    images.splice(imgIndex,1);
  }
  imgIndex++;
}

if(useLazy){
  images = images.map(i=>{
    i.loaded = false;
    return i;
  })
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
  previewContainer.querySelectorAll("button>img")[index].scrollIntoView(scrollOptions)
}

const imgNext = ()=>{
  const newIndex = activeImageIndex+1 < images.length ?
   activeImageIndex+1 :
   0;
  selectImage(newIndex)
}

const imgBack = ()=>{
  const newIndex = activeImageIndex-1 > 0 ?
    activeImageIndex-1 :
    images.length-1;
  selectImage(newIndex)
}
</script>

<div class="image_slider_container">
  <button class="controls back" on:click={imgBack}>
    <SvgIcon src="images/chevron-left.svg" styles={control_btn_styles}/>
  </button>
  <div class="active_image_container">
    {#each images as image,index}
      {#if useLazy}
        <img 
          src={image.initial} 
          data-src={image.final} 
          alt={index == 0 ? "main image" : ""} 
          class:loading={!image.loaded}
          class:active={activeImageIndex == index}
          loading="lazy" 
          on:load={imgLoad}
        />
      {:else}
        <img src={image}/>
      {/if}
    {/each}
  </div>
  <button class="controls next" on:click={imgNext}>
    <SvgIcon src="images/chevron-left.svg" styles={control_btn_styles}/>
  </button>
  <div class="preview_nav" bind:this={previewContainer}>
    {#each images as image,index}
    <button on:click={()=>selectImage(index)}>
      {#if useLazy}
        <img src={image.initial} class:active={activeImageIndex==index}/>
      {:else}
        <img src={image}/>
      {/if}
    </button>
    {/each}
  </div>
</div>

<style lang="scss">
img{
  transition: filter 0.5s;
  &.loading{
    filter: blur(0.5rem);
  }
}

.image_slider_container{
  display: grid;
  grid-template-columns: 3rem 1fr 3rem;
  grid-template-rows: 1fr min-content;
  grid-template-areas: "back img next"
                       "nav nav nav";
  .active_image_container{
    min-height: 100%;
    grid-area: img;
    display: flex;
    justify-content: center;
  }
  .active_image_container>img{
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

.preview_nav{
  width: 100%;
  grid-area: nav;
  display: flex;
  overflow-x: scroll;
  button{
    margin: 0;
    padding: 0;
    display: contents;
    cursor: pointer;
  }
  img{
    height: auto;
    width: 5rem;
    border-radius: 0.25rem;
    margin: 0 0.1rem;
    &.active{
      border: solid 2px $AccentColor;
    }
    &:hover{
      border: solid 2px $SelectedColor;
    }
    border: solid 2px transparent;
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
  &:hover{
    color:$AccentColor;
    background-color: $TransparentBackgroundHover;
  }
  &.next{
    grid-area: next;
    transform: rotate(180deg);
  }
}

@media only screen and (max-width: $MobileWidth){
  .image_slider_container{
    display: grid;
    grid-template-columns: 3rem 1fr 3rem 3rem;
    grid-template-rows: 1fr 3rem min-content;
    grid-template-areas: "img img img img"
                         ". . back next"
                         "nav nav nav nav";
  }
}
</style>