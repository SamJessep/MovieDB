import {Config} from "../config.js";
import {get} from 'svelte/store';
import {User, RequestParams} from "../stores.js"


export async function Search(query, page = 1, params = {}) {
  params = {
    query: encodeURI(query),
    page: page,
    api_key: Config.API_KEY,
    ...get(RequestParams),
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
    ...get(RequestParams),
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

export async function Trending(media_type="movie", time_window="week"){
  let res = await fetch(Config.BASE_URL+`trending/${media_type}/${time_window}`,{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer '+Config.API_KEY_V4
    }
  })
    return res.json()
}

export async function GetWatchList(page=1, sort_direction="desc"){
  console.log(get(User))
  let res = await fetch(Config.BASE_URL+`/account/${get(User).account_id}/watchlist/movies?session_id=${get(User).session_id}&sort_by=created_at.${sort_direction}&page=${page}`,{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer '+Config.API_KEY_V4
    }
  })
  return res.json()
}

export async function AddToWatchlist(media_id, media_type="movie", add=true){
  const rawResponse = await fetch(Config.BASE_URL+`account/${get(User).account_id}/watchlist?session_id=${get(User).session_id}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer '+Config.API_KEY_V4
    },
    body: JSON.stringify({
      "media_type": media_type,
      "media_id": media_id,
      "watchlist": add
    })
  });
  return await rawResponse.json();
}

export async function IsOnWatchlist(item_id, media_type="movie"){
  let res = await fetch(Config.BASE_URL+`${media_type}/${item_id}/account_states?session_id=${get(User).session_id}`,{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer '+Config.API_KEY_V4
    }
  })
  res = await res.json()
  return res.watchlist
}

export async function GenreSearch(genres, page=1, params={}){
  params ={
    with_genres:genres.join(",")
  }
  return Discover(page, params)
}
