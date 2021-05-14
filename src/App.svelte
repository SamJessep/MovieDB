<script>
	import AppShell from './components/app/layout/AppShell.svelte'
	import Router from 'svelte-spa-router'
	import routes from './routes.js'
	import {querystring, location} from 'svelte-spa-router'
</script>

<AppShell>
	<Router {routes} restoreScrollState={false}/>	
</AppShell>

<style lang="scss">
</style>
