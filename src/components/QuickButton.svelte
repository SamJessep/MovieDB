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
  <a href={url}>
    {text}
  </a>
</li>

<style>
.quickBtn{
  font-size: var(--HeaderFontSize);
  border-radius: 0.2rem;
}
.quickBtn:hover{
  background-color: var(--SelectedColor);
}
</style>
