<script>
export let bindedValue;
export let fetchItemsFunction;
export let selectID;
export let label;
let GetItems = fetchItemsFunction();

function Retry(){
  GetItems = fetchItems();
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

<style>
  select{
    width: 100%;
  }
</style>
