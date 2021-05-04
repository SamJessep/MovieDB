<script>
	import { writable, derived } from 'svelte/store'
	import {Search} from '../../../../model/TMDbAPI';
	import PreferencesButton from './PreferenceButton.svelte'
	import LoginButton from './LoginButton.svelte'
	import {push} from 'svelte-spa-router'
	import SearchBar from './SearchBar.svelte'
	import MobileMenu from './MobileMenu.svelte'

	export let PlaceHolder = "Search...";
	let ResultSuggestions = writable([]);
	let SearchValue = "";
	export let SelectedIndex = -1;
	let MaxResults = 5;
	let SearchSection;
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
							innerHtml:name.replaceAll(new RegExp(e.target.value,"gi"), `<b style="color: var(--SelectedColor));" class="searchReccomendation">${e.target.value}</b>`)
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
		if(!SearchSection.contains(e.target)) CloseSuggestions()
	}
	export function DocumentClick(e){
		if(!SearchSection.contains(e.target)) CloseSuggestions();
	}
	export function CloseSuggestions(){
		ResultSuggestions.set([]);
	}

	export async function SendSearch(query){
		push('/Search/'+query)
	}

</script>

<div class="hero-head">
	<header class="navbar">
		<div class="container">
			<div class="navbar-brand">
				<a href="/" class="navbar-item" id="logoBtn">
					<img id="logo" src="images/MDB_logo.png" alt="App logo"/>
				</a>
				<SearchBar/>
				<MobileMenu let:isMobile>
					<LoginButton isMobile={isMobile}/>
					<PreferencesButton isMobile={isMobile}/>
				</MobileMenu>
			</div>
		</div>
	</header>
</div>

<style lang="scss">
.hero-head{
		position: sticky;
		top:0;
		width: 100%;
		z-index: 1;
	}

	#logo {
		max-width: 5rem;
		max-height: 5rem;
		display: block;
		cursor: pointer;
	}

	.navbar-brand{
		width: 100%;
		align-items: center;
	}
	header.navbar{
		background-color: black;
	}

	#logoBtn:hover{
		background-color: transparent;
	}

	@media only screen and (max-width: 750px){
		#logo{
			max-width: 3rem;
			max-height: 3rem;
		}
	}
</style>
