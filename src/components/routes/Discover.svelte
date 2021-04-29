<script>
import AppShell from '../app/layout/AppShell.svelte'
import CardList from '../app/ResultList/CardList.svelte'
import {Latest, Popular, Trending} from '../../model/TMDbAPI.js'

export let params = {}
let media_type;
let type;
$: {
		type = params.discoverType
	}
$:media_type = params.media_type.toLowerCase()
</script>

<AppShell>
	<div slot="keyed">
		{#if type == "Popular"}
		<CardList FetchMethod={Popular} MethodParams={[media_type]}/>
		{:else if type == "Latest"}
		<CardList FetchMethod={Latest} MethodParams={[media_type]}/>
		{:else if type =="Trending"}
		<CardList FetchMethod={Trending} MethodParams={[media_type]}/>
		{/if}
	</div>
</AppShell>
