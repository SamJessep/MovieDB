import {
  writable,
  readable,
  derived,
  get
} from 'svelte/store'
import {GetCountries, GetLanguages} from '../model/api_config.js'
let defaultSettings = {
  Preferences:{
    RequestParams:{
      region: "NZ",
      language: "en",
      include_adult: false,
    }
  },
  useAccountSettings: true
}

function LoadFromLocalStorage(key, defaultJSON={}){
  return JSON.parse(localStorage.getItem(key)) ?? defaultJSON
}
let s = LoadFromLocalStorage("Settings", defaultSettings);

export const Settings = writable(s);
export const Preferences = writable(s.Preferences);
export const SvgIDS = writable(0);
export const Languages = writable([]);
export const Countries = writable([]);

Preferences.subscribe(p => {
  Settings.update(s=>{return {...s, Preferences:p}})
});
Settings.subscribe(s=>{
  localStorage.setItem("Settings", JSON.stringify(s))
});

export const RequestParams = derived(Preferences, $Preferences => {
  return {
    ...$Preferences.RequestParams,
    language: $Preferences.RequestParams.language + "-" + $Preferences.RequestParams.region
  }
});

(async function CacheRegionData(){
  const languages = await GetLanguages()
  const countries = await GetCountries()
  Languages.set(languages)
  Countries.set(countries)
})();

