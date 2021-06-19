<script>
import {Preferences, Certifications} from "../../../stores/store";
import ErrorSmall from "../../general/ErrorSmall.svelte";
export let media_type
export let releaseDates;
let usingLocalReleaseDate = true;
let certificationCountry;
let releaseDate= releaseDates.find(rd=>rd.iso_3166_1 == $Preferences.RequestParams.region);
if(releaseDate == null){
  usingLocalReleaseDate=false
  releaseDate = releaseDates.find(rd=>rd.iso_3166_1 == "US")
  if(releaseDate == null) releaseDate = releaseDates[0]
}
certificationCountry = releaseDate.iso_3166_1
var certification_meaning = ""
if(releaseDate.release_dates[0].certification != ""){
   certification_meaning = $Certifications[media_type][certificationCountry].find(c=>c.certification === releaseDate.release_dates[0].certification).meaning

}
</script>
<div>
  <abbr title={certification_meaning}>{releaseDate.release_dates[0].certification}</abbr>
  {#if !usingLocalReleaseDate}
  <ErrorSmall
    compact={true}
    userMessage={`showing ${certificationCountry} certification`} 
    errorMessage={`a certification was not found for this ${media_type == "movie" ? "movie" : "tv show"} in your region (${$Preferences.RequestParams.region})`}/>
  {/if}
</div>

<style lang="scss">
  div{
    display: flex;
  }

  abbr{
    text-decoration: underline $AccentColor;
    &:hover {
      cursor: help;
    }
  }

  @media (pointer: coarse){
    abbr{
      text-decoration: none;
      &:hover {
        cursor: none;
      }
    }
  }

</style>