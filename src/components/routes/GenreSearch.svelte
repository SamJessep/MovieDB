<script>
import AppShell from '../AppShell.svelte'
import CardList from '../CardList.svelte'
import {GenreSearch} from '../../model/TMDbAPI.js'
import {querystring, location} from 'svelte-spa-router'
import {QueryToJSON} from '../../util.js'

export let params = {}
let genres;
let filterParams;
let media_type;

$:genres = params.genre_id.split(',')
$:filterParams = QueryToJSON($querystring)
$:media_type = params.media_type.toLowerCase()

</script>
<AppShell>
  <div slot="keyed">
    <CardList FetchMethod={GenreSearch} MethodParams={[genres,media_type,filterParams]}/>
  </div>
</AppShell>
