<script>
import AppShell from '../AppShell.svelte'
import CardList from '../CardList.svelte'
import {GetWatchList} from '../../model/TMDbAPI.js'
import {IsLoggedIn} from '../../stores/store.js'

export let params = {}
</script>

<AppShell>
  {#if $IsLoggedIn}
    <CardList FetchMethod={GetWatchList} />
  {:else}
    <button>Login</button>
  {/if}
</AppShell>
