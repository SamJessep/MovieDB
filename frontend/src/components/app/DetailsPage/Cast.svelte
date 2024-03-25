<script>
  import { GetCast } from "../../../model/TMDbAPI";
  import CastPerson from "./CastPerson.svelte";

  export let media_type = ""
  export let id = ""
  export let open = false;
  export let amount_to_show = 5;

  const orderCast = async(cast)=>{
    cast.sort((a,b)=>a.popularity>b.popularity ? -1:1)
    return cast
  }

  const showMore = () =>{
    amount_to_show += 5;
  }
</script>

<div class="castList">
{#await GetCast(id,media_type)}

{:then result}
{#await orderCast(result.cast)}
{:then orderedCast}
  {#each orderedCast as castPerson, index}
    {#if open || index < amount_to_show}
      <CastPerson {...castPerson} {media_type}/>
    {/if}
  {/each}
  {#if amount_to_show<orderedCast.length}
    <a class="expandButton" on:click={showMore}>More</a>
  {:else}
    <a class="hideButton" on:click={()=>amount_to_show=5}>Hide</a>
  {/if}
{/await}

{/await}
</div>

<style lang="scss">
  .castList{
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-evenly;
    gap:25px;
  }
  a{
    color:$AccentColor;
    cursor: pointer;
    &:hover{
      color:$SelectedColor;
    }
  }

  .expandButton,.hideButton{
    padding: 1rem;
    margin-block: auto;
    width: 90px;
  }
</style>