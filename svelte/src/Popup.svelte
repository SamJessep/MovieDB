<script>
import SvgIcon from './SvgIcon.svelte';

export let MenuOpen = false;
export let HasDefaultClose;

let closeStyles = `
svg#SVGID{
  fill: var(--FontColor, black);
  width: 3vmin;
  height: 3vmin;
  padding: 1vmin 0;
  transition: fill 0.5s;
}
svg#SVGID:hover{
  fill: var(--AccentColor, green);
}
`
</script>

<div id="dialogBackground" class:open={MenuOpen}>
  <dialog open={MenuOpen}>
    {#if HasDefaultClose}
    <button id="close" on:click={()=>MenuOpen=!MenuOpen}>
      <SvgIcon src="images/close.svg" styles={closeStyles}/>
    </button>
    {/if}
    <slot name="contents"/>
    <slot name="closeButton"/>
  </dialog>
</div>

<style>

#dialogBackground{
  z-index: -1;
  position: absolute;
  top:0;
  left:0;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  transition: background-color 1s;
}

#dialogBackground.open{
  display: block;
  z-index: 1;
  background-color: #000000d4;
  transition: background-color 1s;
}

dialog{
  display: none;
  width: 80vw;
  color: var(--FontColor, black);
  background-color: var(--BackgroundColor, white);
  box-shadow: 0.5rem 0.5rem 3px 0px var(--AccentColor, green);

  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

dialog[open]{
  display: block;
  top:-100vh;
  top:25%;
  transition: top 1s;
}

#close{
  position: absolute;
  right: 0.5rem;
  top: 0rem;
  background-color: transparent;
  font-size: var(--BaseFontSize, 3vmin);
  border: none;
  color: white;
  font-weight: 700;
  padding: 0;
}

#close>img{
  width:5vmin;
  height:5vmin;
  filter: invert(100%) sepia(72%) saturate(3848%) hue-rotate(204deg) brightness(139%) contrast(100%);
  transition: filter 5s;
}

#close>img:hover, #close>img:focus{
  filter: invert(59%) sepia(66%) saturate(2540%) hue-rotate(111deg) brightness(99%) contrast(101%);
}

</style>
