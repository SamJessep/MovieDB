<script>
  import {push, location, querystring} from "svelte-spa-router"
  import {slide, fly} from 'svelte/transition'
  import {quintOut} from 'svelte/easing'

  export let sortOptions = [
    {value:"popularity", text:"Popularity"},
    {value:"release_date", text:"Release Date" },
    {value:"revenue", text:"Revenue" },
    {value:"primary_release_date", text:"Primary Release Date"},
    {value:"original_title", text:"Title"},
    {value:"vote_average", text:"Rating" },
    {value:"vote_count", text:"Rating Count" },
  ]
  export let disabledOptions = [
    "primary_release_date",
    "original_title",
    "vote_count",
    "revenue"
  ]
  export let defaultSelected = "NONE";
  let selected = defaultSelected;
  disabledOptions = disabledOptions.filter(disabledOption=>disabledOption != defaultSelected.split('.')[0]);
  const SORT_KEY = "sort_by"

  $:{
    changeSort(selected)
  }
  
  function changeSort(selected){
    const params = new URLSearchParams($querystring)
    if(selected === "NONE"){
      params.delete(SORT_KEY)
    }
    else if(params.get(SORT_KEY) != selected){
      params.set(SORT_KEY, selected)
    }
    const newUrl = $location+(params.toString()?"?"+params:params)
    push(newUrl)

  }

  let SortSelect;
</script>

  <label transition:fly={{delay: 250, duration: 300, x: 0, y: -100, opacity: 0.5, easing: quintOut}}>Sort:
    <select bind:value={selected} bind:this={SortSelect}>
      {#if defaultSelected == "NONE"}
      <option value="NONE" selected>No Sort</option>
      {/if}
      {#each sortOptions.filter(o=>!disabledOptions.includes(o.value)) as option}
      <option value={option.value+".asc"}>{option.text}   ▲</option>
      <option value={option.value+".desc"}>{option.text}   ▼</option>
      {/each}
    </select>
  </label>

<style lang="scss">
select{
  color: $FontColor;
  border-radius: 0.2rem;
  font-size: $BodyFontSize;
  padding: 0.2rem;
  background-color: $TransparentPanel;
  border: solid 2px white;
  &:hover, &:focus, &:focus-visible{
    border: solid 2px $AccentColor;
  }
}


label{
  background-color: $TransparentPanel;
  color: $FontColor;
  display: inline-block;
  padding: 0.2rem;
  border-radius: 0 0 0.5rem 0; 
}


</style>
