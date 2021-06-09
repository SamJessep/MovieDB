<script>
export let bindedValue;
export let fetchItemsFunction;
export let selectID;
export let label;
export let name;
export let multiple=false;

let selectElement;

let GetItems = fetchItemsFunction();

function Retry(){
  GetItems = fetchItemsFunction();
}

export function getSelectedOptions(){
  return Array.from(selectElement.selectedOptions).map(option=>option.value)
}

</script>

<label for={selectID}>{label}
    {#await GetItems}
      <p>Loading...</p>
    {:then Items}
    {#if multiple}
    <select id={selectID} {multiple} {name} bind:this={selectElement}>
      {#each Items as item}
        <option selected={item.value == bindedValue} value={item.value}>{item.text}</option>
      {/each}
    </select>
    {:else}
    <div class="twoselect">
      <select id={selectID} bind:value={bindedValue} {name} bind:this={selectElement}>
        {#each Items as item}
          <option selected={item.value == bindedValue} value={item.value}>{item.text}</option>
        {/each}
      </select>
      <slot/>
    </div>
    {/if}
    {:catch}
      <p>failed loading<br/><span on:click={Retry} class="link">Click here</span> to try again</p>
    {/await}
  </label>
  <svelte:options accessors/>

<style lang="scss">

  .twoselect{
    display:flex;
  }
  select{
    width: 100%;
    background-color: $PanelColor;
    padding: 0.25rem;
    color: $FontColor;
    border-radius: 0.2rem;
    border: solid $PanelHover 2px;
  }

  select:focus{
    outline:none;
    border-radius: 0.2rem;
    border: solid $AccentColor 2px;
  }
  label{
    margin: 0.25rem 0;
    display: block;
  }
</style>
