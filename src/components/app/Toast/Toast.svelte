<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import AnimatedIcon from '../../general/AnimatedIcon.svelte'
  import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
  import { GetSCSSVars } from '../../../util';

  export let message
  export let duration = 5000;
  export let autoDissmiss = true
  export let id = "DissmissToast";
  export let theme

  const totalAnimationFrames = 75;
  const animationDuration = 2.5
  const scss = GetSCSSVars()
  const styles = `
  #ID *{
    stroke: ${scss.FontColor};
  }`
  const speed = (animationDuration/totalAnimationFrames)/((/*duration*/500000/1000)/totalAnimationFrames)
  const dispatch = createEventDispatcher();

  var dissmissBtn;
  const ready = ()=>{
    if(autoDissmiss){
      setTimeout(()=>{
        dissmissBtn.Play(0,30)
      }, 500)
    }
  }
  
  const removeToast = ()=>{
    dispatch("remove", {id:id,message:message})
  }
</script>

<div class={"toast "+theme} transition:fly="{{delay: 50, duration: 500, x:window.innerWidth/2, easing: quintOut}}">
  <span>{message}</span>
  <button on:click={removeToast}>
    <AnimatedIcon
      width="48px"
      height="48px"
      src="images/animatedIcons/arrowRightCircle.json" {styles} {speed} bind:this={dissmissBtn} {id} className={"toastDissmiss"}
      on:ready={ready} on:complete={removeToast}/>
  </button>
</div>

<style>
  .toast{
    border-radius: 0.5rem;
    margin: 0.4rem;
    height: min-content;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    padding-left: 0.5rem;
    display: grid;
    grid-template-columns: 1fr 3rem;
    background-color: $AccentColor;
    align-items: center;
    &.error{
      background-color: red;
    }
    &.warning{
      background-color: gold;
    }
    span{
      color:$FontColor;
    }
  }

  button{
    cursor: pointer;
    border: none;
    padding: 0;
    margin: 0;
    box-sizing: content-box;
    background-color: transparent;
    height: 100%;
    &:hover{
      filter: brightness(90%);
    }
  }
</style>