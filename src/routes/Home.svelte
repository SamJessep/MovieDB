<script>
import AdvancedSearch from '../components/app/layout/BottomBar/AdvancedSearch.svelte'
export let params = {}

let focused = false;
$:focused
</script>
<div>
  <AdvancedSearch/>
</div>
