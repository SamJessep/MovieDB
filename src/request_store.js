import {
  writable,
  readable,
  derived
} from 'svelte/store'
import {Preferences} from "./stores.js"

export const RequestParams = derived(Preferences, $Preferences => {
  return {
    ...$Preferences,
    language: $Preferences.language + "-" + $Preferences.country
  }
})
