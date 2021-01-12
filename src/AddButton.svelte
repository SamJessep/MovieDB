<script>
import bodymovin from './addons/bodymovin.js';
import { onMount } from 'svelte';
let container;
let animation;
let state = "checked";

onMount(async () => {
   animation= bodymovin.loadAnimation({
    container: container,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: 'https://assets2.lottiefiles.com/packages/lf20_nsj7v44e.json',
    rendererSettings: {
      id:'addButton',
      className: 'addButton',
    }
  })
  animation.addEventListener("DOMLoaded", ()=>{
    animation.goToAndStop(1, true)
    SetColor('var(--FontColor, black)')
  });
});

function SetColor(color){
  let paths = container.querySelectorAll('path');
  paths.forEach(element => {
    element.setAttribute('style', 'stroke: '+color+';');
  });
}

function ButtonClicked(){
    if(state === 'notChecked') {
      animation.playSegments([14, 27], true);
      state = 'checked';
    } else {
      animation.playSegments([1, 14], true);
      state = 'notChecked';
    }
  }


</script>

<div
  bind:this={container}
  on:click={ButtonClicked}
  on:mouseover={()=>SetColor("var(--AccentColor)")}
  on:mouseout={()=>SetColor("var(--FontColor)")}
></div>

<style>
div {
  display: inline-block;
  width: 50px;
  height: 50px;
  margin: auto 0;
}

path{
  stroke: var(--FontColor) !important;
}
</style>
