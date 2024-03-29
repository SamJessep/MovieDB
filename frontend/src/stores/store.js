import { update } from 'lodash';
import {
  writable,
  readable,
  derived,
  get
} from 'svelte/store'
import {GetCountries, GetLanguages, GetCertifications} from '../model/api_config.js'
let defaultSettings = {
  Preferences:{
    RequestParams:{
      region: "NZ",
      language: "en",
      include_adult: false,
    },
    use_HD_only:false,
    theme: "dark"
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
export const Certifications = writable([])
export const ToastsQueue = writable([])
export const ModalView = writable({})
export const IsMobile = writable(false);
export const FeaturedBackground = writable('')

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
  const certification_defs = await GetCertifications()
  Languages.set(languages)
  Countries.set(countries)
  Certifications.set(certification_defs)
})();

