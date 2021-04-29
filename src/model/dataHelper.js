import {
  get
} from 'svelte/store';
import {Languages, Countries} from '../stores/store.js'
import Config from '../config'

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

export function GetBestImageSize(imageType, width){
  let selectedSize = Config.imageSizes[imageType].map(s=>{
    let size = Number(s.replace("w", ""))
    return {
      name:s,
      difference:Math.abs(width-size)
    }
  }).sort((a,b)=>a.difference>b.difference?1:-1)[0]

  return selectedSize.difference > 500 ? "original" : selectedSize.name;
}
