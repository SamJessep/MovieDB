<script>
import { onMount } from "svelte";
import { validate_each_argument } from "svelte/internal";
import { GetResultWatchProviders } from "../../../../model/TMDbAPI";
import { Countries, Preferences, Settings } from "../../../../stores/store";
import { User } from "../../../../stores/userStore";
import { GetSCSSVars } from "../../../../util";
import Selector from "../../../form/Selector.svelte";
import AnimatedIcon from "../../../general/AnimatedIcon.svelte";
import WatchProvider from "./WatchProvider.svelte";
import {fade} from 'svelte/transition'

  export let id;
  export let media_type;

  var getProviders = {watchtypes:[]}
  var preferedRegion = $Preferences.RequestParams.region
  var lastRegion = preferedRegion
  const defaultRegion = "US"
  var regions
  var regionSelect;
  const scss = GetSCSSVars()
  onMount(()=>{
    loadProviders()
  })

  const loadProviders = ()=>{
    getProviders = GetResultWatchProviders(id, media_type).then(res=>{
      if(!regions) regions = Object.keys(res.results)
      var selectedRegion = regions.includes(preferedRegion) ? preferedRegion :
                           regions.includes(defaultRegion) ? defaultRegion :
                           regions[0]
      console.log(res.results)
      const results = [
        {type:"flatrate",  providers:res.results[selectedRegion].flatrate ?? []},
        {type:"rent",  providers:res.results[selectedRegion].rent ?? []},
        {type:"buy",  providers:res.results[selectedRegion].buy ?? []}
      ]
      return {watchtypes:results, tmdb_link:res.results[selectedRegion].link}
    })
  }

  const changeRegion = e=>{
    console.log(e.detail.selected[0].value)
    preferedRegion = e.detail.selected[0].value;
    loadProviders()
  }

  const getRegions = async()=>{
    return new Promise(function (resolve, reject) {
        (function waitForRegions(){
            if (regions != undefined) return resolve($Countries.filter(c=>regions.includes(c.value)));
            setTimeout(waitForRegions, 30);
        })();
    });
  }

const updatePreferedRegion = ()=>{
  $Preferences.RequestParams.region = preferedRegion
  $Settings.useAccountSettings = $User.iso_3166_1 == preferedRegion;
}
</script>
<h1>
  Watch providers
</h1>
<Selector fetchItemsFunction={getRegions} label="Region" bindedValue={preferedRegion} on:select={changeRegion} bind:this={regionSelect}/>

{#if preferedRegion != $Preferences.RequestParams.region}
  <button class="link-btn" on:click={updatePreferedRegion}>
    use {$Countries.find(c=>c.value == preferedRegion).text} as my default region
  </button>
{/if}

{#await getProviders}
Getting providers
<div style="width:50px; height:50px display:inline;">
  <AnimatedIcon src="images/animatedIcons/loading.json" id="watchProviderLoader" autoplay={true} loop={true} styles={`#ID *{stroke:${scss.FontColor};}`}/>
</div>
{:then results}
<div class="providersContainer">
  {#each results.watchtypes as watchtype}
    {#if watchtype.providers.length>0}
    <div class="providertype">
      <h1 class="sectionName">{watchtype.type}</h1>
      {#each watchtype.providers as provider}
      <WatchProvider src={provider.logo_path} title={provider.provider_name} tmdb_link={results.tmdb_link}/>
      {/each}
    </div>
    {/if}
  {/each}
</div>
{/await}

<style lang="scss">
  .providertype{
    display: grid;
    grid-template-rows: min-content 1fr;
    grid-template-columns: max-content;
    justify-content: flex-start;
    .sectionName{
      grid-row: 1;
    }
  }

  .link-btn{
    @include resetbutton;
    @include link;
  }
</style>