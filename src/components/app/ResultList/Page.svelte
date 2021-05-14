<script>
import {QueryToJSON} from '../../../util'
import Card from '../ResultList/Card.svelte'
import {querystring} from 'svelte-spa-router'
import LoadingIcon from './LoadingIcon.svelte';
import { onMount, afterUpdate } from 'svelte';
import {LoadQueue} from '../../../stores/resultsStore';

export let FetchMethod;
export let MethodParams =[];
export let page;
export let PagePromise = []
export let Active;
let shownResults = []
let loading = true;

onMount(()=>{
  PagePromise = RequestResults(page)
  LoadQueue.update(v=> [...v,page])
})

async function RequestResults(page){
  let promise = FetchMethod(...MethodParams, {page:page, ...QueryToJSON($querystring)}).then(res=>{
    shownResults = res.results.filter(r=>r.media_type == "movie" || r.media_type == "tv")
    return shownResults
  })
  promise.then(_=>{LoadQueue.update(val=>val.filter(v=>v!=page)); loading=false;})
  return promise
}

afterUpdate(async ()=>{
  if(!loading) LoadQueue.update(val=>val.filter(v=>v!=page))
})

</script>
<div class="page" class:loading={loading||!Active} class:Active data-page={page} id={"page-"+page}>
  {#await PagePromise}
  {#if page != 1}
    <LoadingIcon/>
  {/if}
  {:then results}
  {#if Active}
    {#each results as result, index (result.id)}
      <Card Result={result} cardId={"card-"+index}/>
    {:else}
      {#if page==1}
        <h2>No Results :(</h2>      
      {/if}
    {/each}
  {/if}
  {:catch error}
  <pre>{error}</pre>
  {/await}
</div>

<style lang="scss">
  .page{
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    &.loading{
      min-height: 5955px;
    }
  }
</style>
