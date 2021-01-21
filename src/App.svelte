<script>
	import TopBar from './TopBar.svelte';
	import DiscoverBar from './DiscoverBar.svelte';
	import Card from './ResultCard.svelte';
	import {GetCountries, GetLanguages} from './model/api_config.js'
	import {Trending} from './model/TMDbAPI.js'
	import {Languages, Countries} from './stores.js'

	var LoadedResults = [];
	export function LoadResults(event){
		var res = event.detail.results;
		console.log(res.results)
		if('results' in res){
			LoadedResults = res.results;
		}
	}

	export async function GoHome(){
		let trending = await Trending();
		LoadedResults = trending.results
	}

	GoHome()

</script>

<main>
	<TopBar on:loadResults={LoadResults} on:home={GoHome}/>
	<DiscoverBar on:loadResults={LoadResults}/>
	<div id="cardContainer">
	{#each LoadedResults as result (result.id)}
		<Card Result={result}/>
	{/each}
</main>

<style>

#cardContainer{
	display: flex;
	justify-content: space-evenly;
	flex-wrap: wrap;
}

</style>
