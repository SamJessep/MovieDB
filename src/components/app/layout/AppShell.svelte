<script>
	import TopBar from './TopBar/TopBar.svelte';
	import DiscoverBar from './BottomBar/DiscoverBar.svelte';
	
	let topBar;
</script>

<section class="app-background">
  <TopBar bind:this={topBar}/>
	<main>
		<slot/>
	</main>
	<DiscoverBar on:quick_button_clicked={()=>topBar.searchBar.Clear()}/>
</section>

<style lang="scss">

	.app-background{
		min-height: 100vh;
		background-color: rgb(25, 65, 25);
	}
</style>
