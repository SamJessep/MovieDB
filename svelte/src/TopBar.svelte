<script>
	import { writable, derived } from 'svelte/store'
	import { createEventDispatcher } from 'svelte';
	import {Search} from './model/TMDbAPI.js';
	import PreferencesButton from './PreferenceButton.svelte'
	import LoginButton from './LoginButton.svelte'
	const dispatch = createEventDispatcher();

	export let PlaceHolder = "Search...";
	let ResultSuggestions = writable([]);
	let SearchValue = "";
	export let SelectedIndex = -1;
	let MaxResults = 5;
	let SearchSection;
	let SuggestionList;
	let SearchButtonTabIndex = derived(ResultSuggestions,$ResultSuggestions=>$ResultSuggestions.length+2);
	let SearchButton;

	export async function KeyPressed(e){
		if(e.code == "Enter") SendSearch(e.target.value);
		if(!(e.code == "ArrowUp" || e.code == "ArrowDown" || e.code == "Enter")) SelectedIndex = -1;
		if(e.target.value == '' || e.code == "Enter") ResultSuggestions.set([]);
		else{
			var res = await Search(e.target.value)
			if('results' in res){
				ResultSuggestions.set(res.results.map(
					result=>result.original_title
					|| result.title
					|| result.name).map(name=>{
						return {
							value:name,
							innerHtml:name.replaceAll(new RegExp(e.target.value,"gi"), `<b style="color:var(--AccentColor, green)">${e.target.value}</b>`)
						}
					})
					.slice(0,MaxResults
					)
				)
			}
		}
	}

	export function DocumentClick(e){
		if (!SearchSection.contains(e.target)) {
			ResultSuggestions.set([]);
		}
	}

	export function SelectReccomendation(e){
		SearchValue = e.target.value;
	}

	function SetSelectedSuggestionIndex(dir){
			let newIndex = SelectedIndex+dir;
			if(newIndex<0) newIndex = MaxResults-1;
			if(newIndex>=MaxResults) newIndex = 0;
			SelectedIndex = newIndex;
	}

	export function DocumentKeyPressed(e){
		if(e.code == "ArrowUp") SetSelectedSuggestionIndex(-1)
		if(e.code == "ArrowDown") SetSelectedSuggestionIndex(1)
		if(e.code == "Enter" && SelectedIndex != -1) SendSearch($ResultSuggestions[SelectedIndex].value)
	}
	export function DocumentFocusStart(e){
		if(SearchButton.contains(e.target)) SelectedIndex = -1;
		if(!SearchSection.contains(e.target)) ResultSuggestions.set([]);
	}

	export async function SendSearch(query){
		console.log(query)
		SearchValue = query;
		if(query != ""){
			var res = await Search(query);
			dispatch('loadResults',{
				results:res
			})
		}
	}

	export function SendHome(){
		dispatch('home')
	}
</script>
	<LoginButton/>
	<img id="logo" src="images/MDB_logo.png" alt="App logo" on:click={SendHome}/>
	<PreferencesButton/>
	<div id="search" bind:this={SearchSection}>
		<div id="searchBar">
			<input
				id="searchBarInput"
				tabindex="1"
				placeholder={PlaceHolder}
				list="resultSuggestions"
				on:keyup={KeyPressed}
				on:focus={KeyPressed}
				on:click={()=>SelectedIndex = -1}
				bind:value={SearchValue}
			/>
			<div id="suggestions">
				{#each $ResultSuggestions as suggestion, index}
					<p
						tabindex={2+index}
						on:click={SelectReccomendation}
						on:mouseover={()=>SelectedIndex=index}
						on:focus={()=>SelectedIndex=index}
						class:selected={SelectedIndex==index}
						value={suggestion.value}
					>{@html suggestion.innerHtml}</p>
				{/each}
			</div>
		</div>
		<img bind:this={SearchButton} src="images/search.svg" alt="search button" tabindex={$SearchButtonTabIndex} on:click={()=>SendSearch(SearchValue)}/>
	</div>
<svelte:window on:keydown={DocumentKeyPressed} on:click={DocumentClick} on:focusin={DocumentFocusStart}/>
<style>
	#logo {
		max-width: 50vw;
		max-height: 20vh;
		display: block;
		cursor: pointer;
		margin: 0 auto 4rem auto;
	}

	#search {
		position: relative;
		display: flex;
		justify-content: center;
		text-align: center;
	}

	#search>img {
	width: 10vmin;
	height: auto;
	cursor: pointer;
	filter: var(--ImgColor);
}

  #search>img:active,#search>img:hover, #search>img:focus {
    filter: var(--ImgClickColor);
		outline:none;
}
	#search input {
		width: 80vw;
		height: 10vmin;
		display: block;
		font-size: 7vmin;
		border: none;
		border-bottom: solid var(--FontColor, black) 0.5vmin;
		margin: 0 2vmin 0 0;
		padding: 1vmin;
	}

	#searchBar input:hover,
	#searchBar>input:focus,
	#searchBar>input:active {
		border-bottom: solid #00d474 0.5vmin;
		outline: none;
	}

	#suggestions{
		position: absolute;
		width: 80vw;
	}

	#suggestions>p{
		background-color:#2b2c2c;
		color:white;
		border-radius: 1vmin;
		font-size: var(--BaseFontSize, 2vmin);
		padding: 1rem 0;
		margin: 0.5rem 0;
	}

#suggestions>p.selected{
		/* background-color:#2b2c2c; */
		color:var(--AccentColor, green);
		background-color:#3c3c3b;
		outline: none;
	}
</style>
