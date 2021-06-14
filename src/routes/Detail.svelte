<script>
  import {querystring} from 'svelte-spa-router'
  import QuickInfo from '../components/app/DetailsPage/QuickInfo.svelte'
  import {GetDetails} from '../model/TMDbAPI'
  export let params = {}
  console.log(params)
</script>
{#await GetDetails(params.id, params.media_type)}
  <h1>LOADING...</h1>
{:then data} 
  <QuickInfo {data} media_type={params.media_type}/>
{/await}