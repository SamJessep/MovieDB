<script>
  export let userMessage;
  export let errorMessage;
  export let compact = false;
  let isOpen = false;
</script>



{#if compact}
<div class="error-container">
  <button class="nonStandard" on:click={e=>isOpen=!isOpen}>{userMessage}</button>
  <div class:isOpen={isOpen} id="advancedTab">
    <small class="error">{errorMessage}</small>
  </div>
</div>
{:else}
<div class="error-container">
  <span>{userMessage}</span>
  <button class="nonStandard" on:click={e=>isOpen=!isOpen}>Click here for more detail</button>
  <div class:isOpen={isOpen} id="advancedTab">
    <small class="error">{errorMessage}</small>
  </div>
</div>
{/if}

<style lang="scss">
.error-container{
  display: inline-block;
  padding-left: 1rem;
}

span{
  color:white;
}

button, .button{
  display: inline;
  background-color: transparent;
  color:white;
  border: none;
  outline: none;
  color: $AccentColor;
  cursor: pointer;
}

#advancedTab{
  display: none;
}

#advancedTab.isOpen{
  display: block;
}

.error{
  padding-left: 0.2rem;
}

</style>