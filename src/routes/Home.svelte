<script>
import { onMount } from 'svelte';
import { push } from 'svelte-spa-router';
export let params = {}

let focused = false;
$:focused

onMount(()=>push("/trending/all"))
</script>
<div>
</div>
