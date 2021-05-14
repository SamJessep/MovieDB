<script>
import CardList from '../components/app/ResultList/CardList.svelte'
import {GenreSearch} from '../model/TMDbAPI.js'

export let params = {}
let genres;
let media_type;

$:genres = params.genre_id.split(',')
$:media_type = params.media_type.toLowerCase()

</script>

<CardList FetchMethod={GenreSearch} MethodParams={[genres,media_type]} StartPage={params.page ?? 1}/>
