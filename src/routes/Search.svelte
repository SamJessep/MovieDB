<script>
import CardList from '../components/app/ResultList/CardList.svelte'
import {Search} from '../model/TMDbAPI.js'
import {querystring, location} from 'svelte-spa-router'
export let params = {}

</script>
{#key $querystring, params.groups.query}
    <CardList FetchMethod={Search} MethodParams={[decodeURI(params.groups.query), params.groups.mediatype]} StartPage={params.groups.page || 1}/>
{/key}