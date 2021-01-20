import {
  writable,
  readable,
  derived
} from 'svelte/store'
import {GetCountries, GetLanguages} from './model/TMDbAPI.js'

let prefrences = JSON.parse(localStorage.getItem("Preferences")) || {
  country: "NZ",
  language: "en",
  include_adult: false
};

export const Preferences = writable(prefrences);
export const SvgIDS = writable(0);
export const Languages = writable([]);
export const Countries = writable([]);
export const User = writable(false)

User.subscribe(userData=>{
  if(userData){
    Preferences.update(p=>{
      return {
        ...p,
        country:userData.iso_3166_1,
        language:userData.iso_639_1,
        include_adult:userData.include_adult
      }
    })
  }
})

Preferences.subscribe(val => localStorage.setItem("Preferences", JSON.stringify(val)));



(async function CacheRegionData(){
  const languages = await GetLanguages()
  const countries = await GetCountries()
  Languages.set(languages)
  Countries.set(countries)
})();
