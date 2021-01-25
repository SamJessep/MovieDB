<script>
	import TopBar from './TopBar.svelte';
	import DiscoverBar from './DiscoverBar.svelte';
	import {Trending} from '../model/TMDbAPI.js'
	import {querystring, location} from 'svelte-spa-router'
</script>

<TopBar/>
<DiscoverBar/>
{#key $querystring, $location}
		<slot name="keyed"/>
{/key}
<slot/>

<style>

</style>
