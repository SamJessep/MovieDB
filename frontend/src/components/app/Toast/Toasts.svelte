<script>
  import {ToastsQueue} from '../../../stores/store';
  import Toast from './Toast.svelte';

  var activeToast
  
  const LoadToaster = ()=>{
    const topToast = $ToastsQueue[0]
    if(topToast != null){
      activeToast = topToast 
    }
  }
  
  const DissmissToast = ()=>{
    activeToast = null
    var hasMoreToasts;
    ToastsQueue.update(toaster=>{
      toaster.shift()
      hasMoreToasts = toaster.length > 0;
      return toaster
    })
    if(hasMoreToasts){
      setTimeout(LoadToaster,1000)
    }
  }

  ToastsQueue.subscribe(toaster=>{
    if(toaster.length>0 && activeToast == null){
      setTimeout(LoadToaster,1000)
    }
  })

</script>
<div class="toastContainer">
  {#if activeToast}
    <Toast message={activeToast.message} on:remove={DissmissToast} autoDissmiss={activeToast.autoDissmiss} duration={activeToast.duration} theme={activeToast.theme}/>
  {/if}
</div>

<style lang="scss">
  .toastContainer{
    width: 100%;
    position: fixed;
    bottom: 60px;
  }
</style>