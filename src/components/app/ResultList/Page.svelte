<script>
import {QueryToJSON} from '../../../util'
import Card from '../ResultList/Card.svelte'
import {querystring} from 'svelte-spa-router'
import LoadingIcon from './LoadingIcon.svelte';
import { createEventDispatcher } from 'svelte';
import { onMount } from 'svelte';

const dispatch = createEventDispatcher();

export let FetchMethod;
export let MethodParams =[];
export let page;
let shownResults = []
export let PagePromise = []

onMount(()=>PagePromise = RequestResults(page))
async function RequestResults(page){
  let promise = FetchMethod(...MethodParams, {page:page, ...QueryToJSON($querystring)}).then(res=>{
    shownResults = res.results.filter(r=>r.media_type == "movie" || r.media_type == "tv")
    return shownResults
  })
  promise.then(_=>{dispatch('loaded')})
  return promise
}

</script>
<div class="page">
  {#await PagePromise}
  <LoadingIcon/>
  {:then results}
  {#each results as result, index (result.id)}
  <Card Result={result} cardId={"card-"+index}/>
  {:else}
  {#if page==1}
  <h2>No Results :(</h2>      
  {/if}
  {/each}
  {:catch error}
  <pre>{error}</pre>
  {/await}
</div>

<style lang="scss">
  .page{
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
</style>
