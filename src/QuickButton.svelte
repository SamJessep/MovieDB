<script>
export let buttonText;
export let buttonClick;
const dispatch = createEventDispatcher();
import { createEventDispatcher } from 'svelte';

async function ButtonClicked(){
  var res = await buttonClick();
  dispatch('loadResults',{
    results:res
  })
}
</script>

<button on:click={ButtonClicked} id="quickButton">
  {buttonText}
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
