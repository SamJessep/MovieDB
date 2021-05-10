<script>
import {fade} from 'svelte/transition'
import SvgIcon from "../../general/SvgIcon.svelte";
const scrollStyles =`fill: currentcolor`
var ShowButton = false;

const ScrollToTop = ()=>{
  window.scrollTo(0,0)
}

const ShouldShowButton = ()=>{
  return window.scrollY > window.innerHeight/2
}

</script>
{#if ShowButton}
<div class="container" transition:fade on:click={ScrollToTop}>
  <SvgIcon src="images/top.svg" styles={scrollStyles}/>
</div>
{/if}
<svelte:window on:scroll={()=>{ShowButton = ShouldShowButton()}}/>

<style lang="scss">
  .container{
    background-color: $TransparentPanel;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    width: 3.5rem;
    height: 3.5rem;
    color: $FontColor;
    padding: 0.3rem;
    border-radius: 0.2rem;
    transition: color 0.3s;
    &:hover{
      color:$AccentColor;
    }
  }

  @media only screen and (max-width: $MobileWidth){
    .container{
      bottom: 4rem;
    }
  }
</style>