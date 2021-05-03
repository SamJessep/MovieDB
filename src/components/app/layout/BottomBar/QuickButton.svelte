<script>
import {push, link} from 'svelte-spa-router'
export let text;
export let url = "#";
export let isActive = false;

function ButtonClick(){
  if(url){
    push(url)
  }
}
export let click = ButtonClick

</script>

<li class:is-active={isActive} class="quickBtn">
  <button on:click={click}>{text}</button>
</li>

<style lang="scss">
button{
 background-color: transparent;
 border:none;
 color: $FontColor;
 font-size: $HeaderFontSize;
 padding: 1rem;
}

.quickBtn>button:active, .quickBtn>button:focus{
  background-color: transparent;
  outline: none;
}

li.quickBtn{
  font-size: $HeaderFontSize;
  border-radius: 0.2rem;
  color: $FontColor;
}
li.quickBtn:hover, .quickBtn:hover, .quickBtn:focus, li.quickBtn.active{
  background-color: $AccentColor;
}
</style>
