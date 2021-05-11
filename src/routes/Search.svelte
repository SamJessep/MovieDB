<script>
import CardList from '../components/app/ResultList/CardList.svelte'
import {Search} from '../model/TMDbAPI.js'
import {querystring, location} from 'svelte-spa-router'
export let params = {}

</script>

{#key $querystring, $location}
    <CardList FetchMethod={Search} MethodParams={[params.query, params.media_type]} />
{/key}