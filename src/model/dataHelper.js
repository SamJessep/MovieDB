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
  width=width*2
  if(width == 0) return Config.imageSizes[imageType][0]
  let selectedSize = Config.imageSizes[imageType].map(s=>{
    let size = Number(s.replace("w", ""))
    return {
      name:s,
      difference:Math.abs(width-size)
    }
  }).sort((a,b)=>a.difference>b.difference?1:-1)[0]
  console.log(selectedSize.difference, width)
  return selectedSize.difference > 200 ? "original" : selectedSize.name;
}


export function RemToPx(rem) {    
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}