<script>
  import {Preferences} from "../../../stores/store";
import ErrorSmall from "../../general/ErrorSmall.svelte";
  export let releaseDates;
  export let media_type;
  
  const prefered_region = $Preferences.RequestParams.region;
  const fallback_region = "US"
  const releaseDate = releaseDates.find(rd=>rd.iso_3166_1 == prefered_region) || releaseDates.find(rd=>rd.iso_3166_1 == fallback_region) || releaseDates[0]
  
  let usingOtherRegion = false;
  let otherRegion;
  if(releaseDate.iso_3166_1 != prefered_region){
    usingOtherRegion = true
    otherRegion = releaseDate.iso_3166_1;
  }

  const formatReleaseDate = release =>{
    try{
      const dateString = release.release_date;
      return new Date(dateString).toLocaleDateString($Preferences.RequestParams.language+"-"+$Preferences.RequestParams.region)
    }catch(e){
      console.error(e)
      return "Unknown release date"
    }
  }
</script>

<div>
  <time>{formatReleaseDate(releaseDate.release_dates[0])}</time>
  {#if usingOtherRegion}
  <ErrorSmall
    compact={true}
    userMessage={`showing ${otherRegion} release date`} 
    errorMessage={`a release was not found for this ${media_type == "movie" ? "movie" : "tv show"} in your region (${$Preferences.RequestParams.region}).`}/>
  {/if}
</div>

<style lang="scss">
  div{
    display: flex;
  }
</style>