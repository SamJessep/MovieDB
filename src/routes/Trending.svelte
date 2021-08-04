<script>
  import { Trending } from "../model/TMDbAPI";
  import CardList from '../components/app/ResultList/CardList.svelte'
  import {querystring} from 'svelte-spa-router'
  import {QueryToJSON} from '../util';
  
  export let params = {}
  let media_type;
  let type;
  let page;
  let qs = QueryToJSON($querystring);
  $: {
      type = params.discoverType
    }
  $:media_type = params.media_type.toLowerCase()
  
  </script>
  <CardList FetchMethod={Trending} MethodParams={["all",undefined]} StartPage={params.page || 1} DefaultSort={"popularity.desc"}/>