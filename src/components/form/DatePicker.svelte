<script>
  import flatpickr from "flatpickr";
  import {onMount} from 'svelte';
  import 'flatpickr/dist/flatpickr.css';
  //Props
  export let options;
  export let label;
  export let id;
  export let name;
  export let value = "";
  
  let el
  onMount(()=>{
    flatpickr(el,options)
  })
</script>
<label for={id}>{label}</label>
<input {id} {name} bind:this={el} placeholder="Select a date" bind:value={value}/>
<svelte:options accessors/>

<style lang="scss">
  input{
    background-color: $PanelColor;
    padding: 0.25rem;
    color: $FontColor;
    border-radius: 0.2rem;
    border: solid $PanelHover 2px;
    &:focus{
      outline:none;
      border-radius: 0.2rem;
      border: solid $AccentColor 2px;
    }
  }
  ::-webkit-calendar-picker-indicator { 
    filter: invert(100%);
    &:hover{
      filter: invert(61%) sepia(92%) saturate(3194%) hue-rotate(116deg) brightness(105%) contrast(101%);
    }
  }
</style>