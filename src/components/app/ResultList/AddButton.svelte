<script>
import AnimatedIcon from "../../general/AnimatedIcon.svelte";
import {GetSCSSVars} from '../../../util'
import { onMount } from "svelte";
import { IsOnWatchlist } from "../../../model/TMDbAPI";
import { createEventDispatcher } from 'svelte';

export let id;
export let Result;
export let compact = true;

const scss = GetSCSSVars();
const dispatch = createEventDispatcher();
var label
$:label=isOnWatchlist ? `Remove ${Result.title} from your watchlist` : `Add ${Result.title} to your watchlist`
const styles = `
  #ID:not(.ready) *{
    opacity: 0%;
  }  
  #ID *{
    fill: ${scss.FontColor};
    stroke: ${scss.FontColor};
    transition: 0.25s stroke;
  }

  button:hover #ID *{
    fill: ${scss.AccentColor};
    stroke: ${scss.AccentColor};
  }

  #ID.on *{
    fill: ${scss.AccentColor};
    stroke: ${scss.AccentColor};
  }

  #ID.ready *{
    transition: 0.5s opacity;
  }
`

var AddIcon
var isOnWatchlist;
var recivedWatchlist = false
const toggleWatchlist = e =>{
  if(recivedWatchlist){
    if(isOnWatchlist){
      AddIcon.Play(10,0,true)
      AddIcon.RemoveClass("on")
    }else{
      AddIcon.Play(0,10)
      AddIcon.AddClass("on")
    }
    isOnWatchlist=!isOnWatchlist;
    dispatch("clicked", {checked:isOnWatchlist, item:Result})
  }
}
const CheckIfOnWatchList = IsOnWatchlist(Result.id, Result.media_type);


const showButtonState = ()=>{
  CheckIfOnWatchList.then(onWatchList=>{
    if(!AddIcon) return
    isOnWatchlist = onWatchList
    recivedWatchlist = true;
    if(onWatchList){
      AddIcon.GoTo(10)
      AddIcon.AddClass("on")
    }else{
      AddIcon.GoTo(0)
      AddIcon.RemoveClass("on")
    }
    AddIcon.AddClass("ready")
  })
}

</script>
<button 
  on:click={toggleWatchlist} 
  aria-label={label}
  title={label}
>
  {#if !recivedWatchlist}
    <div class="buttonPlaceHolder" />
  {/if}
  <AnimatedIcon bind:this={AddIcon} src="images/animatedIcons/heart.json" {styles} {id} on:ready={showButtonState} speed={1.25} />
  {#if !compact}
  <span class="btn-title">
    {isOnWatchlist ? "Remove" : "Add"} to watchlist
  </span>
  {/if}
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.buttonPlaceHolder{
  position: absolute;
  width: 100%;
  height: 100%;
}

button:hover{
  .btn-title{
    text-decoration: underline;
    color:$AccentColor;
  }  
}
.btn-title{
  color:$FontColor;
}

@media only screen and (max-width: $MobileWidth){

  
}

</style>