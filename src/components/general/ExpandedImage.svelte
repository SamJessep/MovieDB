<script>
import { createEventDispatcher, onMount } from "svelte";
import SvgIcon from "./SvgIcon.svelte";


const dispatch = createEventDispatcher()
export let src;
export let alt = null;
export let index
export let btnStyles;
export let totalImages;

var element
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
      changeImage(1)
    } else {
      changeImage(-1)
    }                                                                
  }
  /* reset values */
  xDown = null;
  yDown = null;                                             
};
onMount(()=>{
  element.ontouchstart = handleTouchStart
  element.ontouchmove = handleTouchMove
})

const changeImage = direction =>{
  dispatch("submit", {change:direction, index:index})
}

</script>
<img {src} {alt} bind:this={element} />
<div>
  <button class="controls back" on:click={()=>changeImage(-1)} aria-label="previous image">
    <SvgIcon src="images/chevron-left.svg" styles={btnStyles}/>
  </button>
  <button class="controls next" on:click={()=>changeImage(1)} aria-label="next image">
    <SvgIcon src="images/chevron-left.svg" styles={btnStyles} attributes={[{name:"transform", value:"rotate(180)"}]}/>
  </button>
  <span class="image-index">{index+1}/{totalImages}</span>
</div>
<style lang="scss">
  div{
    display: flex;
    align-items: flex-end;
  }

  .image-index{
    color:$FontColor;
    margin-left: 0.25rem;
  }

  img{
    max-height: 100%;
    margin: auto;
    display: inherit;
    margin-bottom: 0.25rem;
  }
 
  .controls{
  background-color: transparent;
  color:$FontColor;
  border:none;
  border-radius: 0.5rem;
  cursor: pointer;
  background-color: $TransparentBackground;
  grid-area: back;
  display: inline-flex;
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
</style>