<script>
import { createEventDispatcher, onMount } from "svelte";


const dispatch = createEventDispatcher()
export let src;
export let alt = null;
export let index
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
      dispatch("submit", {change:1, index:index})
    } else {
      dispatch("submit", {change:-1, index:index})
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

</script>
<img {src} {alt} bind:this={element} />

<style lang="scss">
  img{
    max-height: 100%;
    margin: auto;
    display: inherit;
  }
</style>