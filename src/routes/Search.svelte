<script>
import AppShell from '../components/app/layout/AppShell.svelte'
import CardList from '../components/app/ResultList/CardList.svelte'
import {Search} from '../model/TMDbAPI.js'

export let params = {}

</script>
<AppShell>
  <div slot="keyed">
    <CardList FetchMethod={Search} MethodParams={[params.query, params.media_type]} />
  </div>
</AppShell>
