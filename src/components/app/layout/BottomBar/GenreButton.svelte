<script>
import { ModalView } from '../../../../stores/store';
import GenreModal from './GenreModal.svelte';

import QuickButton from './QuickButton.svelte'

const ShowModal = ()=>{
  ModalView.set({
    component:GenreModal,
    options:{
      title:"Genre Search"
    }
  })
}
</script>
  <QuickButton text="Genre Search" click={ShowModal}/>
<style lang="scss">
*{
  color:white;
}

@media only screen and (max-width: $MobileWidth){
  .quickBtn{
    &>button{
      font-size: $HeaderFontSize-Mobile;
      padding: 0.7 auto;
      width:100%;
      flex: 1 1 0px;
    }
  }

}
</style>
