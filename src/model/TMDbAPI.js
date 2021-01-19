import {
  Config
} from "../config.js";


export async function Search(query, page = 1, params = {}) {
  params = {
    query: encodeURI(query),
    page: page,
    api_key: Config.API_KEY,
    ...Config.REQUEST_PARAMS,
    ...params
  };
  const paramString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
  var res = await fetch(Config.BASE_URL + "search/multi?" + paramString);
  return res.json();
}

export async function Discover(page=1, params={}){
  params = {
    page: page,
    api_key: Config.API_KEY,
    ...Config.REQUEST_PARAMS,
    ...params
  };
  const paramString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
  var res = await fetch(Config.BASE_URL + "discover/movie?" + paramString);
  return res.json();
}

export async function Latest(page=1, params={}){
  //popularity.asc, popularity.desc, release_date.asc, release_date.desc, revenue.asc, revenue.desc, primary_release_date.asc, primary_release_date.desc, original_title.asc, original_title.desc, vote_average.asc, vote_average.desc, vote_count.asc, vote_count.desc
  params = {
    sort_by: "release_date.desc"
  }
  return Discover(page, params)
}

export async function Popular(page=1, params={}){
  return Discover(page, params)
}

export async function GenreSearch(genres, page=1, params={}){
  params ={
    with_genres:genres.join(",")
  }
  return Discover(page, params)
}

export async function GetCountries() {
  var paramString = "api_key=" + Config.API_KEY;
  return await fetch(Config.BASE_URL + "configuration/countries?" + paramString).then(r => r.json()).then(r =>
    r.map(r => {
      return {
        value: r.iso_3166_1,
        text: r.english_name
      }
    }).sort((a, b) => a.text < b.text ? -1 : 1));
}

export async function GetLanguages() {
  var paramString = "api_key=" + Config.API_KEY;
  return await fetch(Config.BASE_URL + "configuration/languages?" + paramString).then(r => r.json()).then(r => r.map(l => {
    return {
      value: l.iso_639_1,
      text: l.english_name
    }
  }).sort((a, b) => a.text < b.text ? -1 : 1))
}
