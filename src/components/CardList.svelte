<script>
import {QueryToJSON} from '../util.js'
import Card from './Card.svelte'
import { onMount } from 'svelte';
import {location, querystring} from 'svelte-spa-router'
import { slide } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

export let FetchMethod;
export let MethodParams =[];

let CurrentResults = []
let totalResults = 0;
let totalPages;
let currentPage = 1

$: if(MethodParams || FetchMethod) Start();
// onMount(async () => CurrentResults = await LoadPage(1));

async function Start(){
  CurrentResults = await LoadPage(1)
}

async function LoadPage(page){
  let res = await FetchMethod(...MethodParams, {page:page, ...QueryToJSON($querystring)})
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


const getNumFromStyle = numStr => Number(numStr.substring(0, numStr.length - 2));

const topSentCallback = entry => {
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
    currentIndex = firstIndex;
    if(currentPage>1){
      currentPage--;
    }
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
    currentIndex = firstIndex;
    if(currentPage<totalPages){
      currentPage++;
      CurrentResults = [...CurrentResults,...await LoadPage(currentPage)]
    }
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
<div id="cardContainer" class="card-list" transition:slide={{delay: 250, duration: 300, easing: quintOut }}>
<div id="scroll-top" class="scroll-block top"/>
{#each CurrentResults.filter(r=>r.media_type == "movie" || r.media_type == "tv") as result, index (result.id)}
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
