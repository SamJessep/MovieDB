<script>
import lottie from 'lottie-web'
import { onMount } from 'svelte';
import { createEventDispatcher } from 'svelte';
import {GetSCSSVars} from "../../../util";

const scssVars = GetSCSSVars()

const dispatch = createEventDispatcher();

let container;
let animation;
export let checked;
let buttonReady = false;

let SvgCSS = `
.addButton *{
  cursor: pointer;
  stroke: transparent;
  transition: stroke 0.2s;
  pointer-events:none;
}

.addButton.ready *{
  stroke: ${scssVars.FontColor};
  pointer-events:all;
}

.addButton.ready.checked *{
  stroke: ${scssVars.AccentColor};
}

.addButton.ready:hover *, .addButton.ready:focus *{
  stroke: ${scssVars.AccentColor};
}
`

onMount(async () => {
   animation= lottie.loadAnimation({
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
    });
});

function ButtonClicked(){
  checked = !checked;
  SetButtonState(checked)
  dispatch('addClicked',{
    checked: checked
  })
}

export function SetButtonReady(on){
  buttonReady = true;
  container.children[0].classList.add("ready")
  animation.goToAndStop(on ? 14:27, true)
  container.children[0].classList[on?"add":"remove"]("checked");
}

function SetButtonState(on){
  if(!buttonReady)return
  console.log("BUTTON "+ (on?"ON":"OFF"), on)
  try{
    if(on) {
      animation.playSegments([1, 14], true);
    } else {
      animation.playSegments([14, 27], true);
    }
    container.children[0].classList[on?"add":"remove"]("checked");
  }catch{}
}


</script>

<div
  bind:this={container}
  on:click={ButtonClicked}
></div>

<style lang="scss">
div {
  display: block;
  max-width: 50px;
}

</style>
