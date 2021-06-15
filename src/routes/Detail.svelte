<script>
  import {querystring} from 'svelte-spa-router'
  import DetailItems from '../components/app/DetailsPage/DetailItems.svelte'
  import {GetDetails} from '../model/TMDbAPI'
  export let params = {}
</script>
{#await GetDetails(params.id, params.media_type)}
  <!-- <h1>LOADING...</h1> -->
{:then data} 
  <DetailItems {data} media_type={params.media_type}/>
{/await}