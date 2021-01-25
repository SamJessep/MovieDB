import {
  writable,
  readable,
  derived
} from 'svelte/store'
import {GetCountries, GetLanguages} from '../model/api_config.js'

let prefrences = JSON.parse(localStorage.getItem("Preferences")) || {
  region: "NZ",
  language: "en",
  include_adult: false
};

export const Preferences = writable(prefrences);
export const SvgIDS = writable(0);
export const Languages = writable([]);
export const Countries = writable([]);


Preferences.subscribe(val => localStorage.setItem("Preferences", JSON.stringify(val)));

export const RequestParams = derived(Preferences, $Preferences => {
  return {
    ...$Preferences,
    language: $Preferences.language + "-" + $Preferences.region
  }
});

(async function CacheRegionData(){
  const languages = await GetLanguages()
  const countries = await GetCountries()
  Languages.set(languages)
  Countries.set(countries)
})();
