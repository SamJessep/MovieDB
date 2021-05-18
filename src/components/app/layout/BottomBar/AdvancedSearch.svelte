<!-- 
"sort_by"X
"certification_country"
"certification"
"certification.lte"
"certification.gte"
"include_video"
"primary_release_year"
"primary_release_date.gte"
"primary_release_date.lte"
"with_release_type"
"vote_count.gte"
"vote_count.lte"
"vote_average.gte"
"vote_average.lte"
"with_cast"
"with_crew"
"with_people"
"with_companies"
"with_genres"
"without_genres"
"with_keywords"
"without_keywords"
"with_runtime.gte"
"with_runtime.lte"
"with_original_language"
"with_watch_providers"
"watch_region"
"with_watch_monetization_types"
 -->
<script>
import { GetWatchProviders } from "../../../../model/TMDbAPI";

import Checkbox from "../../../form/Checkbox.svelte"
import DatePicker from "../../../form/DatePicker.svelte"
import SearchTag from "../../../form/SearchTag.svelte"
import Selector from "../../../form/Selector.svelte"
import AddButton from "../../ResultList/AddButton.svelte"

class formItem{
  constructor(name,label,type){
    this.label = label
    this.name = name
    this.type = type
    this.value
  }
} 
class select extends formItem{
  constructor(name,label, options, multiple=false){
    super(name,label,"select")
    this.options = options
    this.selected = options[0]
    this.multiple=multiple
  }

  get_selected(){
    return this.selected
  }

  get_options(){
    console.log(typeof(this.options))
    return this.options
  }
}

class datepicker extends formItem{
  constructor(name, label, options){
    super(name,label,"date")
    this.options = options
  }
}

class range{
  constructor(formItemLow, formItemHigh){
    this.type="range"
    this.items = [formItemLow, formItemHigh]
  }
}

class checkbox extends formItem{
  constructor(name, label, checked = false){
    super(name, label,"checkbox")
    this.checked = checked
  }

}

class searchTag extends formItem{
  constructor(name, label){
    super(name, label, "searchTag")
  }
}

class numberInput extends formItem{
  constructor(name, label, min, max){
    super(name, label, "numberInput")
    this.inputType = "number"
    this.min = min
    this.max = max
  }
}

function formatWatchProviders(){
  return GetWatchProviders("movie", "NZ").then(r=>{
    console.log(r.results)
    return r.results.map(p=>{return {value:p.provider_id, text:p.provider_name, icon:p.logo_path}})
  })
}

const formItems = [
  new select("sort_by","Sort", [
    {value:"popularity", text:"Popularity"},
    {value:"release_date", text:"Release Date" },
    {value:"revenue", text:"Revenue" },
    {value:"primary_release_date", text:"Primary Release Date"},
    {value:"original_title", text:"Title"},
    {value:"vote_average", text:"Rating" },
    {value:"vote_count", text:"Rating Count" }
  ]),
  new datepicker("primary_release_year","Release Year", {minDate:"1900-01", maxDate:"today"}),
  new range( 
    new datepicker("primary_release_date.lte","Release Date Less than", {minDate:"1900-01", maxDate:"today"}), 
    new datepicker("primary_release_date.gte","Release Date Greater than", {minDate:"1900-01", maxDate:"today"})
  ),
  new select("with_release_type", "Release Type", [
    {value:"1", text:"Premiere"},
    {value:"2", text:"Theatrical (limited)"},
    {value:"3", text:"Theatrical"},
    {value:"4", text:"Digital"},
    {value:"5", text:"Physical"},
    {value:"6", text:"TV"}
  ], true),
  new searchTag("with_cast", "With Cast"),
  new searchTag("with_crew", "With Crew"),
  new searchTag("with_people", "With People"),
  new searchTag("with_companies", "With Companies"),
  new searchTag("with_genres", "With Genres"),
  new searchTag("with_keywords", "With Keywords"),
  new range(
    new numberInput("with_runtime.gte", "Run time longer than", 0,500),
    new numberInput("with_runtime.lte", "Run time shorter than", 0,500)
  ),
  new select("with_watch_providers", "Available on", formatWatchProviders(), true),
  new select("with_watch_monetization_types", "with monetization types", [
    {text:"Flatrate", value:"flatrate"},
    {text:"Free", value:"free"},
    {text:"Ads", value:"ads"},
    {text:"Rent", value:"rent"},
    {text:"Buy", value:"buy"}
  ], true)
]  
</script>


<form action="" class="advancedSearchForm">
  {#each formItems as formItem}
    {#if formItem.type === "select"}
      <Selector bindedValue={formItem.selected} fetchItemsFunction={()=>formItem.get_options()} label={formItem.label}/>
    {:else if formItem.type === "checkbox"}
      <Checkbox label={formItem.label} value={formItem.name} checked={formItem.checked}/>
    {:else if formItem.type === "date"}
      <DatePicker label={formItem.label} options={formItem.options}/>
    {:else if formItem.type === "range"}
      {#each formItem.items as formItem}
        {#if formItem.type === "select"}
          <Selector bindedValue={formItem.selected} fetchItemsFunction={()=>formItem.get_options()} label={formItem.label}/>
        {:else if formItem.type === "checkbox"}
          <Checkbox label={formItem.label} value={formItem.name} checked={formItem.checked}/>
        {:else if formItem.type === "date"}
          <DatePicker label={formItem.label} options={formItem.options}/>
        {:else if formItem.type === "numberInput"}
          <label>
            {formItem.label}
            <input type="number" min={formItem.min} max={formItem.max} bind:value={formItem.value}/>Minute{formItem.value>1 ? "s":""}
          </label>
        {/if}
      {/each}
    {:else if formItem.type === "searchTag"}
      <SearchTag label={formItem.label}/>
    {/if}
  {/each}
  <button>Search</button>
</form>

<style>
  form{
    color:$FontColor;
    display: flex;
    flex-direction: column;
    max-width: 50%;
    margin: auto;
  }
  label{
    display: flex;
    input{
      margin: 0 0.4rem;
      flex-grow:1;
    }
  }
</style>