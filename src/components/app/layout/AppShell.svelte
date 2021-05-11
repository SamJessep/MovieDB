<script>
	import TopBar from './TopBar/TopBar.svelte';
	import DiscoverBar from './BottomBar/DiscoverBar.svelte';
</script>

<section class="hero app-background is-fullheight">
  <TopBar/>
	<main>
		<slot/>
	</main>
	<DiscoverBar/>
</section>

<style lang="scss">

	.app-background{
		background: rgb(2,0,36);
		background: linear-gradient(90deg, rgba(2,0,36,1) 9%, rgba(8,57,7,1) 24%, rgba(20,92,4,1) 40%, rgba(0,255,196,1) 56%, rgba(20,92,4,1) 73%,rgba(8,57,7,1) 89%,rgba(2,0,36,1) 100%);
		animation: movingBG 80s linear infinite;
		background-size: 400% 400%;
	}

	@keyframes movingBG {
    0% {
			background-position: 0% 0%;
    }
    50% {
			background-position: 300% 0%;
    }
    100% {
			background-position: 600% 0%;
    }
	}
</style>
