<script>
import {QueryToJSON} from '../util.js'
import Card from './Card.svelte'
import { onMount } from 'svelte';
import {location, querystring} from 'svelte-spa-router'

export let FetchMethod;
export let MethodParams =[];
export let page;
let shownResults = []
export let PagePromise = RequestResults(page)

async function RequestResults(page){
  let promise = FetchMethod(...MethodParams, {page:page, ...QueryToJSON($querystring)}).then(res=>{
    shownResults = res.results.filter(r=>r.media_type == "movie" || r.media_type == "tv")
    return shownResults
  })
  return promise
}

</script>
{#await PagePromise}
  <h2>Fetching Results...</h2>
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
