<script>
import AppShell from '../AppShell.svelte'
import CardList from '../CardList.svelte'
import {GetWatchList} from '../../model/TMDbAPI.js'
import {IsLoggedIn} from '../../stores/userStore.js'

export let params = {}
let media_type;

$:media_type = params.media_type.toLowerCase()
</script>

<AppShell>
  {#if $IsLoggedIn}
    <CardList FetchMethod={GetWatchList} MethodParams={[media_type]}/>
  {:else}
    <button>Login</button>
  {/if}
</AppShell>
