import {
  get
} from 'svelte/store';
import {Languages, Countries} from '../stores.js'

export function GetLanguageText(value, languages){
  for(let l of get(Languages)){
    if (l.value == value) return l.text;
  }
  return value
}

export function GetCountryText(value){
  for(let c of get(Countries)){
    if (c.value == value) return c.text;
  }
  return value
}
