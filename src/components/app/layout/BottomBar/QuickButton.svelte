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
}

.quickBtn>button:active{
  background-color: transparent;
}

li.quickBtn{
  font-size: var(--HeaderFontSize);
  border-radius: 0.2rem;
}
li.quickBtn:hover, .quickBtn:hover, .quickBtn:focus{
  background-color: var(--AccentColor);
}

.quickBtn+button:active{
  background-color: var(--SelectedColor);
}
</style>
