<script>
export let bindedValue;
export let fetchItemsFunction;
export let selectID;
export let label;

let GetItems = fetchItemsFunction();

function Retry(){
  GetItems = fetchItemsFunction();
}

</script>

<label for={selectID}>{label}</label>
    {#await GetItems}
      <p>Loading...</p>
    {:then Items}
    <select id={selectID} bind:value={bindedValue}>
      {#each Items as item}
        <option selected={item.value == bindedValue} value={item.value}>{item.text}</option>
      {/each}
      </select>
    {:catch}
      <p>failed loading<br/><span on:click={Retry} class="link">Click here</span> to try again</p>
    {/await}

<style lang="scss">
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
