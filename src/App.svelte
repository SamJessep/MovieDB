<script>
	import AppShell from './components/app/layout/AppShell.svelte'
	import Router from 'svelte-spa-router'
	import routes from './routes.js'
	import {querystring, location} from 'svelte-spa-router'
	import Toasts from './components/app/Toast/Toasts.svelte'
	import Modal from './components/general/Modal.svelte'
	import { onMount } from 'svelte';
	import { IsMobile, Preferences } from './stores/store'
	import tippy from 'tippy.js';
	import 'tippy.js/dist/tippy.css';
	import 'tippy.js/themes/dark.css';
	import 'tippy.js/themes/light.css';

	Preferences.subscribe(p=>{
		tippy.setDefaultProps({
			theme: p.theme
		})
	})

	const checkIfMobile = () => {
		IsMobile.set(window.innerWidth<750)
	}

	onMount(()=>{
		checkIfMobile()
	})
</script>

<defs id="svg_refs" />
<AppShell>
	<Router {routes} restoreScrollState={false}/>
	<Toasts/>
	<Modal/>
</AppShell>

<svelte:window on:resize={checkIfMobile}/>

<style lang="scss">
	:global(body){
		background-color: $AppBackground;
	}
</style>
