<script>
import { createEventDispatcher } from "svelte";
import Api from "../../../../model/Api";
import Selector from "../../../form/Selector.svelte"

const dispatch = createEventDispatcher();

export let title;
export let value;
const GetLinks = async ()=>{
  const links = await Api.GetStreamLinks(title)
  return links.map(l=>{return {value:l.url,text:l.title}})
}
</script>

<Selector fetchItemsFunction={GetLinks} label="Select a stream" bind:bindedValue={value} on:select={e=>dispatch("select",e.detail)}/>
<svelte:options accessors={true}/>