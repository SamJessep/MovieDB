<script>
import CardList from '../components/app/ResultList/CardList.svelte'
import {Search} from '../model/TMDbAPI.js'

export let params = {}

</script>
<main>
    <CardList FetchMethod={Search} MethodParams={[params.query, params.media_type]} />
</main>