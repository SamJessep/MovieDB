<script>
import {location, querystring} from 'svelte-spa-router'
import {QueryToJSON} from '../../util.js'
import AppShell from '../AppShell.svelte'
import CardList from '../CardList.svelte'
import {Latest, Popular, Trending} from '../../model/TMDbAPI.js'

export let params = {}
function GetDiscoverMethod(){
  switch(params.discoverType){
    case "Popular":
      return Popular
    case "Latest":
      return Latest
    case "Trending":
      return Trending
  }
}
</script>

<AppShell>
  <CardList FetchMethod={GetDiscoverMethod()} MethodParams={[QueryToJSON($querystring)]} />
</AppShell>
