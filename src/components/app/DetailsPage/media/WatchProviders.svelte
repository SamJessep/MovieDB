<script>
import { onMount } from "svelte";
import { GetResultWatchProviders, GetWatchProviders } from "../../../../model/TMDbAPI";
import { Countries, Preferences, Settings } from "../../../../stores/store";
import { IsLoggedIn, User } from "../../../../stores/userStore";
import { GetSCSSVars, IsMobile } from "../../../../util";
import Selector from "../../../form/Selector.svelte";
import AnimatedIcon from "../../../general/AnimatedIcon.svelte";
import WatchProvider from "./WatchProvider.svelte";
import Api from "../../../../model/Api";
import ErrorSmall from "../../../general/ErrorSmall.svelte";

  export let title;
  export let id;
  export let media_type;

  export let seasonsJSON

  var getProviders = {watchtypes:[]}
  var preferedRegion = $Preferences.RequestParams.region
  var selectedRegion
  const defaultRegion = "US"
  var regions
  var regionSelect;
  var selectEnabled;
  var extra_feature_html=""

  $:{
    selectEnabled = regions && regions.length>0
  }

  const scss = GetSCSSVars()
  onMount(()=>{
    loadProviders()
  })

  Preferences.subscribe(p=>{
    if(p.RequestParams.region != preferedRegion){
      preferedRegion = p.RequestParams.region
      loadProviders()
    }
  })


  console.log(seasonsJSON)
  const loadProviders = ()=>{
    getProviders = GetResultWatchProviders(id, media_type).then(async res=>{
      if(!regions) regions = Object.keys(res.results)
      if(regions.length == 0) return {watchtypes:[], noRegions:true}
      if(!regions.includes(preferedRegion)){
        return {watchtypes:[], noProviders:true}
      }
      
      var username
      if($IsLoggedIn) username = $User.username
      const [direct_links,extra_feature_url] = Object.values(await Api.GetWatchProviderDirectLinks(title, res.results[preferedRegion].link, username, media_type))
      if(extra_feature_url){
        extra_feature_html="Finding links..."
        extra_feature_html = await Api.GetFeatureHTML(extra_feature_url, seasonsJSON);
      }
      const results = [
        {type:"flatrate",  providers:addDirectLinks(direct_links,res.results[preferedRegion].flatrate) ?? []},
        {type:"rent",  providers:addDirectLinks(direct_links,res.results[preferedRegion].rent) ?? []},
        {type:"buy",  providers:addDirectLinks(direct_links,res.results[preferedRegion].buy) ?? []}
      ]
      return {watchtypes:results, tmdb_link:res.results[preferedRegion].link}
    })
  }

  const addDirectLinks = (direct_links, providers)=>{
    if(!providers) return providers
    const providers_with_direct_links = providers.map(provider=>{
      const direct_provider = direct_links.find(dl=>dl.name.toLowerCase() == provider.provider_name.toLowerCase())
      provider.direct_link = direct_provider.url
      return provider
    })
    return providers_with_direct_links
  }

  const changeRegion = e=>{
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
<details open={!IsMobile()}>
  <summary class="h2">Watch providers</summary>
  <div class="section-container">
    {@html extra_feature_html}
    <div class="select_container">
      <Selector selectID="watch_provider_select" fetchItemsFunction={getRegions} label="Region" bindedValue={preferedRegion} on:select={changeRegion} bind:this={regionSelect} disabled={!selectEnabled} placeholder={selectEnabled?"Select a region":"No providers found"}/>
    </div>
    
    {#await getProviders}
    Getting providers
    <div style="width:50px; height:50px display:inline;">
      <AnimatedIcon src="images/animatedIcons/loading.json" id="watchProviderLoader" autoplay={true} loop={true} styles={`#ID *{stroke:${scss.FontColor};}`}/>
    </div>
    {:then results}
      {#if preferedRegion != $Preferences.RequestParams.region && selectEnabled}
        <button class="link-btn" on:click={updatePreferedRegion}>
          use {$Countries.find(c=>c.value == preferedRegion).text} as my default region
        </button>
      {/if}
    
      {#if results.noProviders}
        No watch providers found for {$Countries.find(c=>c.value == preferedRegion).text}. Try select a different region
      {:else}
        <div class="providersContainer">
          {#each results.watchtypes as watchtype}
            {#if watchtype.providers.length>0}
            <div class="providertype">
              <h3 class="sectionName">{watchtype.type}</h3>
              {#each watchtype.providers as provider}
              <WatchProvider src={provider.logo_path} title={provider.provider_name} link={provider.direct_link}/>
              {/each}
            </div>
            {/if}
          {/each}
        </div>
      {/if}
    {:catch error}
    <ErrorSmall errorMessage={error} userMessage="hmm... something went wrong"/>
    {/await}
  </div>
</details>

<style lang="scss">
  .select_container{
    max-width: 500px;
  }

  .providertype{
    display: grid;
    grid-template-rows: min-content 1fr;
    grid-template-columns: repeat(auto-fit, 75px);
    justify-content: flex-start;
    h3{
      grid-column: 1/-1;
    }
  }

  .link-btn{
    @include resetbutton;
    @include link;
  }

  :global(.extra-feature>button){
    margin-top: 0.5rem;
    @include darkBtnOutline;
  }
  :global(.extra-feature>select){
      display: block;
      max-width: 100%;
      flex-grow: 1;
      background-color: $PanelColor;
      padding: 0.25rem;
      color: $FontColor;
      border-radius: 0.2rem;
      border: solid $PanelHover 2px;
      overflow-y: auto;
    }
    :global(.extra-feature>select[multiple]){
      width: 100%;
    }
    
    :global(.extra-feature>select:focus){
      outline:none;
      border-radius: 0.2rem;
      border: solid $AccentColor 2px;
    }
    
    :global(.extra-feature>select:not([multiple]) option){
      color:$FontColor;
    }
    :global(.extra-feature>select:not([multiple]).hasPlaceholder option:first-child), :global(select.hasPlaceholder.off){
      color:grey;
    }
</style>