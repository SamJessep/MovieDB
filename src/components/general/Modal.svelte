<script>
import { Boolean } from 'lodash/_freeGlobal';

  import { fade } from 'svelte/transition';
  import {ModalView} from '../../stores/store'
  import SvgIcon from './SvgIcon.svelte'
  export let open = false;
  
  let component;
  let props;
  let events;
  let options = {
    title: "_",
    useDefaultClose: true,
    useTitle: true
  }
  
  const closeStyles = `
    width: 2rem;
    height: 2rem;
    transition: fill 0.5s;
    padding: 0.4rem;
  `

let background;
const Click = e => {
  //If background clicked, close modal
  if(e.target == background) Close();
}

const Close = ()=>{
  open = false;
}

ModalView.subscribe(v=>{
  component = v.component;
  props = v.props;
  events = v.events;
  options = {...options,...v.options}
  open = Boolean(component)
})

</script>

{#if open}
<div id="modal-container" class="background" on:click={Click} bind:this={background} transition:fade>
  <div class="modal-container">
    <div class="info-bar">
      {#if options.useTitle}
        <h2>{options.title}</h2>
      {/if}
      {#if options.useDefaultClose}
        <button on:click={Close} class="close">
          <SvgIcon src="images/close.svg" styles={closeStyles}/>
        </button>
      {/if}
    </div>
    <div class="content">
      <svelte:component this={component} {...props} on:submit={events.submit} on:clear={events.clear} on:cancel={events.cancel}/>
    </div>
  </div>
</div>
{/if}

<style lang="scss">
  .background{
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    z-index: 5;
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: $TransparentBackgroundHover;
  }

  .modal-container{
    border-radius: 0.5rem;
    padding: 0.5rem;
    background-color: $BackgroundColor;
    box-shadow: 0.5rem 0.5rem 3px 0px $Dark-Shaddow;
    width: 75%;
    height: 75%;
    display: flex;
    flex-direction: column;
  }

  .info-bar{
    button.close{
      float: right;
      cursor: pointer;
      fill: $FontColor;
      background-color: transparent;
      border: solid 2px transparent;
      border-radius: 0.5rem;
      &:hover{
        fill:$AccentColor;
      }
      &:focus{
        border: solid 2px $AccentColor;
      }
    }
    h2{
      display: inline;
      color:$FontColor;
    }
    padding-bottom: 0.5rem;
  }

  .content{
    overflow-y: auto;
    height: 100%;
    flex-grow: 1;
  }

  @media only screen and (max-width: $MobileWidth){
    .modal-container{
        width: 90%;
        min-height: 40%;
        max-height: 90%;
        height: unset;
    }
  }

</style>