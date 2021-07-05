<script>
import { onMount } from "svelte";
import {Preferences, Certifications} from "../../../stores/store";
import Warning from "../../general/Warning.svelte";
import tippy from 'tippy.js'

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

onMount(()=>tippy("[data-tippy-content]"))
</script>
<div>
  {#if !usingLocalReleaseDate}
  <Warning 
    title={`showing ${certificationCountry} certification`}
    error={`a certification was not found for this ${media_type == "movie" ? "movie" : "tv show"} in your region (${$Preferences.RequestParams.region}). So showing ${certificationCountry} certification instead `}>
    <abbr title={certification_meaning}>{releaseDate.release_dates[0].certification}</abbr>
  </Warning>
  {:else}
    <abbr  data-tippy-content={certification_meaning} tabindex="0">{releaseDate.release_dates[0].certification}</abbr>
  {/if}
</div>

<style lang="scss">
  div{
    display: flex;
  }

  abbr{
    text-decoration: underline $AccentColor;
    margin-right: 0.5rem;
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