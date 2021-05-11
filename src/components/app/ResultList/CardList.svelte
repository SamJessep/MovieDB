<script>
import {QueryToJSON} from '../../../util'
import { onMount, onDestroy} from 'svelte';
import {location, querystring} from 'svelte-spa-router'
import Page from './Page.svelte'
import LoadingIcon from './LoadingIcon.svelte';
import ScrollButton from './ScrollButton.svelte';

export let FetchMethod;
export let MethodParams =[];

let shownResults = []
let totalResults = 0;
let totalPages;
let currentPage = 1
let resultPromise;
let loading = false;

let pages = [];
$:currentPage
$:pages = [...Array(currentPage).keys()].map(p=>p+1)

let loadMoreButton
$:initIntersectionObserver(loadMoreButton)
var observer;
onMount(()=>{
  resultPromise = GetPages(currentPage)
})
onDestroy(()=>{
  if(observer){
    observer.disconnect()
  }
})

function loaded(){
  loading=false;
}

function GetPages(page){
  let promise = FetchMethod(...MethodParams, {page:page, ...QueryToJSON($querystring)}).then(res=>{
    totalPages = res.total_pages;
    currentPage = res.page;
    return res.results.filter(r=>!r['media_type'] || r.media_type == "movie" || r.media_type == "tv")
  })
  promise.then(_=>loaded())
  return promise
}

let bottomSentinelPreviousY = 0;
let bottomSentinelPreviousRatio = 0;

const botSentCallback = async entry => {
	if (currentPage === totalPages) {
  	return;
  }
  const currentY = entry.boundingClientRect.top;
  const currentRatio = entry.intersectionRatio;
  const isIntersecting = entry.isIntersecting;

  // conditional check for Scrolling down
  if (
    currentY < bottomSentinelPreviousY &&
    currentRatio > bottomSentinelPreviousRatio &&
    isIntersecting
  ) {
    console.log("load bottom")
    if(currentPage<totalPages)
    {
      console.log(loading)
    }
    if(currentPage<totalPages && !loading){
      currentPage++;
      loading = true;
      console.log("loading")
    }
  }

  bottomSentinelPreviousY = currentY;
  bottomSentinelPreviousRatio = currentRatio;
}

const initIntersectionObserver = (loadBottom) => {
  if(!loadBottom || observer) return
  const callback = entries => {
    entries.forEach(entry => {
        botSentCallback(entry);
    });
  }

  observer = new IntersectionObserver(callback, {});
  observer.observe(loadBottom);
}

</script>
<div id="cardContainer" class="card-list">
  {#await resultPromise}
    <!-- <LoadingIcon/> -->
  {:then pageData}
    {#each pages as page}
      {#if page==1}
        <Page page={page} PagePromise={page==1?pageData:null} FetchMethod={FetchMethod} MethodParams={MethodParams} on:loaded{loaded}/>
      {:else}
          <Page page={page} FetchMethod={FetchMethod} MethodParams={MethodParams} on:loaded={loaded}/>
      {/if}
    {/each}
  {/await}
  <div class="scroll-block bottom" bind:this={loadMoreButton}/>
  <ScrollButton/>
</div>

<style lang="scss">

h2{
  color:$FontColor
}

#cardContainer{
	display: flex;
	justify-content: space-evenly;
	flex-wrap: wrap;
}

.scroll-block{
  height: 50vh;
  width: 100%;

  z-index: -1;
}

.scroll-block.top{
  position: absolute;
}

.scroll-block.bottom{
  position: relative;
  top: -50vh;
}
</style>
