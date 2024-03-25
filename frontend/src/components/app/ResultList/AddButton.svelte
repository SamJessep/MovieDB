<script>
import AnimatedIcon from "../../general/AnimatedIcon.svelte";
import {GetSCSSVars, PromptLogin} from '../../../util'
import { onMount } from "svelte";
import { IsOnWatchlist } from "../../../model/TMDbAPI";
import { createEventDispatcher } from 'svelte';
import { IsLoggedIn } from "../../../stores/userStore";

export let id;
export let Result;
export let compact = true;

let button;

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

  #ID.on *{
    fill: ${scss.AccentColor};
    stroke: ${scss.AccentColor};
  }

  #ID:not(.on) *{
    fill: ${scss.FontColor};
    stroke: ${scss.FontColor};
  }

  #ID.ready *{
    transition: 0.5s opacity;
  }
  @media (hover: hover) {
    button.like:hover #ID *{
      fill: ${scss.AccentColor};
      stroke: ${scss.AccentColor};
    }

    button.like:focus #ID *{
      fill: ${scss.AccentColor};
      stroke: ${scss.AccentColor};
    }

    button.like:focus-visible #ID *{
      outline: none;
    }
  }
`

var AddIcon
var isOnWatchlist;
var recivedWatchlist = false

const toggleWatchlist = e =>{
  if(!$IsLoggedIn) {
    return PromptLogin()
  }
  if(recivedWatchlist){
    if(isOnWatchlist){
      AddIcon.Play(10,0,true)
      AddIcon.RemoveClass("on")
    }else{
      AddIcon.Play(0,10)
      AddIcon.AddClass("on")
    }
    isOnWatchlist=!isOnWatchlist;
    dispatch("clicked", {checked:isOnWatchlist, item:Result, button:button})
  }
}

var CheckIfOnWatchList
if($IsLoggedIn){
  CheckIfOnWatchList = IsOnWatchlist(Result.id, Result.media_type);
}


const showButtonState = async ()=>{
  if(!$IsLoggedIn) return changeButtonState(false)
  CheckIfOnWatchList.then(async onWatchList=>{
    isOnWatchlist = onWatchList
    recivedWatchlist = true;
    changeButtonState(onWatchList)
  })
}

const changeButtonState = async (ticked)=>{
  if(!AddIcon) await waitForIconToLoad()
  if(ticked){
      AddIcon.AddClass("on")
      AddIcon.GoTo(9)
    }else{
      AddIcon.RemoveClass("on")
      AddIcon.GoTo(0)
    }
    AddIcon.AddClass("ready")
}

const waitForIconToLoad = async () => {
  return new Promise(function (resolve, reject) {
        (function wait(){
            if (AddIcon) return resolve();
            setTimeout(wait, 30);
        })();
    });
}
</script>
<button class="like"
  on:click={toggleWatchlist} 
  aria-label={label}
  title={label}
  bind:this={button}
>
  {#if !recivedWatchlist}
    <div class="buttonPlaceHolder" />
  {/if}
  <AnimatedIcon 
    bind:this={AddIcon} 
    src="images/animatedIcons/heart.json" {styles} {id} 
    on:ready={showButtonState} 
    speed={1.25} 
    width={compact?"100%":"32px"} 
    height={compact?"100%":"32px"}/>
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
  outline: none !important;
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