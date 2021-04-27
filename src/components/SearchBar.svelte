<script>
import {push} from 'svelte-spa-router'
import {Search} from '../model/TMDbAPI.js';
import { writable } from 'svelte/store'
let tabs = writable([
  {
    name: "All",
    search_type:"multi",
    sugestions:[],
    active:false
  },
  {
    name: "Movie",
    search_type: "movie",
    sugestions:[],
    active:true
  },
  {
    name: "TV",
    search_type: "tv",
    sugestions:[],
    active:false
  }
])
let SearchArea
let searchValue = "";
let old_searchValue = "";
let s_index = -1;
let searchOpen = false;

function clickTab(tabName){
  let tmpTabs = $tabs
  for(let t of tmpTabs){
    t.active = t.name == tabName
  }
  tabs.set(tmpTabs)
  LoadSugestions()
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
  if(!SearchArea.contains(document.activeElement)) return
  let btns = document.querySelectorAll(".suggestion-btn")
  if(searchValue != old_searchValue){
      LoadSugestions()
  }
  else if(e.code == "ArrowUp"){
    s_index = s_index>0? s_index-1 : btns.length-1;
    btns[s_index].focus()
  }
  else if(e.code == "ArrowDown"){
    s_index = s_index>=btns.length-1? 0 : s_index+1;
    btns[s_index].focus()
  }
  else if(e.code == "Enter" && s_index>=0 && s_index<btns.length){
    btns[s_index].click()
  }
  old_searchValue = searchValue
}

function DocumentClick(e){
  if(!SearchArea.contains(e.target)){
    searchOpen = false
    clickTab("All");
  }
}

async function LoadSugestions(){
  let tmpTabs = $tabs
  tabs.set(tmpTabs.map(t=>{return {...t,sugestions:["Loading..."]}}))
  let tabName = $tabs.filter(t=>t.active)[0].name
  for(let tab of tmpTabs){
    if(tab.name != tabName) continue
    if(searchValue == ""){
      tab.sugestions = []
      continue
    }
    let res = await Search(searchValue, tab.search_type)
    tab.sugestions = res.results.splice(0,5).map(r=>r.title || r.original_title || r.name)
  }
  tabs.set(tmpTabs)
}

</script>


<div id="searchBarContainer" class="panel" bind:this={SearchArea}>
  <div class="panel-block">
    <p class="control has-icons-left is-large">
      <input class="input is-large SB" type="search" placeholder="Search MovieDB" bind:value={searchValue} on:focus={()=>{s_index = -1; searchOpen=true}} on:search={()=>{SendSearch(searchValue)}}/>
      <span class="icon is-left">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
    </p>
  </div>
  <div id="datalist" class:isOpen={searchOpen}>
    <p class="panel-tabs">
      {#each $tabs as tab,index (tab.name)}
          <button class:is-active={tab.active} class="nonStandard section" on:click={()=>clickTab(tab.name)} on:focus={s_index=index}>{tab.name}</button>
      {/each}
    </p>
    <p class="results">
      {#each $tabs.filter(t=>t.active)[0].sugestions as sugestion}
        <button class="panel-block suggestion-btn nonStandard" on:click={()=>SelectSuggestion(sugestion)}>{sugestion}</button>
      {/each}
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

  button:hover{
    background-color: rgb(44, 44, 44);
  }

  .panel-tabs>button.section.is-active, button.nonStandard:active, button.nonStandard:focus{
    color: var(--AccentColor);
  }

  button.nonStandard{
    outline: none;
    width: 100%;
    font-size: var(--BodyFontSize);
    border-bottom: 0.1rem solid var(--FontColor);
  }
</style>
