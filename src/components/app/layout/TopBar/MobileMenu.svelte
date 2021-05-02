<script>
import SvgIcon from "../../../general/SvgIcon.svelte";
import { slide, fly } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

export let isMobile = false;
export let menuOpen = false;

let menuElement;
let buttonElement;

const menuStyles = `svg#SVGID{
  width: 3.5rem;
  height: 3.5rem;
  padding: 1vmin 0;
  transition: color 0.2s;
}
`
function windowClick(e){
  try{
    if(!(menuElement.contains(e.target) || buttonElement.contains(e.target))) menuOpen=false;
  }catch(e){}
}

function checkIfMobile(e){
  isMobile=window.innerWidth<=750;
  menuOpen=false;
}

checkIfMobile()
</script>

{#if isMobile}
<button class="roundedBtn dark mobileMenuButton" on:click={e=>menuOpen=!menuOpen} bind:this={buttonElement}>
  <SvgIcon src="images/menu.svg" styles={menuStyles}/>
</button>
{#if menuOpen}
<div class="mobileMenu" bind:this={menuElement} transition:fly={{x:window.outerWidth}}>
  <slot {isMobile}></slot>
</div>
{/if}
{:else}
<slot/>
{/if}
<svelte:window on:click={windowClick}  on:resize={checkIfMobile}/>

<style>
.mobileMenu{
  position: fixed;
  background-color: var(--PanelColor);
  right:0;
  top:96px;
  max-width: 75vw;
  border-radius: 0 0 0 2rem;
}

.mobileMenuButton{
  padding: 0;
  margin: auto;
}

.mobileMenuButton:hover, .mobileMenuButton:focus{
  border:none;
}


</style>