<script>
import {push, link} from 'svelte-spa-router'
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
export let text;
export let url = "#";
export let active = false;

function ButtonClick(){
  if(url){
    push(url)
  }
  dispatch('quick_button_clicked', text)
}
export let click = ButtonClick

</script>

<div class="quickBtn">
  <button class:active on:click={click}>{text}</button>
  <slot/>
</div>

<style lang="scss">
  
.quickBtn{
  font-size: $HeaderFontSize;
  border-radius: 0.2rem;
  color: $FontColor;
  flex:1;
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

@media only screen and (max-width: $MobileWidth){
  .quickBtn{
    &>button{
      font-size: $HeaderFontSize-Mobile;
      padding: 0.7 auto;
      width:100%;
      flex: 1 1 0px;
    }
  }

}
</style>
