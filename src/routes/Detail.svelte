<script>
  import {querystring} from 'svelte-spa-router'
  import DetailItems from '../components/app/DetailsPage/DetailItems.svelte'
  import {GetDetails} from '../model/TMDbAPI'
import { User } from '../stores/userStore';
  export let params = {}

  window.scrollY = 0;
</script>
{#await GetDetails(params.id, params.media_type, $User ? $User.session_id : undefined)}
  <!-- <h1>LOADING...</h1> -->
{:then data} 
  <DetailItems {data} media_type={params.media_type}/>
{/await}