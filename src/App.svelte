<script>
	import TopBar from './TopBar.svelte';
	import DiscoverBar from './DiscoverBar.svelte';
	import Card from './ResultCard.svelte';

	var LoadedResults = [];
	export function LoadResults(event){
		var res = event.detail.results;
		console.log(res.results)
		if('results' in res){
			LoadedResults = res.results;
		}
	}

	export function GoHome(){
		LoadedResults = [];
	}
</script>

<main>
	<TopBar on:loadResults={LoadResults} on:home={GoHome}/>
	<DiscoverBar>
	</DiscoverBar>
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
