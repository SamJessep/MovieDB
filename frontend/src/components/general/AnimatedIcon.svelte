<script>
  import lottie from 'lottie-web'
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  
  export let src
  export let className = ""
  export let styles = ""
  export let speed = 1
  export let id;
  export let autoplay = false
  export let loop = false;
  export let width;
  export let height;

  const style = (width && height) ? `width: ${width}; height: ${height};` : undefined;
  
	const dispatch = createEventDispatcher();
  var animation
  var container

  onMount(async () => {
    const options = {
      container: container,
      renderer: 'svg',
      loop: loop,
      autoplay: autoplay,
      path: src,
      rendererSettings: {
        className: className   
      }
    }
    if(id){
      options.rendererSettings.id=id
    }
    animation= lottie.loadAnimation(options)
    animation.setSpeed(speed)
    animation.onComplete = ()=>dispatch('complete')
    animation.addEventListener("DOMLoaded", ()=>{
      // add styles
      let stylesElement = document.createElement("style")
      if(id){
        styles = styles.split("#ID").join("#"+id)
      }
      stylesElement.innerHTML = styles
      if(container)container.querySelector("svg").prepend(stylesElement)

      dispatch("ready")
    })
  })

  export const Play = (start,end,backwards=false)=>{
    animation.setDirection(backwards?-1:1)
    animation.playSegments([start,end], true)
  }

  export const GoTo = frame =>{
    animation.goToAndStop(frame,true)
  }

  export const AddClass = className =>{
    container.querySelector("svg").classList.add(className)
  }

  export const RemoveClass = className =>{
    container.querySelector("svg").classList.remove(className)
  }

</script>

<div bind:this={container} {style}/>
<svelte:options accessors/>

<style lang="scss">
  div{
    display: inherit;
    max-width: 5rem;
    max-height: 5rem;
  }
</style>