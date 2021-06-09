<script>
import debounce from 'lodash/debounce'

export let id
export let label
export let getSuggestions
export let placeholder
export let name

export let selected = [];
let text = "";
let suggestions = []

const loadSuggestions = debounce(async e=>{
  tryCreateTag()
  if(text == ""){
    suggestions = []
    return;
  }
  suggestions = await getSuggestions(text);
  suggestions = suggestions.slice(0,5)
  console.log("SUGGESTIONS", suggestions)
  tryCreateTag()
}, 300);

function tryCreateTag(){
  if(
    isInSuggestions() && 
    selected.find(i=>i.text.toLowerCase()==text.toLocaleLowerCase()) == undefined
    ){
    selected = [...selected, findSelected()];
    console.log("SELECTED", selected)
    suggestions = []
    text = ""
  }
}

function isInSuggestions(){
  for(let suggestion of suggestions){
    if(text.toLowerCase() == suggestion.text.toLowerCase()){
      return true;
    }
  }
}


function findSelected(){
  for(let suggestion of suggestions){
    if(text.toLowerCase() == suggestion.text.toLowerCase()){
      return suggestion;
    }
  }
  return false;
}

function removeItem(id){
  const newSelected = selected.filter(item=>item.id != id)
  selected = newSelected;
}
</script>

<label for={id}>
{label}
</label>
<div class="selectedItemsContainer">
  {#each selected as item}
  <span class="selected">
    <span class="Text">{item.text}</span>
    <button type="button" class="Remove" on:click={()=>removeItem(item.id)}>X</button>
  </span>
  {/each}
</div>
<input class="searchField" id={id} {name} type="text" list={id+"_list"} on:keyup={loadSuggestions} bind:value={text} {placeholder} autocomplete="off"/>

<datalist id={id+"_list"}>
  {#each suggestions as suggestion}
    <option value={suggestion.text}/>
  {/each}
</datalist>
<svelte:options accessors/>

<style lang="scss">
.selectedItemsContainer{
  display: flex;
  flex-wrap: wrap;
}
.selected{
  background-color: $SecondBackgroundColor;
  border-radius: 3rem;
  margin-bottom: 0.4rem;
  margin-right: 0.4rem;
  display: flex;
  .Remove{
    color:$FontColor;
    background-color: transparent;
    border: none;
    border-radius: 3rem;
    font-size: 1rem;
    width: 2rem;
    height: 100%;
    text-align: center;
    margin: auto;
    &:hover{
      background-color: red;
    }
  }
  .Text{
    margin: auto;
    text-align: center;
    padding: 0.3rem;
    padding-left: 0.6rem;
  }
}

.searchField{
  width: 100%;
  background-color: $PanelColor;
  padding: 0.25rem;
  color: $FontColor;
  border-radius: 0.2rem;
  border: solid $PanelHover 2px;
  &:focus{
    outline:none;
    border-radius: 0.2rem;
    border: solid $AccentColor 2px;
  }
}

</style>