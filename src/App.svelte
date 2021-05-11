<script>
	import AppShell from '../components/app/layout/AppShell.svelte'
	import Router from 'svelte-spa-router'
	import routes from './routes.js'
</script>

<AppShell>
	<Router {routes} restoreScrollState={true}/>
</AppShell>

<style lang="scss">
</style>
