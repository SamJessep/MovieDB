<script>
	import AppShell from './components/app/layout/AppShell.svelte'
	import Router from 'svelte-spa-router'
	import routes from './routes.js'
	import {querystring, location} from 'svelte-spa-router'
import Toasts from './components/app/Toast/Toasts.svelte'
</script>

<defs id="svg_refs" />
<AppShell>
	<Router {routes} restoreScrollState={false}/>
	<Toasts/>
</AppShell>

<style lang="scss">
	:global(body){
		background-color: $AppBackground;
	}
</style>
