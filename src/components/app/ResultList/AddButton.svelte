<script>
import AnimatedIcon from "../../general/AnimatedIcon.svelte";
import {GetSCSSVars} from '../../../util'
import { onMount } from "svelte";
import { IsOnWatchlist } from "../../../model/TMDbAPI";
import { createEventDispatcher } from 'svelte';

export let id;
export let Result;

const scss = GetSCSSVars();
const dispatch = createEventDispatcher();
const styles = `
  #ID *{
    stroke: ${scss.FontColor};
    opacity: 0%;
    transition: 0.25s stroke;
  }

  #ID:hover *{
    stroke: ${scss.AccentColor};
  }

  #ID.on *{
    stroke: ${scss.AccentColor};
  }

  #ID.ready *{
    transition: 0.5s opacity;
    opacity:100%;
  }
`

var AddIcon
var isOnWatchlist;
var recivedWatchlist = false
const toggleWatchlist = e =>{
  if(recivedWatchlist){
    if(isOnWatchlist){
      AddIcon.Play(16,28)
      AddIcon.RemoveClass("on")
    }else{
      AddIcon.Play(0,16)
      AddIcon.AddClass("on")
    }
    isOnWatchlist=!isOnWatchlist;
    dispatch("clicked", {checked:isOnWatchlist})
  }
}
const CheckIfOnWatchList = IsOnWatchlist(Result.id, Result.media_type);


const showButtonState = ()=>{
  CheckIfOnWatchList.then(onWatchList=>{
    if(!AddIcon) return
    isOnWatchlist = onWatchList
    recivedWatchlist = true;
    if(onWatchList){
      AddIcon.GoTo(16)
      AddIcon.AddClass("on")
    }else{
      AddIcon.GoTo(0)
      AddIcon.RemoveClass("on")
    }
    AddIcon.AddClass("ready")
  })
}

</script>
<button on:click={toggleWatchlist} aria-label={isOnWatchlist ? `Remove ${Result.title} from your watchlist` : `Add ${Result.title} to your watchlist`}>
  {#if !recivedWatchlist}
    <div class="buttonPlaceHolder" />
  {/if}
  <AnimatedIcon bind:this={AddIcon} src="images/animatedIcons/add.json" {styles} {id} on:ready={showButtonState} speed={1.25} fadeIn={true}/>
</button>


<style lang="scss">

button{
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  display: inherit;
  margin: auto;
}

.buttonPlaceHolder{
  position: absolute;
  width: 100%;
  height: 100%;
}

</style>