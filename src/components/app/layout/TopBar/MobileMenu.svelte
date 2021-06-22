<script>
import SvgIcon from "../../../general/SvgIcon.svelte";
import { slide, fly } from 'svelte/transition';
import { quintOut } from 'svelte/easing';
import AnimatedIcon from "../../../general/AnimatedIcon.svelte";
import {GetSCSSVars} from '../../../../util'
import LoginButton from "./LoginButton.svelte";

export let isMobile = false;
export let menuOpen = false;

let menuElement;
let buttonElement;
const scss = GetSCSSVars();
var MenuIcon;

const menuStyles = `
  #ID *{
    stroke: ${scss.FontColor}
  }
`

function windowClick(e){
  try{
    if(!(menuElement.contains(e.target) || buttonElement.contains(e.target))){
      CloseMenu()
    }
  }catch(e){}
}

function checkIfMobile(e){
  isMobile=window.innerWidth<=750;
  menuOpen=false;
}

const OpenMenu = ()=>{
  menuOpen=true
  MenuIcon.Play(0,60)
}

const CloseMenu = ()=>{
  menuOpen=false
  MenuIcon.Play(60,0)
}

checkIfMobile()
</script>

{#if isMobile}
<button class="roundedBtn dark mobileMenuButton" on:click={()=>menuOpen?CloseMenu():OpenMenu()} bind:this={buttonElement}>
  <AnimatedIcon bind:this={MenuIcon} src="images/animatedIcons/menu.json" className="mobile_menu" styles={menuStyles} speed={3} id="mobile_menu_svg"/>
</button>
{#if menuOpen}
<div class="mobileMenu" bind:this={menuElement} transition:fly={{x:window.outerWidth}}>
  <slot {isMobile} />
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
}

.mobileMenuButton{
  padding: 0;
  margin: auto;
  width: 56px;
  height: 56px;
}
@media only screen and (max-width: $MobileWidth){
  .mobileMenu{
    top:4rem  ;
  }

}
</style>