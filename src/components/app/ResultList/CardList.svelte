<script>
import {QueryToJSON} from '../../../util'
import { onMount, onDestroy, afterUpdate} from 'svelte';
import {location, querystring, replace} from 'svelte-spa-router'
import {LoadQueue, Loaded} from '../../../stores/resultsStore';

import ScrollButton from './ScrollButton.svelte';
import Page from './Page.svelte'
import Sort from './Sort.svelte'
import ErrorSmall from '../../general/ErrorSmall.svelte';

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
let cardContainer;
let pageElements;
let shownPage = StartPage;
let loadTopY = 0;

let loadDir = 0;
$:currentPage
$:{
  pages = [...Array(totalPages).keys()].map(p=>p+1)
  loadedPages = [...Array(currentPage+loadDir).keys()].map(p=>p+1)
  loadedPages = loadedPages.slice(loadedPages.length-2)
}

let loadBottom
let loadTop
// $:initIntersectionObserver(loadTop, loadBottom)
var observer;
var currentPageObserver;
var target_page_focused = false;
var unsubscribeLoadQueue;
$:{
  if(target_page_focused) unsubscribeLoadQueue()
}
onMount(()=>{
  resultPromise = GetPages(currentPage)
  
  //If user reloads page after scrolling, load the last page and focus it
  if(currentPage !=  1){
    let target_page_queued = false;
    target_page_focused = false;
    unsubscribeLoadQueue = LoadQueue.subscribe(queue=>{
      if(target_page_focused) return
      const page_element = document.getElementById("page-"+currentPage)
      if(target_page_queued && !queue.includes(currentPage) && page_element){
        window.scrollTo(0, page_element.offsetTop)
        target_page_focused = true
        initIntersectionObserver(loadTop, loadBottom)
      }
      target_page_queued = queue.includes(currentPage)
    })
  }else{
    window.scrollTo(0,0)
    initIntersectionObserver(loadTop, loadBottom)
  }
})
onDestroy(()=>{
  if(observer) observer.disconnect()
  if(currentPageObserver) currentPageObserver.disconnect()
})
afterUpdate(()=>{
  pageElements = document.querySelectorAll('.page')
  initPageObserver(pageElements)
  moveTopLoad()
})

function moveTopLoad(){
  if(document.querySelector('.page.Active')) loadTopY= document.querySelector('.page.Active').offsetTop
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
  const overlapBottom = entry.target == loadBottom && entry.isIntersecting
  const overlapTop = entry.target == loadTop && entry.isIntersecting

  const bottomPage = loadedPages[loadedPages.length-1]
  const topPage = loadedPages[0]
  
  if (overlapBottom) {
    if(bottomPage<totalPages && $Loaded){
      console.log("load bottom")
      loadDir = 0
      currentPage = bottomPage+1;
      LoadQueue.update(v=> [...v,currentPage])
    }
  }
  
  if (overlapTop) {
    if(topPage>1 && $Loaded){
      console.log("load top")
      loadDir = 1;
      currentPage = topPage-1;
      LoadQueue.update(v=> [...v,currentPage])
    }
  }

}

const checkForNewPage = entry => {
  const page = entry.target.dataset.page
  if(entry.isIntersecting && shownPage != page) {
    console.log(`changing to page ${page}`)
    shownPage = page
    let regexRes = /\/(?<page>\d+)/.exec($location)
    let newLocation = regexRes ? $location.replace("/"+regexRes.groups.page,"/"+page) :
     $location + ($location.endsWith("/") ? "" : "/" )+currentPage
    replace(newLocation+($querystring ? `?${$querystring}`:""))
  }
}

var pageLoaderEnabled = true;

const initIntersectionObserver = (topDiv, bottomDiv) => {
  if(!topDiv || !bottomDiv) return
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
  if(observer) observer.disconnect()
  observer = new IntersectionObserver(callback, options);
  observer.observe(topDiv);
  observer.observe(bottomDiv);
}

const initPageObserver = (pages) => {
  const callback = entries => {
    entries.forEach(entry =>{
      checkForNewPage(entry)
    })
  }
  var options = {
      root: null, // Page as root
      rootMargin: "0px",
      threshold: 0.1
  };
  if(currentPageObserver) currentPageObserver.disconnect()
  currentPageObserver = new IntersectionObserver(callback, options);
  pages.forEach(page=>currentPageObserver.observe(page))
}

function scrollClicked(){
  pageLoaderEnabled = false;
  currentPage = 1
  setTimeout(e=>pageLoaderEnabled=true,1000)
}
</script>
{#if UseResultSort}
  <Sort defaultSelected={DefaultSort}/>
{/if}
<div class="card-list" bind:this={cardContainer}>
  <div class="scroll-block top" bind:this={loadTop} style={"top:"+loadTopY+"px"}/>
  {#key $querystring}
    {#await resultPromise}
    {:then pageData}
      {#each pages as page (page)}
        {#if loadedPages.includes(page) || page<=currentPage}
          <Page page={page} FetchMethod={FetchMethod} MethodParams={MethodParams} Active={loadedPages.includes(page)}/>
        {/if}
      {:else}
        <div class="center_container">
          <h2>No results found</h2>
        </div>
      {/each}
    {:catch error}
    <div class="center_container">
      <ErrorSmall userMessage="Opps somthing went wrong" errorMessage={error}/>
    </div>
    {/await}
  {/key}
  <div class="scroll-block bottom" bind:this={loadBottom}/>
  <ScrollButton on:clicked={scrollClicked}/>
</div>

<style lang="scss">

h2{
  color:$FontColor;
  font-size: $HeaderFontSize;
}

.scroll-block{
  height: 50vh;
  width: 100%;
  z-index: -1;
}

.scroll-block.top{
  position: absolute;
  top:0;
  left:0;
}

.scroll-block.bottom{
  position: relative;
  top: -50vh;
}

.card-list{
  margin: 0 15rem;
}

.center_container{
  display:flex;
  justify-content: center;
}
@media only screen and (max-width: $MobileWidth){
  .card-list{
    margin: 0;
  }
}
</style>
