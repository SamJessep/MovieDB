import scssVars from "./styles/_export.scss"
import {ToastsQueue} from './stores/store'
import { get } from "svelte/store";
import {AddToWatchlist} from './model/TMDbAPI'

export function QueryToJSON(queryString){
  try{
    return JSON.parse('{"' + decodeURI(queryString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
  }
  catch(e){
    return {}
  }
}

export function ParamsToString(params){
  try{
    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
  }catch(e){
    return ""
  }
}

export function ParseSCSS(scssExport){
  let varLines = scssExport.replace(":export {","").replace("}","").trim().split("\n").map(l=>l.trim())
  let vars = {}
  varLines.forEach(l => {
    let match = l.match(/(.*):(.*);/)
    vars[match[1].trim()] = match[2].trim()
  });
  return vars
}

export function GetSCSSVars(){
  return ParseSCSS(scssVars);
}

export function IsMobile(){
  return window.innerWidth <= Number(GetSCSSVars().MobileWidth.split("px")[0])
}

export function PostToast(message, options={duration:3000}){
  const newToast = {
    message: message,
    autoDissmiss: true,
    ...options
  }
  ToastsQueue.update(toaster=>{
    toaster.push(newToast)
    return toaster
  })
}

export async function AddToList(event){
  var checked = event.detail.checked;
  var {media_type, title, id} = event.detail.item
  try{
    const res = await AddToWatchlist(id, media_type, checked)
    if(res.success){
      PostToast(`${checked?"Added":"Removed"} ${title} to watchlist`, {duration:10000})
    }else{
      PostToast("Opps somthing went wrong", {duration:10000})
    }

  }catch(e){
    console.error(e)
    PostToast("Opps somthing went wrong", {duration:10000, theme:"error"})
  }
}

export function isElementInViewport (el) {

  // Special bonus for those using jQuery
  if (typeof jQuery === "function" && el instanceof jQuery) {
      el = el[0];
  }
  
  var rect = el.getBoundingClientRect();
  
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
  );
  }

  export function ToReadableDate(date){
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    return `${day} of ${month} ${year}`
  }