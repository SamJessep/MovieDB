<script>
import AppShell from '../components/app/layout/AppShell.svelte'
import CardList from '../components/app/ResultList/CardList.svelte'
import {GenreSearch} from '../model/TMDbAPI.js'

export let params = {}
let genres;
let media_type;

$:genres = params.genre_id.split(',')
$:media_type = params.media_type.toLowerCase()

</script>
<AppShell>
  <div slot="keyed">
    <CardList FetchMethod={GenreSearch} MethodParams={[genres,media_type]}/>
  </div>
</AppShell>
