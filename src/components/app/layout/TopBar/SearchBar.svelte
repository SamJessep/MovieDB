<script>
import {push} from 'svelte-spa-router'
import {Search} from '../../../../model/TMDbAPI';
import { writable } from 'svelte/store'

//UI components
import ErrorSmall from '../../../general/ErrorSmall.svelte';

class tab {
  constructor(name, search_type, suggestions, active){
    this.name = name
    this.search_type = search_type
    this.suggestions = suggestions
    this.active = active;
  }
}

let tabs = writable([
  new tab("All", "multi", [], true),
  new tab("Movie", "movie", [], false),
  new tab("TV", "tv", [], false)
])

let SearchArea
let searchValue = "";
let oldSearchValue = "";
let suggestionIndex = -1;
let searchOpen = false;

function clickTab(tabName){
  let tmpTabs = $tabs
  for(let t of tmpTabs){
    t.active = t.name == tabName
  }
  tabs.set(tmpTabs)
  Loadsuggestions()
}

function SendSearch(query){
  if(query != ""){
    let searchType = $tabs.find(t=>t.active).search_type;
    push(`/Search/${searchType}/${query}`)
  }
}

function SelectSuggestion(suggestion){
  searchOpen = false
  searchValue = suggestion;
  console.log(suggestion, searchValue)
  SendSearch(suggestion)
}

function KeyPressed(e){
  searchOpen=searchValue != "";
  if(!SearchArea.contains(document.activeElement)) return
  let btns = document.querySelectorAll(".result-item")
  if(searchValue != oldSearchValue){
      Loadsuggestions()
  }
  else if(e.code == "ArrowUp"){
    suggestionIndex = suggestionIndex>0? suggestionIndex-1 : btns.length-1;
    btns[suggestionIndex].focus()
  }
  else if(e.code == "ArrowDown"){
    suggestionIndex = suggestionIndex>=btns.length-1? 0 : suggestionIndex+1;
    btns[suggestionIndex].focus()
  }
  else if(e.code == "Enter"){
    //If suggestion is focused via tab or arrow keys => enter
    if(suggestionIndex>=0 && suggestionIndex<btns.length){
      btns[suggestionIndex].click()
    }
    //No suggestion is focused via tab or arrow keys => enter
    if(suggestionIndex == -1){
      SendSearch(searchValue)
    }
  }
  oldSearchValue = searchValue
}

function DocumentClick(e){
  //If user clicks off the search drop down, close it
  if(SearchArea.contains(e.target)) return
  if([...e.target.classList].includes("volatile-btn")) return
  searchOpen = false
  clickTab("All");
}

async function Loadsuggestions(){
  //If search blank, dont search
  if(searchValue == "") return

  let tmpTabs = $tabs;
  let activeTab = tmpTabs.find(t=>t.active);
  activeTab.suggestions=Search(searchValue, activeTab.search_type).then(res=>
   res.results.splice(0,5).map(r=>r.title || r.original_title || r.name)
  )
  tabs.set(tmpTabs)
}

</script>


<div id="searchBarContainer" class="panel" bind:this={SearchArea}>
  <div class="panel-block">
    <p class="control has-icons-left is-large">
      <input 
        class="input is-large SB"
        placeholder="Search MovieDB"
        bind:value={searchValue} 
        on:focus={()=>{suggestionIndex = -1; searchOpen=searchValue!=""}} 
        on:search={()=>{SendSearch(searchValue)}}
      />
      <span class="icon is-left" id="searchIcon">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
    </p>
  </div>
  <div id="datalist" class:isOpen={searchOpen}>
    <p class="panel-tabs">
      {#each $tabs as tab,index (tab.name)}
          <button class:is-active={tab.active} on:click={()=>clickTab(tab.name)} on:focus={suggestionIndex=index}>{tab.name}</button>
      {/each}
    </p>
    <p class="results">
      {#await $tabs.find(t=>t.active).suggestions}
        <div class="info-message result-item">Loading...</div>
      {:then suggestions}
        {#each suggestions as suggestion}
          <button class="result-item" on:click={()=>SelectSuggestion(suggestion)}>{suggestion}</button>
          {:else}
            <div class="info-message result-item">No Suggestions</div>
        {/each}
      {:catch error}
      <div class="result-item error-container">
        <ErrorSmall userMessage="Failed loading suggestions" errorMessage={error.message}/>
        <button on:click={Loadsuggestions} class="retry-btn volatile-btn">Retry</button>
      </div>
      {/await}
    </p>
  </div>
  </div>
  <svelte:window on:click={DocumentClick} on:keyup={KeyPressed} on:keydown={(e)=>{
    if(SearchArea.contains(e.target) && e.code == "ArrowUp" || e.code == "ArrowDown") e.preventDefault()}
  }/>

<style lang="scss">
/* Fix search icon showing through overlays */
  #searchIcon{
    z-index: 0;
  }
  .SB{
    border-bottom: solid transparent 3px;
    &:focus{
      border-bottom: solid $AccentColor 3px;
    }
  }


  #searchBarContainer{
    flex-grow:1;
    margin: auto;
    position: relative;
    div{
      border:none;
    }
  }

  .isOpen{
    display: block;
  }

  #datalist{
    position: absolute;
    width: 100%;
    background-color: $PanelColor;
    padding-bottom: 1rem;
    border-radius: 0 0 1rem 1rem;
    &:not(.isOpen){
      display: none;
    }
  }

  .panel-tabs{
    border-bottom: 0.15rem solid $FontColor;
    &>button{
      font-size: $HeaderFontSize;
      padding: 0.5rem;
      outline: none;
    }
  }

  .info-message{
    color:white;
    font-size: $BodyFontSize;
    user-select: none;
  }

  button:not(.retry-btn){
    border:none;
    color: $FontColor;
    background-color: transparent;
    width: 100%;
    border-bottom: solid transparent 3px;
    &:hover, &:focus{
      background-color: $PanelHover;
      border-bottom: solid $SelectedColor 3px;
      &.result-item{
        color:$AccentColor;
      }
    }
    &:focus, &:active{
      border-bottom: solid $SelectedColor 3px;
      outline: none;
      &.result-item{
        color:$AccentColor;
      }
    }
    &.is-active{
      border-bottom: solid $AccentColor 3px;
    }
  }

  .result-item{
    align-items: center;
    display: flex;
    justify-content: flex-start;
    padding: 0.5em 0.75em;
    outline: none;
    width: 100%;
    font-size: $BodyFontSize;
    &:not(.retry-btn){
      border-bottom: 3px solid $FontColor;
    }
  }

  .error-container{
    display:block;
  }

  .retry-btn{
    display:block;
    padding: 0.2rem 2rem;
    margin: auto;
  }
</style>
