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
    push('/Search/movie/'+query)
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
  if(!SearchArea.contains(e.target))searchOpen = false
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


<div id="search" class="panel" bind:this={SearchArea}>
  <div class="panel-block">
    <p class="control has-icons-left is-large">
      <input class="input is-large SB" type="search" placeholder="Search MovieDB" bind:value={searchValue} on:focus={()=>{s_index = -1; searchOpen=true}}/>
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
      {#each $tabs.filter(t=>t.active)[0].sugestions as sugestion}
        <button class="panel-block suggestion-btn nonStandard" on:click={()=>SelectSuggestion(sugestion)}>{sugestion}</button>
      {/each}
  </div>
  </div>
  <svelte:window on:click={DocumentClick} on:keyup={KeyPressed} on:keydown={(e)=>{
    if(SearchArea.contains(e.target) && e.code == "ArrowUp" || e.code == "ArrowDown") e.preventDefault()}
  }/>

<style>

  #search{
    max-width: 85vw;
    margin: auto;
  }

  #search>div{
    border:none;
  }

  .isOpen{
    display: block;
  }
  #datalist:not(.isOpen){
    display: none;
  }

  button.nonStandard{
    background: none;
    color: var(--FontColor);
    border: none;
  }

  .panel-tabs>button.section{
    font-size: var(--HeaderFontSize);
    padding: 0;
    outline: none;
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
