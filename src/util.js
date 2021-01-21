
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
