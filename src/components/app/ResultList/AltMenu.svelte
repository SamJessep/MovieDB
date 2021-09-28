<script>
import { createEventDispatcher } from 'svelte';

  import {LoadTrailer, PostToast} from '../../../util'
  let holdAreaEl
  let menuEl
  let progress = 0;
  let holdInterval
  let duration = 400
  let menuOpen = false
  export let id
  export let media_type
  export let link
  export let title
  const dispatch = createEventDispatcher()

  const showEffect = progress =>{
    holdAreaEl.style.background=`radial-gradient(circle at center, rgba(72, 206, 10, 0.472) ${progress}%, transparent 0%)`
  }

  export const touchStart = e => {
    transitEffect(100, 1, ({clientX:x,clientY:y})=>{
      showMenu(x,y)
      progress = 0
      showEffect(progress)
    }, e)
  }

  export const touchEnd = e => {
    if(progress<100){
      transitEffect(0,-1,()=>{}, e)
    }
  }

  const transitEffect = (end, direction, onend=()=>{}, event) => {
    clearInterval(holdInterval)
    holdInterval = setInterval(()=>{
      if(progress == end){
        clearInterval(holdInterval)
        onend(event)
      }else{
        progress += direction;
        showEffect(progress)
      }
    },duration/100)
  }

  const showMenu  = (x,y) =>{
    dispatch("open")
    menuOpen=true
    // console.log(x,y)
    // const {width:w, height:h} = menuEl.getBoundingClientRect()
    // menuEl.style.top = `${y-(h/2)}px`
    // menuEl.style.right = `${x-(w/2)}px`
  }

  export const close = () => menuOpen=false

  const CopyLink = ()=>{
    navigator.clipboard.writeText(link).then(()=>{
      PostToast((media_type == "movie" ? "Movie" : "TV show")+" has been copied to your clip board")
    }).catch(()=>{
      PostToast("Opps couldn't copy the link", {theme:"error"})
    })
  }

  const ShareLink = ()=>{
    const data = {
      title: "MovieDB",
      text: title,
      url:link
    }
    navigator.share(data).catch(e=>{
      console.error(e)
      PostToast("Opps Somthing went wrong", {theme:"error"})
    })
  }

</script>

<div class="holdArea" bind:this={holdAreaEl} ></div>
{#if menuOpen}
<div class="menu" bind:this={menuEl}>
  <button on:click|preventDefault={()=>LoadTrailer(id,media_type)}>Watch Trailer</button>
  <button on:click|preventDefault={ShareLink}>Share</button>
  <button on:click|preventDefault={CopyLink}>Copy Link</button>
</div>
{/if}
<svelte:body on:click={e=>{if(menuEl){
  menuOpen = menuEl.contains(e.target) || holdAreaEl.parentElement.contains(e.target)
}}} />
<svelte:options accessors={true}/>
<style>
  div.holdArea{
    pointer-events:none;
    position: absolute;
    background-color: transparent;
    z-index: 10;
    width: 100%;
    height: 100%;
    transform: translate(-4px, 0px);
    border-radius: 10px;
  }

  div.menu{
    background-color:white;
    position: absolute;
    z-index: 11;
    display: flex;
    flex-direction: column;
  }

  button{
    @include darkBtnOutline;
  }
</style>