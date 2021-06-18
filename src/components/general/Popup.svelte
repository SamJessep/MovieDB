<script>
import SvgIcon from './SvgIcon.svelte';

export let MenuOpen = false;
export let HasDefaultClose;

let closeStyles = `
  width: 2rem;
  height: 2rem;
  transition: fill 0.5s;
  padding: 0.4rem;
`
</script>

<div id="dialogBackground" class:open={MenuOpen}>
  <dialog open={MenuOpen}>
    {#if MenuOpen}
    <div class="popup-container">
      {#if HasDefaultClose}
      <button class="close roundedBtn dark" on:click={()=>MenuOpen=!MenuOpen}>
        <SvgIcon src="images/close.svg" styles={closeStyles}/>
      </button>
      {/if}
      <slot name="contents"/>
      <slot name="closeButton"/>
    </div>
    {/if}
  </dialog>
</div>

<style lang="scss">
.popup-container{
  position: relative;
}
#dialogBackground{
  z-index: -1;
  position: fixed;
  top:0;
  left:0;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  transition: background-color 1s;
  pointer-events: none;
}

#dialogBackground.open{
  pointer-events: all;
  display: grid;
  z-index: 5;
  background-color: #000000d4;
  transition: background-color 1s;
}

dialog{
  position: initial;
  display: none;
  width: 80vw;
  max-height: 90vh;
  color: $FontColor;
  background-color: $BackgroundColor;
  box-shadow: 0.5rem 0.5rem 3px 0px $AccentColor;

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
  top:25%;
  transition: top 1s;
}

.close{
  cursor: pointer;
  position: absolute;
  right: -1rem;
  top: -1rem;
  fill: $FontColor;
  margin: 0.5rem;
}

</style>
