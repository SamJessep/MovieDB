<script>
import lottie from 'lottie-web'
import { onMount } from 'svelte';
import { createEventDispatcher } from 'svelte';
import {GetSCSSVars} from "../../../util";

const scssVars = GetSCSSVars()

const dispatch = createEventDispatcher();

let container;
let animation;
export let checked = false;

let SvgCSS = `
.addButton *{
  cursor: pointer;
  stroke: ${scssVars.FontColor};
  transition: stroke 0.2s;
}

.addButton.checked *{
  stroke: ${scssVars.AccentColor};
}

.addButton:hover *, .addButton:focus *{
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
    if(animation.gotToAndStop){
      animation.gotToAndStop(27, true)
    }
  });
});

$:SetButtonState(checked)

function ButtonClicked(){
  checked = !checked;
  dispatch('addClicked',{
    checked: checked
  })
}

function SetButtonState(on){
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
  width: 50px;
}

</style>
