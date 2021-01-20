<script>
import bodymovin from './addons/bodymovin.js';
import { onMount } from 'svelte';
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

let container;
let animation;
export let checked = false;
let SvgCSS = `
.addButton *{
  cursor: pointer;
  stroke: var(--FontColor);
  transition: stroke 0.2s;
}

.addButton.checked *{
  stroke: var(--AccentColor);
}

.addButton:hover *{
  stroke: var(--SelectedColor);
}
`

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
    var styleElement = document.createElement("style")
    styleElement.innerHTML = SvgCSS;
    container.children[0].prepend(styleElement)
    container.children[0].classList.add("addButton")
    SetSvgClass()
    animation.goToAndStop(checked?14:27, true)
  });
});

function ButtonClicked(){
  if(checked) {
    animation.playSegments([14, 27], true);
  } else {
    animation.playSegments([1, 14], true);
  }
  checked = !checked;
  SetSvgClass()
  dispatch('addClicked',{
    checked: checked
  })
}

function SetSvgClass(){
  container.children[0].classList[checked?"add":"remove"]("checked");
}


</script>

<div
  bind:this={container}
  on:click={ButtonClicked}
></div>

<style>
div {
  display: block;
  width: 50px;
}

</style>
