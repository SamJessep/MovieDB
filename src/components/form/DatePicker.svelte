<script>
  import flatpickr from "flatpickr";
  import {onMount} from 'svelte';
  import 'flatpickr/dist/flatpickr.css';
  //Props
  export let options;
  export let label;
  
  let el
  onMount(()=>{
    flatpickr(el,options)
  })
</script>
<label>
{label}
  <input bind:this={el} placeholder="Select a date"/>
</label>