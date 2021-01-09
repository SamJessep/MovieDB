import {
  Config
} from "../config.js";


export async function Search(query, page = 1, params = {}) {
  params = {
    query: query,
    page: page,
    api_key: Config.API_KEY,
    ...Config.REQUEST_PARAMS,
    ...params
  };
  const paramString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
  var res = await fetch("https://api.themoviedb.org/3/search/multi?" + paramString);
  return res.json();
}