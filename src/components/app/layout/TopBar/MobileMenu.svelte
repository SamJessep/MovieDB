<script>
import SvgIcon from "../../../general/SvgIcon.svelte";
import { slide, fly } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

export let isMobile = false;
export let menuOpen = false;

let menuElement;
let buttonElement;

const menuStyles = `
  width: 2.5rem;
  height: 2.5rem;
  padding: 1vmin 0;
  transition: color 0.2s;
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
<svelte:options accessors={true}/>
<style lang="scss">
.mobileMenu{
  position: fixed;
  background-color: $PanelColor;
  right:0;
  top:96px;
  border-radius: 0 0 0 2rem;

  width: 60vw;
  // height: 100vh;
}

.mobileMenuButton{
  padding: 0;
  margin: auto;
}

.mobileMenuButton:hover, .mobileMenuButton:focus{
  border:none;
}
@media only screen and (max-width: $MobileWidth){
  .mobileMenu{
    top:4rem  ;
  }

}
</style>