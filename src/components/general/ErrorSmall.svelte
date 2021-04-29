<script>
  export let userMessage;
  export let errorMessage;
  let isOpen = false;
</script>

<div class="error-container">
  <span>{userMessage}</span>
  <button class="nonStandard" on:click={e=>isOpen=!isOpen}>Click here for more detail</button>
  <div class:isOpen={isOpen} id="advancedTab">
    <small class="error">{errorMessage}</small>
  </div>
</div>

<style>
.error-container{
  padding-left: 1rem;
}

span{
  color:white;
}

button{
  display: inline;
  background-color: transparent;
  color:white;
  border: none;
  outline: none;
  color: var(--AccentColor, blue);
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