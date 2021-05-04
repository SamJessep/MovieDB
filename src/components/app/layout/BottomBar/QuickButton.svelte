<script>
import {push, link} from 'svelte-spa-router'
export let text;
export let url = "#";
export let active = false;

function ButtonClick(){
  if(url){
    push(url)
  }
}
export let click = ButtonClick

</script>

<li class="quickBtn">
  <button class:active on:click={click}>{text}</button>
</li>

<style lang="scss">
  
.quickBtn{
  font-size: $HeaderFontSize;
  border-radius: 0.2rem;
  color: $FontColor;
  &>button{
    background-color: transparent;
    border:none;
    color: $FontColor;
    font-size: $HeaderFontSize;
    padding: 1rem;
    border-bottom: solid transparent 3px;
    &:active, .quickBtn>button:focus{
      background-color: transparent;
      outline: none;
    }
    &:hover, &:hover, &:focus:not(.active){
      border-bottom: solid $SelectedColor 3px;
      background-color: rgba(0, 0, 0, 0.897);
    }
    &.active{
      border-bottom: solid $AccentColor 3px;
    }
  }
}
</style>
