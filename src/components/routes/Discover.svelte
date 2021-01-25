<script>
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
	<div slot="keyed">
		{#if type == "Popular"}
		<CardList FetchMethod={Popular}/>
		{:else if type == "Latest"}
		<CardList FetchMethod={Latest}/>
		{:else if type =="Trending"}
		<CardList FetchMethod={Trending}/>
		{/if}
	</div>
</AppShell>
