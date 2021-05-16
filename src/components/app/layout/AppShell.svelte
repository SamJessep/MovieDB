<script>
	import TopBar from './TopBar/TopBar.svelte';
	import DiscoverBar from './BottomBar/DiscoverBar.svelte';
	
	let topBar;
</script>

<section class="hero app-background is-fullheight">
  <TopBar bind:this={topBar}/>
	<main>
		<slot/>
	</main>
	<DiscoverBar on:quick_button_clicked={()=>topBar.searchBar.Clear()}/>
</section>

<style lang="scss">

	.app-background{
		background-color: rgb(25, 65, 25);
	}
</style>
