import scssVars from "./styles/_export.scss"

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
