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
let loading = true;
let pages = [];
let cardContainer;
let scrollByY = 0;

$:currentPage
$:{
  pages = [...Array(currentPage).keys()].map(p=>p+1)
  pages = pages.slice(pages.length-2)
}


let loadBottom
let loadTop

$:initIntersectionObserver(loadTop, loadBottom)
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

const intersectCallback = async entry => {
	if (currentPage === totalPages) {
  	return;
  }
  const overlapBottom = entry.target == loadBottom && entry.isIntersecting
  const overlapTop = entry.target == loadTop && entry.isIntersecting
  // conditional check for Scrolling down
  if (overlapBottom) {
    if(currentPage<totalPages && !loading){
      console.log("load bottom")
      currentPage++;
      loading = true;
    }
  }
  
  //Check for load top
  if (overlapTop) {
    if(pages[0]>1 && !loading){
      console.log("load top")
      currentPage--;
      loading = true;
    }
  }

}

const initIntersectionObserver = (topDiv, bottomDiv) => {
  if(!topDiv || !bottomDiv || observer) return
  const callback = entries => {
    entries.forEach(entry => {
      intersectCallback(entry);
    });
  }
  var options = {
      root: null, // Page as root
      rootMargin: "0px",
      threshold: 1.0
    };
  observer = new IntersectionObserver(callback, options);
  observer.observe(topDiv);
  observer.observe(bottomDiv);
}

</script>
<div class="card-list" bind:this={cardContainer}>
  <div class="scroll-block top" bind:this={loadTop}/>
  {#await resultPromise}
  {:then pageData}
    {#each pages as page (page)}
      {#if page==1}
        <Page page={page} PagePromise={page==1?pageData:null} FetchMethod={FetchMethod} MethodParams={MethodParams} on:loaded{loaded}/>
      {:else}
        <Page page={page} FetchMethod={FetchMethod} MethodParams={MethodParams} on:loaded={loaded}/>
      {/if}
    {/each}
  {/await}
  <div class="scroll-block bottom" bind:this={loadBottom}/>
  <ScrollButton/>
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
  background-color: red;
}

.scroll-block.bottom{
  position: relative;
  top: -50vh;
}
</style>
