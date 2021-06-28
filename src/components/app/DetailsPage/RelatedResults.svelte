<script>
import Page from "../ResultList/Page.svelte";
import {GetRecommendedResults} from '../../../model/TMDbAPI'

export let id
export let media_type

const fetchResults = async (id, media_type)=>{
  const res = await GetRecommendedResults(id,media_type)
  return res
}
</script>
<h2>Similar {media_type == "movie" ? "Movies" : "TV Shows"}</h2>
<div class="card-contianer">
  <Page FetchMethod={fetchResults} MethodParams={[id,media_type]} page={1} Active={true}/>
</div>

<style lang="scss">
  .card-contianer{
    display:flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
</style>