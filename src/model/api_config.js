import {Config} from "../config.js";

export async function GetCountries() {
  let locallySavedCountries = localStorage.getItem("Countries")
  if(locallySavedCountries) return JSON.parse(locallySavedCountries)
  let paramString = "api_key=" + Config.API_KEY;
  let countries = await fetch(Config.BASE_URL + "configuration/countries?" + paramString).then(r => r.json()).then(r =>
    r.map(r => {
      return {
        value: r.iso_3166_1,
        text: r.english_name
      }
    }).sort((a, b) => a.text < b.text ? -1 : 1));
    localStorage.setItem("Countries", JSON.stringify(countries))
    return countries
}

export async function GetLanguages() {
  let localLanguages = localStorage.getItem("Languages")
  if(localLanguages) return JSON.parse(localLanguages)
  let paramString = "api_key=" + Config.API_KEY;
  let languages = await fetch(Config.BASE_URL + "configuration/languages?" + paramString).then(r => r.json()).then(r => r.map(l => {
    return {
      value: l.iso_639_1,
      text: l.english_name
    }
  }).sort((a, b) => a.text < b.text ? -1 : 1))
  localStorage.setItem("Languages", JSON.stringify(languages))
  return languages
}
