<script>
import {push} from 'svelte-spa-router'
export let text;
export let url = null;
function ButtonClick(){
  if(url){
    push(url)
  }
}
export let click = ButtonClick

</script>

<button on:click={click} id="quickButton">
  {text}
</button>

<style>
button{
  background-color: transparent;
  color: var(--FontColor,black);
  border: none;
  margin: 1.5vmin 0;
  padding: 0;
  cursor: pointer;
}

#quickButton:hover{
  font-weight:600;
  color:var(--AccentColor, green);
}

#quickButton:active{
  color:var(--SelectedColor, lightgreen);
  background-color:transparent;
}
</style>
