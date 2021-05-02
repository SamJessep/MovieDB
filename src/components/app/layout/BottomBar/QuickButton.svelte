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

<style>
button{
 background-color: transparent;
 border:none;
 color: var(--FontColor);
 font-size: var(--HeaderFontSize);
 padding: 1rem;
}

.quickBtn>button:active, .quickBtn>button:focus{
  background-color: transparent;
  outline: none;
}

li.quickBtn{
  font-size: var(--HeaderFontSize);
  border-radius: 0.2rem;
}
li.quickBtn:hover, .quickBtn:hover, .quickBtn:focus{
  background-color: var(--AccentColor);
}
</style>
