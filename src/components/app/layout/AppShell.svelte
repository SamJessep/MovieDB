<script>
	import TopBar from './TopBar/TopBar.svelte';
	import DiscoverBar from './BottomBar/DiscoverBar.svelte';
	import Footer from './Footer.svelte';
	import { FeaturedBackground } from '../../../stores/store';
	import {location} from 'svelte-spa-router'
	let topBar;

	location.subscribe(_=> FeaturedBackground.set(""))
</script>

<section class="app-background">
  <TopBar bind:this={topBar}/>
	<main>
		<slot/>
	</main>
	<Footer/>
	<DiscoverBar on:quick_button_clicked={()=>topBar.searchBar.Clear()}/>
</section>

<style lang="scss">

	.app-background{
		min-height: 100vh;
		position: relative;
	}
</style>
