<script>
import {Preferences} from "../../../stores/store";
import ErrorSmall from "../../general/ErrorSmall.svelte";

  export let media_type
  export let releaseDates;
  let usingLocalReleaseDate = true;
  let releaseDate= releaseDates.find(rd=>rd.iso_3166_1 == $Preferences.region);
  if(releaseDate == null){
    usingLocalReleaseDate=false
    releaseDate = releaseDates.find(rd=>rd.iso_3166_1 == "US")
  }
</script>
<div>
  <h2>{releaseDate.release_dates[0].certification}</h2>
  {#if !usingLocalReleaseDate}
  <ErrorSmall
    compact={true}
    userMessage={"showing US certification"} 
    errorMessage={`a certification was not found for this ${media_type == "movie" ? "movie" : "tv show"} in your region (${$Preferences.region})`}/>
  {/if}
</div>

<style lang="scss">
  div{
    display: flex;
  }
</style>