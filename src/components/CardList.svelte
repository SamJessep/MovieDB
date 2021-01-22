<script>
import Card from './Card.svelte'
import { onMount } from 'svelte';

export let FetchMethod;
export let MethodParams =[{}];

let startParams = MethodParams[0]

let CurrentResults = []
let totalResults = 0;
let totalPages;
let currentPage = 1

$: if(FetchMethod) Start();
// onMount(async () => CurrentResults = await LoadPage(1));

async function Start(){
  CurrentResults = await LoadPage(1)
}

async function LoadPage(page){
  console.log(CurrentResults)
  let res = await FetchMethod({...MethodParams, page:page})
  totalPages = res.total_pages;
  currentPage = res.page;
  totalResults = res.total_results;
  return res.results
}

function CardMounted(e){
  if(e.detail.id == 'card-19'){
    initIntersectionObserver();
  }
}


let topSentinelPreviousY = 0;
let topSentinelPreviousRatio = 0;
let bottomSentinelPreviousY = 0;
let bottomSentinelPreviousRatio = 0;

let pageSize = 20;
let currentIndex = 0;

const getSlidingWindow = isScrollDown => {
	const increment = pageSize / 2;
	let firstIndex;

  if (isScrollDown) {
  	firstIndex = currentIndex + increment;
  } else {
    firstIndex = currentIndex - increment;
  }

  if (firstIndex < 0) {
  	firstIndex = 0;
  }

  return firstIndex;
}

const recycleDOM = async (firstIndex) => {
	for (let i = 0; i < pageSize; i++) {
  	const tile = document.querySelector("#card-" + i);
  }
}

const getNumFromStyle = numStr => Number(numStr.substring(0, numStr.length - 2));

const adjustPaddings = isScrollDown => {
	const container = document.querySelector(".card-list");
  const currentPaddingTop = getNumFromStyle(container.style.paddingTop);
  const currentPaddingBottom = getNumFromStyle(container.style.paddingBottom);
  const remPaddingsVal = 500*2//(pageSize / 2);
	// if (isScrollDown) {
  // 	container.style.paddingTop = currentPaddingTop + remPaddingsVal + "px";
  //   container.style.paddingBottom = currentPaddingBottom === 0 ? "0px" : currentPaddingBottom - remPaddingsVal + "px";
  // } else {
  // 	container.style.paddingBottom = currentPaddingBottom + remPaddingsVal + "px";
  //   container.style.paddingTop = currentPaddingTop === 0 ? "0px" : currentPaddingTop - remPaddingsVal + "px";
  //
  // }
}

const topSentCallback = entry => {
	if (currentIndex === 0) {
		const container = document.querySelector(".card-list");
  	container.style.paddingTop = "0px";
  	container.style.paddingBottom = "0px";
  }
  const currentY = entry.boundingClientRect.top;
  const currentRatio = entry.intersectionRatio;
  const isIntersecting = entry.isIntersecting;

  // conditional check for Scrolling up
  if (
    currentY > topSentinelPreviousY &&
    isIntersecting &&
    currentRatio >= topSentinelPreviousRatio &&
    currentIndex !== 0
  ) {
    console.log("load top")
    const firstIndex = getSlidingWindow(false);
    adjustPaddings(false);
    currentIndex = firstIndex;
    if(currentPage>1){
      currentPage--;
    }
    recycleDOM(firstIndex);
  }

  topSentinelPreviousY = currentY;
  topSentinelPreviousRatio = currentRatio;
}

const botSentCallback = async entry => {
	if (currentIndex === totalResults - pageSize) {
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
    const firstIndex = getSlidingWindow(true);
    adjustPaddings(true);
    currentIndex = firstIndex;
    if(currentPage<totalPages){
      currentPage++;
      CurrentResults = [...CurrentResults,...await LoadPage(currentPage)]
    }
    recycleDOM(firstIndex);
  }

  bottomSentinelPreviousY = currentY;
  bottomSentinelPreviousRatio = currentRatio;
}

const initIntersectionObserver = () => {
  const options = {
  	//root: document.querySelector(".card-list")
  }

  const callback = entries => {
    entries.forEach(entry => {
      if (entry.target.id === 'scroll-top') {
        topSentCallback(entry);
      } else if (entry.target.id === `scroll-bottom`) {
        botSentCallback(entry);
      }
    });
  }

  var observer = new IntersectionObserver(callback, options);
  observer.observe(document.querySelector("#scroll-top"));
  observer.observe(document.querySelector("#scroll-bottom"));
}

</script>
<div id="cardContainer" class="card-list">
<div id="scroll-top" class="scroll-block top"/>
{#each CurrentResults as result, index (result.id)}
  <Card Result={result} cardId={"card-"+index} on:mount={CardMounted}/>
{/each}
<div id="scroll-bottom" class="scroll-block bottom"/>
</div>

<style>

#cardContainer{
	display: flex;
	justify-content: space-evenly;
	flex-wrap: wrap;
}

.scroll-block{
  height: 50vh;
  width: 100%;
  background-color: #ff000033;
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
