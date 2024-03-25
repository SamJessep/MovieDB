import {
  writable,
  readable,
  derived,
  get
} from 'svelte/store'

export const LoadQueue = writable([])
export const Loaded = derived(LoadQueue, $LoadQueue=>$LoadQueue.length === 0)