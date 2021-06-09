<script>
	import TopBar from './TopBar/TopBar.svelte';
	import DiscoverBar from './BottomBar/DiscoverBar.svelte';
	import Footer from './Footer.svelte';
	
	let topBar;
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
		background-color: $AppBackground;
	}
</style>
