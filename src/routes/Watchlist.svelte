<script>
import CardList from '../components/app/ResultList/CardList.svelte'
import {GetWatchList} from '../model/TMDbAPI.js'
import {IsLoggedIn} from '../stores/userStore.js'
import Sort from '../components/app/ResultList/Sort.svelte'
export let params = {}
let media_type;

$:media_type = params.media_type.toLowerCase()
const sortOptions = [
  {value:"created_at", text:"Date Added"},
]
</script>

{#if $IsLoggedIn}
  <Sort {sortOptions}/>
  <CardList FetchMethod={GetWatchList} MethodParams={[media_type]} StartPage={params.page ?? 1} UseResultSort={false}/>
{:else}
  <button>Login</button>
{/if}