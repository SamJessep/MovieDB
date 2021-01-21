<script>
import AppShell from '../AppShell.svelte'
import CardList from '../CardList.svelte'
import {Search} from '../../model/TMDbAPI.js'

export let params = {}

</script>
<AppShell>
  <CardList FetchMethod={Search} MethodParams={[params.query]} />
</AppShell>
