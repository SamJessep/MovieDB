import {Config} from "../config.js";
import {get} from 'svelte/store';
import {User, RequestParams} from "../stores/store.js"
import {ParamsToString} from '../util.js'


export async function Search(query, params = {}) {
  params = {
    query: encodeURI(query),
    ...get(RequestParams),
    ...params
  };
  var res = await fetch(Config.BASE_URL + "search/multi?" + ParamsToString(params),{
    method:'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer '+Config.API_KEY_V4
    }
  });
  res = await res.json()
  console.log(res)
  return res;
}

export async function Discover(params={}){
  params = {
    ...get(RequestParams),
    ...params
  };
  var res = await fetch(Config.BASE_URL + "discover/movie?" + ParamsToString(params),{
    method:'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer '+Config.API_KEY_V4
    }
  });
  return res.json();
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
  console.log(params)
  return Discover(params)
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

export async function GetWatchList(params={sort_direction:"created_at.desc"}){
  params = {
    ...get(RequestParams),
    ...params,
    session_id: get(User).session_id
  }
  let res = await fetch(Config.BASE_URL+`/account/${get(User).account_id}/watchlist/movies?${ParamsToString(params)}`,{
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
  let res = await fetch(Config.BASE_URL+`${media_type}/${item_id}/account_states?${ParamsToString(params)}`,{
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

export async function GenreSearch(genres, params={}){
  params ={
    ...params,
    with_genres:genres.join(",")
  }
  return Discover(params)
}
