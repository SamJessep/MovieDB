<script>
import AppShell from '../AppShell.svelte'
import CardList from '../CardList.svelte'
import {GetWatchList} from '../../model/TMDbAPI.js'

export let params = {}
</script>

<AppShell>
  <CardList FetchMethod={GetWatchList} />
</AppShell>
