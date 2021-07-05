<script>
	import AppShell from './components/app/layout/AppShell.svelte'
	import Router from 'svelte-spa-router'
	import routes from './routes.js'
	import {querystring, location} from 'svelte-spa-router'
	import Toasts from './components/app/Toast/Toasts.svelte'
	import { onMount } from 'svelte';
	import tippy from 'tippy.js';
	import 'tippy.js/dist/tippy.css';
	import 'tippy.js/themes/light.css';
	onMount(()=>{
		tippy.setDefaultProps({
			theme: 'light'
		})
	})
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
