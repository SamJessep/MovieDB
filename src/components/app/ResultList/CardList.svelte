<script>
import {QueryToJSON} from '../../../util'
import { onMount, onDestroy, afterUpdate} from 'svelte';
import {location, push, querystring, replace} from 'svelte-spa-router'
import Page from './Page.svelte'
import ScrollButton from './ScrollButton.svelte';
import {LoadQueue, Loaded} from '../../../stores/resultsStore';

export let FetchMethod;
export let MethodParams =[];
export let StartPage;

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
    replace(newLocation)
  }
}

const initIntersectionObserver = (topDiv, bottomDiv) => {
  if(!topDiv || !bottomDiv) return
  const callback = entries => {
    entries.forEach(entry => {
      checkForPageLoad(entry);
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
  currentPage = 1
}
</script>
<div class="card-list" bind:this={cardContainer}>
  
  <div class="scroll-block top" bind:this={loadTop} style={"top:"+loadTopY+"px"}/>
  {#await resultPromise}
  {:then pageData}
    {#each pages as page (page)}
      {#if loadedPages.includes(page) || page<=currentPage}
        <Page page={page} FetchMethod={FetchMethod} MethodParams={MethodParams} Active={loadedPages.includes(page)}/>
      {/if}
    {/each}
  {/await}
  <div class="scroll-block bottom" bind:this={loadBottom}/>
  <ScrollButton on:clicked={scrollClicked}/>
</div>

<style lang="scss">

h2{
  color:$FontColor
}

.scroll-block{
  height: 50vh;
  width: 100%;
  z-index: -1;
}

.scroll-block.top{
  position: absolute;
  // background-color: red;
  z-index:10;
  top:0;
  left:0;
}

.scroll-block.bottom{
  position: relative;
  top: -50vh;
}
</style>
