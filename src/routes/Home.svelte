<script>
import AppShell from '../components/app/layout/AppShell.svelte'
export let params = {}

let focused = false;
$:focused
</script>

<AppShell>
  <div/>
</AppShell>
