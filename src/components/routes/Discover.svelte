<script>
import {location, querystring} from 'svelte-spa-router'
import {QueryToJSON} from '../../util.js'
import AppShell from '../AppShell.svelte'
import CardList from '../CardList.svelte'
import {Latest, Popular, Trending} from '../../model/TMDbAPI.js'
import { onMount } from 'svelte';

export let params = {}
let type;
$: {
		type = params.discoverType
	}
</script>

<AppShell>
<h1>{type}</h1>
  {#if type == "Popular"}
    <CardList FetchMethod={Popular} MethodParams={[QueryToJSON($querystring)]} />
  {:else if type == "Latest"}
    <CardList FetchMethod={Latest} MethodParams={[QueryToJSON($querystring)]} />
  {:else if type =="Trending"}
    <CardList FetchMethod={Trending} MethodParams={[QueryToJSON($querystring)]} />
  {/if}
</AppShell>
