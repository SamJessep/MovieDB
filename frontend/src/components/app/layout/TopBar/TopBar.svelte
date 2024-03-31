<script>
	import { writable, derived } from 'svelte/store'
	import {Search} from '../../../../model/TMDbAPI';
	import PreferencesButton from './PreferenceButton.svelte'
	import LoginButton from './LoginButton.svelte'
	import {push} from 'svelte-spa-router'
	import SearchBar from './SearchBar.svelte'
	import MobileMenu from './MobileMenu.svelte'
	import throttle from 'lodash/throttle'

	export let searchBar = null;


	var header;
	var prevScrollpos = window.pageYOffset;
	var mobileMenu;
	const Scroll = throttle((e)=>{
		var currentScrollPos = window.pageYOffset;
		if (prevScrollpos > currentScrollPos) {
			header.style.top = "0";
		} else if(!mobileMenu.menuOpen){
			header.style.top = `-${header.offsetHeight}px`;
		}
		prevScrollpos = currentScrollPos;
	},500)

</script>

<header bind:this={header}>
	<div class="brand">
		<a href="/" class="navbar-item">
			<img id="logo" src="images/MDB_Logo.png" alt="App logo & Home Button"/>
		</a>
	</div>
	<SearchBar bind:this={searchBar}/>
	<MobileMenu let:isMobile bind:this={mobileMenu}>
		<LoginButton isMobile={isMobile}/>
		<PreferencesButton isMobile={isMobile}/>
	</MobileMenu>
</header>

<svelte:options accessors={true}/>
<svelte:window on:scroll={Scroll}/>

<style lang="scss">
	#logo{
		width: 80px;
		height: 80px;
	}

	header{
			position: sticky;
			top:0;
			width: 100%;
			z-index: 1;
			transition: top 0.3s;
			display: flex;
			align-items: center;
			padding: 0 3rem;
			background-color: black;
			height: 96px;
	}

	
	.brand{
		display: flex;
		align-items: center;
		img {
			max-width: 5rem;
			max-height: 5rem;
			display: block;
			cursor: pointer;
		}
		&>a{
			border-bottom: 3px solid transparent;
			&:hover{
				background-color: transparent;
			}
			&:focus, &:focus-within, &>:focus-visible{
				background-color: transparent;
				border-bottom: 3px solid $AccentColor;
				outline: none;
			}

		}
	}

	@media only screen and (max-width: $MobileWidth){
		#logo{
			width: 48px;
			height: 48px;
		}

		header{
			padding: 0;
			height: 64px;
		}
		.brand img{
			max-width: 3rem;
			max-height: 3rem;
		}
	}
</style>
