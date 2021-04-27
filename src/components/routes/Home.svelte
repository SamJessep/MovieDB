<script>
import AppShell from '../AppShell.svelte'
export let params = {}

let focused = false;
$:focused
</script>

<AppShell>
  <div/>
</AppShell>
