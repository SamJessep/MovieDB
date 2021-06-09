<script>
export let bindedValue = "";
export let fetchItemsFunction;
export let selectID;
export let label;
export let name = selectID;
export let multiple=false;
export let placeholder="Select a value"
export let mandatoryChoice = false;

let selectElement;
let hasSelectedPlaceholder = bindedValue=="" && mandatoryChoice==false;
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
      <select id={selectID} bind:value={bindedValue} {name} bind:this={selectElement} class:off={hasSelectedPlaceholder} class:hasPlaceholder={!mandatoryChoice} on:change={e=>hasSelectedPlaceholder=e.target.selectedOptions[0].value == ""}>
        {#if !mandatoryChoice}
          <option selected value="">{placeholder}</option>
        {/if}
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
    max-width: 100%;
    flex-grow: 1;
    background-color: $PanelColor;
    padding: 0.25rem;
    color: $FontColor;
    border-radius: 0.2rem;
    border: solid $PanelHover 2px;
  }

  select[multiple]{
    width: 100%;
  }

  select:focus{
    outline:none;
    border-radius: 0.2rem;
    border: solid $AccentColor 2px;
  }

  select:not([multiple]) option{
    color:$FontColor;
  }
  select:not([multiple]).hasPlaceholder option:first-child, select.hasPlaceholder.off{
    color:grey;
  }

  label{
    margin: 0.25rem 0;
    display: block;
  }

  @media only screen and (max-width: $MobileWidth){
    select{
      font-size: $BaseFontSize-Mobile;
    }
  }
</style>
