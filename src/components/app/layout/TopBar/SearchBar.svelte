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
  SendSearch(suggestion)
}

function KeyPressed(e){
  searchOpen=searchValue != "";
  if(!SearchArea.contains(document.activeElement)) return
  let btns = document.querySelectorAll(".suggestion-btn")
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
  if(!SearchArea.contains(e.target)){
    searchOpen = false
    clickTab("All");
  }
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
      <span class="icon is-left">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
    </p>
  </div>
  <div id="datalist" class:isOpen={searchOpen}>
    <p class="panel-tabs">
      {#each $tabs as tab,index (tab.name)}
          <button class:is-active={tab.active} class="nonStandard section" on:click={()=>clickTab(tab.name)} on:focus={suggestionIndex=index}>{tab.name}</button>
      {/each}
    </p>
    <p class="results">
      {#await $tabs.find(t=>t.active).suggestions}
        <div class="panel-block info-message">Loading...</div>
      {:then suggestions}
        {#each suggestions as suggestion}
          <button class="panel-block suggestion-btn nonStandard" on:click={()=>SelectSuggestion(suggestion)}>{suggestion}</button>
          {:else}
            <div class="panel-block info-message">No Suggestions</div>
        {/each}
      {:catch error}
        <ErrorSmall userMessage="Failed loading suggestions" errorMessage={error.message} />
      {/await}
    </p>
  </div>
  </div>
  <svelte:window on:click={DocumentClick} on:keyup={KeyPressed} on:keydown={(e)=>{
    if(SearchArea.contains(e.target) && e.code == "ArrowUp" || e.code == "ArrowDown") e.preventDefault()}
  }/>

<style>

  #searchBarContainer{
    flex-grow:1;
    margin: auto;
    position: relative;
  }

  #searchBarContainer>div{
    border:none;
  }

  .isOpen{
    display: block;
  }

  .results{
    border-radius: 0 0 1rem 1rem;
  }

  #datalist{
    position: absolute;
    width: 100%;
    background-color: rgb(58, 58, 58);
    
  }

  #datalist:not(.isOpen){
    display: none;
  }

  button.nonStandard{
    background: none;
    color: var(--FontColor);
    border: none;
  }

  .panel-tabs{
    border-bottom: 0.15rem solid white;
  }

  .panel-tabs>button.section{
    font-size: var(--HeaderFontSize);
    padding: 0.5rem;
    outline: none;
  }

  .info-message{
    color:white;
    font-size: var(--BodyFontSize, 1rem);
    user-select: none;
  }

  button:hover{
    background-color: rgb(44, 44, 44);
  }
  .panel-tabs>button.section.is-active{
    color: var(--SelectedColor);
  }
  
  .panel-tabs>button.section.is-active:focus, button.nonStandard:active, button.nonStandard:focus{
    color: var(--AccentColor);
  }

  button.nonStandard{
    outline: none;
    width: 100%;
    font-size: var(--BodyFontSize);
    border-bottom: 0.1rem solid var(--FontColor);
  }
</style>
