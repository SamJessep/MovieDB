<script>
import AppShell from '../AppShell.svelte'
import CardList from '../CardList.svelte'
import {Search} from '../../model/TMDbAPI.js'

export let params = {}

</script>
<AppShell>
  <div slot="keyed">
    <CardList FetchMethod={Search} MethodParams={[params.query, params.media_type]} />
  </div>
</AppShell>
