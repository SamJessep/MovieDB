<script>
import { GetWatchProviders, SearchPeople, SearchCompany, SearchKeywords,GetGenres } from "../../../../model/TMDbAPI";
import {push} from "svelte-spa-router";

import Checkbox from "../../../form/Checkbox.svelte"
import DatePicker from "../../../form/DatePicker.svelte"
import NumberInput from "../../../form/NumberInput.svelte";
import SearchTag from "../../../form/SearchTag.svelte"
import Selector from "../../../form/Selector.svelte"
import AddButton from "../../ResultList/AddButton.svelte"

class formItem{
  constructor(name,label,type){
    this.label = label
    this.name = name
    this.type = type
    this.instance
  }
} 
class select extends formItem{
  constructor(name,label, options, multiple=false, isMandatory=false){
    super(name,label,"select")
    this.options = options
    this.selected = options[0]
    this.multiple=multiple
    this.mandatoryChoice=isMandatory
  }

  get_selected(){
    return this.selected
  }

  get_options(){
    return this.options
  }
  getValue(el){
    let val = this.instance.getSelectedOptions().join(",");
    return val == "" ? null : val;
  }
}

class selectAsync extends select{
  constructor(name,label, fetchMethod, multiple=false){
    super(name,label,[0],multiple)
    this.getOptionsAsync = fetchMethod
  }

  async get_options(){
    return await this.getOptionsAsync();
  }
}

class defaultselect extends formItem{
  getValue(el){
    return el.selectedOptions[0].value
  }
}

class datepicker extends formItem{
  constructor(name, label, options){
    super(name,label,"date")
    this.options = options
  }
  getValue(el){
    return this.instance.value == "" ? null : this.instance.value;
  }
}

class checkbox extends formItem{
  constructor(name, label, checked = false){
    super(name, label,"checkbox")
    this.checked = checked
  }

  getValue(el){
    return null;
  }

}

class searchTag extends formItem{
  constructor(name, label, placeholder, getSuggestionMethod){
    super(name, label, "searchTag")
    this.getSuggestions = getSuggestionMethod
    this.placeholder = placeholder
  }

  getValue(el){
    let val = this.instance.selected.map(item=>item.id).join(",")
    return val == "" ? null : val
  }
}

class numberInput extends formItem{
  constructor(name, label, min, max){
    super(name, label, "numberInput")
    this.inputType = "number"
    this.min = min
    this.max = max
  }

  getValue(el){
    return el.value == "" ? null : el.value;
  }
}

function generateYearsList(){
  const currentYear = new Date().getFullYear();
  const firstYear = 1895;
  let yearsList = []
  for(let year = currentYear; year>=firstYear; year--){
    yearsList.push({text:year, value:year})
  }
  return yearsList;
}

function formatWatchProviders(){
  return GetWatchProviders(media_type, "NZ").then(r=>{
    return r.results.map(p=>{return {value:p.provider_id, text:p.provider_name, icon:p.logo_path}})
  })
}

async function GetPeopleSuggestions(query){
  const res = await SearchPeople(query);
  const people = res.results.map(person=>{return {text:person.name, id:person.id}})
  return people;
}

async function GetCompanySuggestions(query){
  const res = await SearchCompany(query);
  const companies = res.results.map(company=>{return {text:company.name, id:company.id}})
  return companies;
}

async function GetGenreSuggestions(query){
  const res = await GetGenres(media_type);
  const genres = res.genres.map(genre=>{return {text:genre.name, value:genre.id}})
  return genres;
}

async function GetKeywordSuggestions(query){
  const res = await SearchKeywords(query);
  const keywords = res.results.map(item=>{return {text:item.name, id:item.id}})
  return keywords;
}

const ratingItems = [
  {value:1, text:1},
  {value:2, text:2},
  {value:3, text:3},
  {value:4, text:4},
  {value:5, text:5},
  {value:6, text:6},
  {value:7, text:7},
  {value:8, text:8},
  {value:9, text:9},
  {value:10, text:10}
]

var media_type="movie"
const tvItems = [
  new select("sort_by","Sort", [
    {value:"popularity", text:"Popularity"},
    {value:"release_date", text:"Release Date" },
    {value:"revenue", text:"Revenue" },
    {value:"primary_release_date", text:"Primary Release Date"},
    {value:"original_title", text:"Title"},
    {value:"vote_average", text:"Rating" },
    {value:"vote_count", text:"Rating Count" }
  ],false,true),
  new defaultselect(),
]
const movieItems = [
  new select("sort_by","Sort", [
    {value:"popularity", text:"Popularity"},
    {value:"release_date", text:"Release Date" },
    {value:"revenue", text:"Revenue" },
    {value:"primary_release_date", text:"Primary Release Date"},
    {value:"original_title", text:"Title"},
    {value:"vote_average", text:"Rating" },
    {value:"vote_count", text:"Rating Count" }
  ],false,true),
  new defaultselect(),
  new select("vote_average.gte", "Rating greater than", ratingItems, false),
  new select("vote_average.lte", "Rating less than", ratingItems, false),
  new select("primary_release_year","Release Year", generateYearsList()),
  new datepicker("primary_release_date.lte","Release Date Less than", {minDate:"1900-01", maxDate:"today"}), 
  new datepicker("primary_release_date.gte","Release Date Greater than", {minDate:"1900-01", maxDate:"today"}),
  new select("with_release_type", "Release Type", [
    {value:"1", text:"Premiere"},
    {value:"2", text:"Theatrical (limited)"},
    {value:"3", text:"Theatrical"},
    {value:"4", text:"Digital"},
    {value:"5", text:"Physical"},
    {value:"6", text:"TV"}
  ], true),
  new searchTag("with_cast", "With Cast", "Start typing to get cast suggestions", GetPeopleSuggestions),
  new searchTag("with_crew", "With Crew", "Start typing to get crew suggestions", GetPeopleSuggestions),
  new searchTag("with_people", "With People", "Start typing to get suggestions", GetPeopleSuggestions),
  new searchTag("with_companies", "With Companies","Start typing to get company suggestions", GetCompanySuggestions),
  new selectAsync("with_genres", "With Genres", GetGenreSuggestions, true),
  new searchTag("with_keywords", "With Keywords","Start typing to get keyword suggestions", GetKeywordSuggestions),
  new numberInput("with_runtime.gte", "Run time longer than", 0,500),
  new numberInput("with_runtime.lte", "Run time shorter than", 0,500),
  new select("with_watch_providers", "Available on", formatWatchProviders(), true),
  new select("with_watch_monetization_types", "with monetization types", [
    {text:"Flatrate", value:"flatrate"},
    {text:"Free", value:"free"},
    {text:"Ads", value:"ads"},
    {text:"Rent", value:"rent"},
    {text:"Buy", value:"buy"}
  ], true)
]

var formItems = movieItems

const submit = e=>{
  const els = e.target.elements;
  const keys = Object.keys(els).filter(key=>!key.match(/^\d/) && key!= "media_type")
  let kvPairs = keys.map(k=>{return {key:k,element:els[k]}})
  let returnParams = {};
  for(let i = 0; i<kvPairs.length; i++){
    const vEl = formItems[i];
    const aEl = kvPairs[i].element
    kvPairs[i].value = vEl.getValue(aEl)
    returnParams[kvPairs[i].key] = kvPairs[i].value
  }
  returnParams.sort_by = returnParams.sort_by+"."+returnParams.sort_dir;
  for(let key in returnParams){
    if(returnParams[key] == null || key == "sort_dir"){
      delete returnParams[key]
    }
  }
  const queryString = new URLSearchParams(returnParams).toString();
  const url = queryString == "" ? `/Discover/${media_type}/Advanced` : `/Discover/${media_type}/Advanced?${queryString}` 
  push(url)
}

const selectMediaType = e=>{
  if(media_type === "tv"){
    formItems = tvItems
  }else if (media_type === "movie"){
    formItems = movieItems
  }
}
</script>


<form action="" class="advancedSearchForm" on:submit|preventDefault={submit}>
  <fieldset>
    <legend>Media Type</legend>
    <label>TV<input type="radio" value="tv" bind:group={media_type} on:change={selectMediaType}></label>    
    <label>Movie<input type="radio" value="movie" bind:group={media_type} on:change={selectMediaType}></label>
  </fieldset>
  {#each formItems as formItem}
  <div class:controlWrapper={formItem.type!=null}>
    {#if formItem.type === "select"}
      <Selector selectID={formItem.name} name={formItem.name} fetchItemsFunction={()=>formItem.get_options()} label={formItem.label} multiple={formItem.multiple} bind:this={formItem.instance} mandatoryChoice={formItem.mandatoryChoice}>
        {#if formItem.name == formItems[0].name}
        <div class="dirWrapper">
        <label class="dirLabel" for="sort_dir">Sort direction:</label>  
          <select id="sort_dir">
            <option value="desc">High to Low</option>
            <option value="asc">Low to High</option>
          </select>
        </div>
        {/if}  
      </Selector>
    {:else if formItem.type === "checkbox"}
      <Checkbox label={formItem.label} value={formItem.name} checked={formItem.checked} bind:this={formItem.instance}/>
    {:else if formItem.type === "date"}
      <DatePicker name={formItem.name} id={formItem.name} label={formItem.label} options={formItem.options} bind:this={formItem.instance}/>
    {:else if formItem.type === "numberInput"}
    <NumberInput name={formItem.name} label={formItem.label} id={formItem.name} min={formItem.min} max={formItem.max} bindedValue={formItem.value} bind:this={formItem.instance}/>
    {:else if formItem.type === "searchTag"}
      <SearchTag name={formItem.name} label={formItem.label} getSuggestions={formItem.getSuggestions} id={formItem.name} placeholder={formItem.placeholder} bind:this={formItem.instance}/>
    {/if}
  </div>
  {/each}
  <button class="searchBtn">Search</button>
</form>

<style lang="scss">
  form{
    color:$FontColor;
    display: flex;
    flex-direction: column;
    max-width: 50%;
    margin: auto;
  }

  fieldset label{
    display: inline;
    text-align: center;
    input{
      flex-grow:0;
    }
  }

  label{
    display: flex;
    input{
      margin: 0 0.4rem;
      flex-grow:1;
    }
  }

  .controlWrapper{
    margin-bottom: 0.25rem;
  }

  .searchBtn{
    @include darkBtnOutline;
  }

  select{
    width: 100%;
    background-color: $PanelColor;
    padding: 0.25rem;
    color: $FontColor;
    border-radius: 0.2rem;
    border: solid transparent 2px;
    min-width: 20ch;
  }

  select:focus{
    outline:none;
    border-radius: 0.2rem;
    border: solid $AccentColor 2px;
  }

  .dirLabel{
    margin:auto;
    color: $FontColor;   
    padding: 0 10px;
    white-space: nowrap;
  }

  .dirWrapper{
    background-color: $PanelColor;
    border-radius: 0.2rem;
    margin-left: 10px;
    border: solid $PanelHover 2px;
    display: flex;
  }

  @media only screen and (max-width: $MobileWidth){
    form{
      max-width: 90%;
      margin: auto;
    }

    select{
      min-width: auto;
      font-size: $BaseFontSize-Mobile;
    }

    .dirLabel{
      padding: 0 5px;
      font-size: $BaseFontSize-Mobile;
    }

    .dirWrapper{
      margin-left: 5px;
      border: solid $PanelHover 2px;
    }

  }

</style>