<script>
import CardList from '../components/app/ResultList/CardList.svelte'
import {Latest, Popular, Trending, Discover} from '../model/TMDbAPI.js'
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
{#if type == "Popular"}
<CardList FetchMethod={Popular} MethodParams={[media_type]} StartPage={params.page || 1} DefaultSort={"popularity.desc"}/>
{:else if type == "Latest"}
<CardList FetchMethod={Latest} MethodParams={[media_type]} StartPage={params.page || 1} DefaultSort={"release_date.desc"}/>
{:else if type =="Trending"}
<CardList FetchMethod={Trending} MethodParams={[media_type]} StartPage={params.page || 1} DefaultSort={"NONE"}/>
{:else}
<CardList FetchMethod={Discover} MethodParams={[media_type]} StartPage={params.page || 1} DefaultSort={qs.sort_by ?? "NONE"}/>
{/if}