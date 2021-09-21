<script>
  import {onMount} from "svelte";
  export let text
  export let maxFontSize=16
  var container


  function getSpan(){
    const span = document.createElement('span')
    span.style.position = 'fixed';
    span.style.visibility = 'hidden';
    document.body.appendChild(span);
    return span;
}

function textWidth(str, css) {
    const span = getSpan();
    Object.assign(span.style, css || {});
    span.innerText = str;
    const w = Math.round(span.getBoundingClientRect().width);
    
    span.remove();
    
    return w;
}

function getBestFontSize(targetSize){
  const allowedLines=2
  const step = 0.5

  let fontSizePx=maxFontSize
  let currentSize = textWidth(text, {"fontSize":fontSizePx+"px"})
  while(currentSize>((targetSize-15)*allowedLines)){
    fontSizePx -= step;
    currentSize = textWidth(text, {"fontSize":fontSizePx+"px"})
  }
  return fontSizePx+"px"
}
var fontSize
onMount(()=>{
  fontSize = getBestFontSize(container.getBoundingClientRect().width)
  console.log(container.getBoundingClientRect().width)
})
</script>

<span bind:this={container} style="font-size:{fontSize}">
  {text}
</span>

<svelte:window on:resize={()=>fontSize = getBestFontSize(container.getBoundingClientRect().width)}/>

<style lang="scss">
  span{
    text-align: center;
    height: min-content;
    margin: auto;
    width:100%;
  }
</style>