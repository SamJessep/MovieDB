import {
  writable,
  readable,
  derived
} from 'svelte/store'

let prefrences = JSON.parse(localStorage.getItem("Preferences")) || {
  country: "NZ",
  language: "en",
  include_adult: false
};

export const Preferences = writable(prefrences);
export const SvgIDS = writable(0);

Preferences.subscribe(val => localStorage.setItem("Preferences", JSON.stringify(val)))

export const RequestParams = derived(Preferences, $Preferences => {
  return {
    ...$Preferences,
    language: $Preferences.language + "-" + $Preferences.country
  }
})
