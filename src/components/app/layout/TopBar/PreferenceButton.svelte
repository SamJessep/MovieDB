<script>
import { ModalView } from '../../../../stores/store';

  import SvgIcon from '../../../general/SvgIcon.svelte'
  import MobileButton from './MobileButton.svelte'
import PreferncesModal from './PreferncesModal.svelte';

  export let isMobile = false;

  //SVG styles
  let settingsStyles = `
    width: 3.5rem;
    height: 3.5rem;
    padding: 0.3rem;
    transition: fill 0.5s;
  `;

const ShowModal = ()=>{
  ModalView.set({
    component:PreferncesModal,
    props:{},
    options:{
      title:"Preferences"
    }
  })
}
</script>

<div>
  {#if isMobile}
    <MobileButton title="Preferences" click={ShowModal}>
      <SvgIcon src="images/cog.svg" styles={settingsStyles}/>
    </MobileButton>
  {:else}
    <button on:click={ShowModal} class="icon-btn roundedBtn dark" aria-label="Settings" title="Preferences">
      <SvgIcon src="images/cog.svg" styles={settingsStyles}/>
    </button>
  {/if}
</div>

<style lang="scss">
  button{
    cursor: pointer;
    background-color: transparent;
    border:none;
  }
</style>

