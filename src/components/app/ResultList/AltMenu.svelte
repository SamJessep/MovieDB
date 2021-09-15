<script>
  let holdAreaEl
  let menuEl
  let progress = 0;
  let holdInterval
  let duration = 400
  let menuOpen = false

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
      transitEffect(0,-1,()=>{
        console.log("reversed")
      }, e)
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
    menuOpen=true
    // console.log(x,y)
    // const {width:w, height:h} = menuEl.getBoundingClientRect()
    // menuEl.style.top = `${y-(h/2)}px`
    // menuEl.style.right = `${x-(w/2)}px`
  }
</script>

<div class="holdArea" bind:this={holdAreaEl} ></div>
{#if menuOpen}
<div class="menu" bind:this={menuEl}>
  <button on:click={e=>e.preventDefault()}>Option 1</button>
  <button>Option 2</button>
  <button>Option 3</button>
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
</style>