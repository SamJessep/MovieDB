<script>
	import AppShell from './components/app/layout/AppShell.svelte'
	import Router from 'svelte-spa-router'
	import routes from './routes.js'
	import {querystring, location} from 'svelte-spa-router'
	import Toasts from './components/app/Toast/Toasts.svelte'
	import Modal from './components/general/Modal.svelte'
	import { onMount } from 'svelte';
	import { FeaturedBackground, IsMobile, ModalView, Preferences } from './stores/store'
	import tippy from 'tippy.js';
	import 'tippy.js/dist/tippy.css';
	import 'tippy.js/themes/dark.css';
	import 'tippy.js/themes/light.css';

	var modalOpen=false;
	var mainDiv

	ModalView.subscribe(m=>{
		modalOpen = Boolean(m.component)
		if(modalOpen){
			document.querySelector("html").style=`
				overflow:hidden;
				padding-right:${$IsMobile ? "0" : "15"}px;
			`
		}else{
			document.querySelector("html").style=``
		}
	})
	Preferences.subscribe(p=>{
		tippy.setDefaultProps({
			theme: p.theme
		})
	})

	FeaturedBackground.subscribe(url=>{
		document.body.style.backgroundImage=`url(${url})`
	})

	const checkIfMobile = () => {
		IsMobile.set('ontouchstart' in document.documentElement && /mobi/i.test(navigator.userAgent))
	}

	onMount(()=>{
		checkIfMobile()
		document.getElementById("loader").remove()
	})
</script>

<defs id="svg_refs" />
<AppShell>
	<div class:modalOpen bind:this={mainDiv}>
		<Router {routes} restoreScrollState={false} on:routeLoaded={()=>ModalView.set({})} />
	</div>
	<Toasts/>
	<Modal/>
</AppShell>

<svelte:window on:resize={checkIfMobile}/>

<style lang="scss">
	:global(body){
		background-color: $AppBackground;
		// background-image: url(https://image.tmdb.org/t/p/original/s56eyXy8rADp5DpZknfe2HXq4u4.jpg);
    background-size: contain;
    background-repeat: no-repeat;
    background-position-y: 94px;
    background-blend-mode: screen;
	}


	// add position fixed when modal is open to prevent scroll in background
	.modalOpen{
		// position: fixed;
	}
</style>
