<script>
	import { writable, derived } from 'svelte/store'
	import { createEventDispatcher } from 'svelte';
	import {Search} from './model/TMDbAPI.js';
	import PreferencesButton from './PreferenceButton.svelte'
	import LoginButton from './LoginButton.svelte'
	import SvgIcon from './SvgIcon.svelte'
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
	const SearchButtonStyles = `
		svg#SVGID{
			width:4vmin;
			height:4vmin;
			cursor: pointer;
			fill:var(--FontColor, black);
			transition: fill 0.3s;
		}

		a:hover>svg#SVGID, a:focus>svg#SVGID{
			fill:var(--AccentColor, green);
		}
		a:active>svg#SVGID{
			fill:var(--SelectedColor, green);
		}
	`

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
							innerHtml:name.replaceAll(new RegExp(e.target.value,"gi"), `<b style="color: var(--SelectedColor, green);" class="searchReccomendation">${e.target.value}</b>`)
						}
					})
					.slice(0,MaxResults
					)
				)
			}
		}
	}

	export function SelectReccomendation(e){
		SearchValue = e.target.innerText;
		SendSearch(SearchValue);
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

	export function MouseLeaveSearchBar(e){
		ResultSuggestions.set([]);
		document.activeElement.blur();
	}

	export async function SendSearch(query){
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
		<div id="searchBar" on:mouseleave={MouseLeaveSearchBar}>
			<input
				id="searchBarInput"
				autofocus
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
		<a id="searchButtonContainer" class="svgContainer" bind:this={SearchButton}  on:click={(e)=>SendSearch(SearchValue)} tabindex={$SearchButtonTabIndex} href="#">
			<SvgIcon src="images/search.svg" styles={SearchButtonStyles} />
		</a>
	</div>
<svelte:window on:keydown={DocumentKeyPressed} on:focusin={DocumentFocusStart}/>
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

#searchButtonContainer{
	display: flex;
  align-items: center;
  outline: none;
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
		border-bottom: solid var(--AccentColor, green) 0.5vmin;
		outline: none;
	}

	#suggestions{
		position: absolute;
		width: 80vw;
	}

	#suggestions>p{
		background-color:var(--SecondBackgroundColor, grey);
		color:var(--FontColor, white);
		border-radius: 1vmin;
		font-size: var(--BaseFontSize, 2vmin);
		padding: 1rem 0;
		margin: 0.5rem 0;
	}

#suggestions>p.selected{
		color:var(--AccentColor, green) !important;
		background-color:var(--SecondBackgroundColor, green);
		outline: none;
	}
	#suggestions>p.selected>b{
		color: var(--AccentColor, green) !important;
	}

</style>
