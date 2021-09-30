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
      if(document.getElementById('modal-container') && document.getElementById('modal-container').contains(e.target)){
        return
      }
      //Menu already open? then close it
      if(menuElement.computedStyleMap().get('right').value == 0) CloseMenu()
    }
  }catch(e){}
}

function checkIfMobile(e){
  isMobile=window.innerWidth<=750;
  menuOpen=false;
}

const OpenMenu = ()=>{
  MenuIcon.Play(0,60)
  menuOpen=true
}

const CloseMenu = ()=>{
  MenuIcon.Play(60,0)
  menuOpen=false
}

checkIfMobile()
</script>

{#if isMobile}
<button 
  class="roundedBtn dark mobileMenuButton" 
  on:click={()=>menuOpen?CloseMenu():OpenMenu()} 
  bind:this={buttonElement}
  alt={(menuOpen ? "close" : "open")+"Mobile menu"}>
  <AnimatedIcon bind:this={MenuIcon} src="images/animatedIcons/menu.json" className="mobile_menu" styles={menuStyles} speed={4} id="mobile_menu_svg" width="56px" height="56px"/>
</button>
<div class="mobileMenu" class:menuOpen bind:this={menuElement}>
  <slot {isMobile} />
</div>
{:else}
  <slot/>
{/if}
<svelte:window on:click={windowClick}  on:resize={checkIfMobile}/>
<svelte:options accessors={true}/>
<style lang="scss">
.mobileMenu{
  position: fixed;
  background-color: $PanelColor;
  top:96px;
  border-radius: 0 0 0 2rem;
  width: 60vw;
  right:-100%;
  transition: right 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  &.menuOpen{
    right:0;
  }
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