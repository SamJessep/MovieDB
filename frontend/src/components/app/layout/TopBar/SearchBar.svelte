<script>
import {push} from 'svelte-spa-router'
import {Search} from '../../../../model/TMDbAPI';
import { writable } from 'svelte/store'
import { slide, fly } from 'svelte/transition';
import { fade } from 'svelte/transition';
import debounce from 'lodash/debounce'

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
let SearchField
let searchValue = "";
let oldSearchValue = "";
let suggestionIndex = -1;
let searchOpen = false;
let suggestionsListElement;

function selectTab(tabName){
  let tmpTabs = $tabs
  for(let t of tmpTabs){
    t.active = t.name == tabName
  }
  tabs.set(tmpTabs)
  Loadsuggestions()
}

function clickTab(tabName){
  selectTab(tabName)
  const tabElement = document.getElementById("tab-"+$tabs.find(t=>t.name == tabName).name);
  if(tabElement) tabElement.focus()
  suggestionIndex = -1;
}

function SendSearch(query){
  if(query != ""){
    let searchType = $tabs.find(t=>t.active).search_type;
    push(`/Search/${searchType}/${query}`)
    SearchField.blur()
  }
}

function SelectSuggestion(suggestion){
  searchValue = suggestion;
  SendSearch(suggestion)
}

function KeyDown(e){
  if((SearchArea.contains(e.target) )&& e.code == "ArrowUp" || e.code == "ArrowDown"){
   e.preventDefault()
  }
  if(e.keyCode == 81 && e.ctrlKey){
    e.preventDefault()
    SearchField.focus()
  }
}

function KeyPressed(e){
  if(SearchArea.contains(document.activeElement)){
    searchOpen=searchValue != "";
  }
  if(!SearchArea.contains(document.activeElement)) return
  let btns = document.querySelectorAll(".result-item")
  if(searchValue != oldSearchValue){
      Loadsuggestions()
  }
  //Left Arrow
  else if(e.keyCode == 37){
    if(suggestionsListElement.contains(document.activeElement)){
      const tabIndex = $tabs.indexOf($tabs.find(t=>t.active))
      const newTabIndex = tabIndex-1>-1 ? tabIndex-1 : $tabs.length-1
      clickTab($tabs[newTabIndex].name)
    }
  }
  //Up Arrow
  else if(e.keyCode == 38){
    suggestionIndex = suggestionIndex>0? suggestionIndex-1 : btns.length-1;
    btns[suggestionIndex].focus()
  }
  //Right Arrow
  else if(e.keyCode == 39){
    if(suggestionsListElement.contains(document.activeElement)){
      const tabIndex = $tabs.indexOf($tabs.find(t=>t.active))
      const newTabIndex = tabIndex+1<$tabs.length ? tabIndex+1 : 0
      clickTab($tabs[newTabIndex].name)
    }
  }
  //Down Arrow
  else if(e.keyCode == 40){
    suggestionIndex = suggestionIndex>=btns.length-1? 0 : suggestionIndex+1;
    btns[suggestionIndex].focus()
  }
  else if(e.keyCode == 13){
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
  selectTab("All");
}

const Loadsuggestions = debounce(async ()=>{
  //If search blank, dont search
  if(searchValue == "") return
  const searchRegex = new RegExp(`(${searchValue.replaceAll(' ', '\\s?')})`, 'i')

  let tmpTabs = $tabs;
  let activeTab = tmpTabs.find(t=>t.active);
  activeTab.suggestions=Search(searchValue, activeTab.search_type).then(
    res=>res.results
    .splice(0,5)
    .map(r=>r.title || r.original_title || r.name)
    .map(r=>{
      return{
        text:r,
        parts:r.split(searchRegex).map(p=>{
        return {
          highlighted: searchRegex.test(p),
          text: p
        }
      })
      }
    }
    )
  )
  tabs.set(tmpTabs)
}, 200)

function SearchFieldFocusChanged(event){
  searchOpen = searchValue != "" && !(event.type == "blur" && !(SearchArea.contains(event.relatedTarget) || SearchArea.contains(document.activeElement)))
  searchBarFocused = event.type === "focus" && event.target === SearchField;
  if(!searchOpen) suggestionIndex = -1;
}

export function Clear(){
  searchValue = ""
}

var searchBarFocused = false
</script>


<div id="searchBarContainer" class="panel" bind:this={SearchArea}>
  <div class="panel-block">
    <p class="control has-icons-left is-large">
      <input 
        class="input is-large SB"
        placeholder="Search MovieDB"
        bind:this={SearchField}
        bind:value={searchValue}
        on:blur={SearchFieldFocusChanged}
        on:focus={SearchFieldFocusChanged}
        on:search={()=>{SendSearch(searchValue)}}
      />
      <span class="icon is-left" id="searchIcon">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
      <span class="shortcut" class:shown={!searchBarFocused && searchValue == ""}>
        <kbd>Ctrl</kbd> + <kbd>q</kbd>
      </span>
    </p>
  </div>
  {#if searchOpen}
  <div id="datalist" transition:slide bind:this={suggestionsListElement}>
    <p class="panel-tabs">
      {#each $tabs as tab,index (tab.name)}
          <button id="tab-{tab.name}"class:is-active={tab.active} on:blur={SearchFieldFocusChanged}
          on:focus={SearchFieldFocusChanged} on:click={()=>clickTab(tab.name)}>{tab.name}</button>
      {/each}
    </p>
    <p class="results">
      {#await $tabs.find(t=>t.active).suggestions}
        <div class="info-message result-item" in:fade>Loading...</div>
      {:then suggestions}
        {#each suggestions as suggestion}
          <button class="result-item" on:click={()=>SelectSuggestion(suggestion.text)}         on:blur={SearchFieldFocusChanged}
            on:focus={SearchFieldFocusChanged} in:fade>
            <p>
              {#each suggestion.parts as suggestionPart}
                {#if suggestionPart.highlighted}
                  <span class="highlighted">{suggestionPart.text}</span>
                {:else}
                  {suggestionPart.text}
                {/if}
              {/each}
            </p>
          </button>
          {:else}
            <div class="info-message result-item" in:fade>No Suggestions</div>
        {/each}
      {:catch error}
      <div class="result-item error-container" in:fade>
        <ErrorSmall userMessage="Failed loading suggestions" errorMessage={error.message}/>
        <button on:click={Loadsuggestions} class="retry-btn volatile-btn">Retry</button>
      </div>
      {/await}
    </p>
  </div>
  {/if}
  </div>
  <svelte:window on:click={DocumentClick} on:keyup={KeyPressed} on:keydown={KeyDown}
  />

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

  .highlighted{
    color: $AccentColor;
  }

  .shortcut{
    position: absolute;
    top: 0;
    right: 0px;
    height: 100%;
    padding-right: 1rem;
    display:none;
    &.shown{
      display: flex;
      align-items: center;
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

  #datalist{
    position: absolute;
    width: 100%;
    background-color: $PanelColor;
    padding-bottom: 1rem;
    border-radius: 0 0 1rem 1rem;
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

  @media only screen and (max-width: $MobileWidth){
		#searchIcon{
			font-size: 1rem;
		}
    .SB{
      font-size: 1rem;
    }
    .shortcut.shown{
      display:none;
    }
	}
</style>
