<script>
import {GetSCSSVars, QueryToJSON} from '../../../util'
import { onMount, onDestroy, afterUpdate} from 'svelte';
import {location, querystring, replace} from 'svelte-spa-router'
import {LoadQueue, Loaded} from '../../../stores/resultsStore';

import ScrollButton from './ScrollButton.svelte';
import Page from './Page.svelte'
import Sort from './Sort.svelte'
import ErrorSmall from '../../general/ErrorSmall.svelte';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import AnimatedIcon from '../../general/AnimatedIcon.svelte';

export let FetchMethod;
export let MethodParams =[];
export let StartPage;
export let DefaultSort = "None";
export let UseResultSort = true;
let totalResults = 0;
let totalPages;
let currentPage = StartPage;
let resultPromise;
let pages = [];
let loadedPages = [];
let shownPage = StartPage;

let loadDir = 0;
$:currentPage
$:{
  pages = [...Array(totalPages).keys()].map(p=>p+1)
  loadedPages = [...Array(currentPage+loadDir).keys()].map(p=>p+1)
  loadedPages = loadedPages.slice(loadedPages.length-2)
}

let bottomCards
let topCards
var loadObserver;
var currentPageObserver;
const scss = GetSCSSVars();

onMount(()=>{
  resultPromise = GetPages(currentPage)
  //If user reloads page after scrolling, load the last page and focus it
  if(currentPage !=  1){
    shownPage = currentPage
    getFirstCardAsync(shownPage).then(firstCard => {
      pageLoaderEnabled = false;
      setTimeout(()=>{
        firstCard.scrollIntoView()
        setTimeout(()=>pageLoaderEnabled=true,2000)
      },1000)
    })
  }else{
    window.scrollTo(0,0)
  }
  initLoadObserver()
})
onDestroy(()=>{
  if(loadObserver) loadObserver.disconnect()
  if(currentPageObserver) currentPageObserver.disconnect()
})
afterUpdate(async ()=>{
  await waitTillLoaded()
  const cards = document.querySelectorAll(".resultCard")
  initPageObserver(cards)
  initLoadObserver()
})

const waitTillLoaded = async()=>{
    return new Promise(function (resolve, reject) {
        (function wait(){
            if ($Loaded) return resolve();
            setTimeout(wait, 30);
        })();
    });
  }


  const getFirstCardAsync = async page=>{
    return new Promise(function (resolve, reject) {
        (function wait(){
          const res = document.querySelector(`#page-${page}>.resultCard`)
          if (res) return resolve(res);
          setTimeout(wait, 30);
        })();
    });
  }

function GetPages(page){
  let promise = FetchMethod(...MethodParams, {page:page, ...QueryToJSON($querystring)}).then(res=>{
    totalPages = res.total_pages;
    currentPage = res.page;
    return res.results.filter(r=>!r['media_type'] || r.media_type == "movie" || r.media_type == "tv")
  })
  return promise
}

const checkForPageLoad = async entry => {
  const overlapBottom = bottomCards.includes(entry.target) && entry.isIntersecting
  const overlapTop = topCards.includes(entry.target) && entry.isIntersecting

  const bottomPage = loadedPages[loadedPages.length-1]
  const topPage = loadedPages[0]
  if($Loaded){
    if (overlapBottom) {
        loadPage(bottomPage+1)
        loadDir = 0
    }
    else if (overlapTop) {
      if(topPage>1 && $Loaded){
        loadPage(topPage-1)
        loadDir = 1;
      }
    }
  }

}

const loadPage = newPage => {
  if(loadedPages.includes(newPage) || newPage > totalPages) return
  currentPage = newPage;
  LoadQueue.update(currentQueue=> [...currentQueue,newPage])
}

const checkForNewPage = entries =>{
  const pageCounts = [...new Set(entries.map(entry=>{
      const el = entry.target
      const page = el.parentElement.dataset.page
      return Number(page)
  }))]
  const page = pageCounts[0]
  if(shownPage != page && pageCounts.length == 1) {
    shownPage = page
    let regexRes = /\/(?<page>\d+)/.exec($location)
    let newLocation = regexRes ? $location.replace("/"+regexRes.groups.page,"/"+page) :
     $location + ($location.endsWith("/") ? "" : "/" )+currentPage
    replace(newLocation+($querystring ? `?${$querystring}`:""))
  }
}

var pageLoaderEnabled = true;

const initLoadObserver = () => {

  const activeCards = document.querySelectorAll(".page.Active");
  if(activeCards.length == 0) return 
  topCards = [...activeCards[0].querySelectorAll(".resultCard")]
  bottomCards = [...activeCards[activeCards.length-1].querySelectorAll(".resultCard")]

  topCards = topCards.slice(0, 4)
  bottomCards= bottomCards.slice(bottomCards.length-4)
  const callback = entries => {
    entries.forEach(entry => {
      if(pageLoaderEnabled) checkForPageLoad(entry);
    });
  }
  var options = {
      root: null, // Page as root
      rootMargin: "0px",
      threshold: 1.0
  };
  if(loadObserver) loadObserver.disconnect()
  loadObserver = new IntersectionObserver(callback, options);
  topCards.forEach(el=>loadObserver.observe(el));
  bottomCards.forEach(el=>loadObserver.observe(el));
}

const initPageObserver = (cards) => {
  var options = {
      root: null, // Page as root
      rootMargin: "0px",
      threshold: 1
  };
  if(currentPageObserver) currentPageObserver.disconnect()
  currentPageObserver = new IntersectionObserver(checkForNewPage, options);
  cards.forEach(card=>currentPageObserver.observe(card))
}

function scrollClicked(){
  pageLoaderEnabled = false;
  currentPage = 1
  setTimeout(e=>pageLoaderEnabled=true,1000)
}


</script>
{#if UseResultSort}
  <Sort defaultSelected={QueryToJSON($querystring).sort_by ?? DefaultSort}/>
{/if}
<div class="card-list">
  {#key $querystring}
    {#await resultPromise}
    {:then pageData}
      {#each pages as page (page)}
        {#if loadedPages.includes(page) || page<=currentPage}
          <Page {page} {FetchMethod} {MethodParams} Active={loadedPages.includes(page)} topPage={loadedPages[0] == page}/>
        {/if}
      {:else}
        <div class="center_container">
          
          <div class="icon-container">
            <AnimatedIcon src="images/animatedIcons/warning.json" autoplay={true} styles={`#ID *{ stroke:${scss.FontColor};}`} id="searchError"/>
          </div>
          <p class="info-message">
             No results found</p>
        </div>
      {/each}
    {:catch error}
    <div class="center_container">
      <ErrorSmall userMessage="Opps somthing went wrong" errorMessage={error}/>
    </div>
    {/await}
  {/key}
  <ScrollButton on:clicked={scrollClicked}/>
</div>

<style lang="scss">

h2{
  color:$FontColor;
  font-size: $HeaderFontSize;
}

.card-list{
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin: 0 15rem;
}

.center_container{
  display:flex;
  justify-content: center;
  .info-message{
    flex-grow: 1;
    font-size: 1.5rem;
    color:$FontColor;
    margin-left: 0.5rem;
  }
}
@media only screen and (max-width: $MobileWidth){
  .card-list{
    margin: 0;
  }
}
</style>
