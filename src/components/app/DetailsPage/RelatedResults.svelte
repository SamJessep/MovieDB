<script>
import Page from "../ResultList/Page.svelte";
import {GetRecommendedResults} from '../../../model/TMDbAPI'
import { IsMobile } from "../../../stores/store";

export let id
export let media_type

const fetchResults = async (id, media_type)=>{
  const res = await GetRecommendedResults(id,media_type)
  return res
}
</script>

<details open={!$IsMobile} data-mobile={$IsMobile}>
  <summary class="h2">Similar {media_type == "movie" ? "Movies" : "TV Shows"}</summary>
  <div class="card-contianer">
    <Page FetchMethod={fetchResults} MethodParams={[id,media_type]} page={1}/>
  </div>
</details>

<style lang="scss">
  .card-contianer{
    display:flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
</style>