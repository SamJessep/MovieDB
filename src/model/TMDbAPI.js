import {Config} from "../config.js";
import {get} from 'svelte/store';
import {User, RequestParams} from "../stores/store.js"
import {ParamsToString} from '../util.js'


async function Send(url, params, method="GET"){
  params = {
    ...get(RequestParams),
    ...params
  };

  var res = await fetch(url + ParamsToString(params),{
    method:'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer '+Config.API_KEY_V4
    }
  });
  return await res.json()
}

export async function Search(query, params = {}) {
  params = {
    query: encodeURI(query),
    ...params
  };
  return await Send(Config.BASE_URL + "search/multi?", params)
}

export async function Discover(params={}){
  params = {
    ...get(RequestParams),
    ...params
  };
  return await Send(Config.BASE_URL + "discover/movie?", params)
}

export async function Latest(params={}){
  //popularity.asc, popularity.desc, release_date.asc, release_date.desc, revenue.asc, revenue.desc, primary_release_date.asc, primary_release_date.desc, original_title.asc, original_title.desc, vote_average.asc, vote_average.desc, vote_count.asc, vote_count.desc
  params = {
    sort_by: "release_date.desc",
    ...params
  }
  return Discover(params)
}

export async function Popular(params={}){
  return Discover(params)
}

export async function Trending(media_type="movie", time_window="week"){
  return await Send(Config.BASE_URL+`trending/${media_type}/${time_window}`)
}

export async function GetWatchList(params={sort_direction:"created_at.desc"}){
  params = {
    ...params,
    session_id: get(User).session_id
  }
  return await Send(Config.BASE_URL+`/account/${get(User).account_id}/watchlist/movies?`, params)
}

export async function AddToWatchlist(media_id, media_type="movie", add=true){
  let params = {
    session_id:get(User).session_id
  }
  const rawResponse = await fetch(Config.BASE_URL+`account/${get(User).account_id}/watchlist?${ParamsToString(params)}`, {
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
  let params ={
    session_id:get(User).session_id
  }
  let res = await Send(Config.BASE_URL+`${media_type}/${item_id}/account_states?`, params)
  return res.watchlist
}

export async function GenreSearch(genres, params={}){
  params ={
    ...params,
    with_genres:genres.join(",")
  }
  return Discover(params)
}
