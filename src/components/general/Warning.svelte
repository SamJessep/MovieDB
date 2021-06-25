<script>
import {slide} from 'svelte/transition'
export let error
export let title

let shown=false
</script>
<div>
  <slot/>
  <button {title} on:click={()=>shown=!shown}>!</button>
  {#if shown}
    <p class="moreinfo" transition:slide>
      {error}
    </p>
  {/if}
</div>

<style lang="scss">
  button{
    @include resetbutton;
    padding: 0 0.5rem;
    color: orange;
    font-weight: bold;
    border: solid 2px orange;
    border-radius: 0.5rem;
  }

  p{
    color:orangered;
    background-color: $AppBackground;
   }
</style>