import Config from "../config.js";
import {get} from 'svelte/store';
import {RequestParams, Preferences} from "../stores/store.js"
import {User} from '../stores/userStore.js'
import {ParamsToString} from '../util.js'


async function Send(url, params, media_type){
  params = {
    ...get(RequestParams),
    ...params
  };
  //Remove null params
  params = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => value !== null) )

  var res = await fetch(url + "?" + ParamsToString(params),{
    method:'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer '+Config.API_KEY_V4
    }
  });
  res = await res.json()
  if(res.results){
    res.results = res.results.map(r=>{return {media_type:media_type, ...r}})
    //Filter results if dont have poster and feature is enabled
    if(get(Preferences).must_have_poster){
      res.results = res.results.filter(r=>r.poster_path !== null)
    }
  }
  return res;
}

async function SendClean(url, params, usePreferences=true){
  params = usePreferences ? {
    ...get(RequestParams),
    ...params
  } : 
  {...params};
  //Remove null params
  params = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => value !== null) )

  var res = await fetch(url + "?" + ParamsToString(params),{
    method:'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer '+Config.API_KEY_V4
    }
  });
  res = await res.json()
  return res;
}

async function Post(url, body){
  const rawResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer '+Config.API_KEY_V4
    },
    body: JSON.stringify(body)
  });
  return await rawResponse.json();
}

export async function Search(query, search_type="multi", params = {}) {
  params = {
    query: encodeURI(query),
    ...params
  };
  return await Send(`${Config.BASE_URL}search/${search_type}`, params)
}

export async function Discover(media_type, params={}){
  params = {
    ...get(RequestParams),
    ...params
  };
  return await Send(Config.BASE_URL + "discover/"+media_type, params, media_type)
}

export async function Latest(media_type, params={}){
  //popularity.asc, popularity.desc, release_date.asc, release_date.desc, revenue.asc, revenue.desc, primary_release_date.asc, primary_release_date.desc, original_title.asc, original_title.desc, vote_average.asc, vote_average.desc, vote_count.asc, vote_count.desc
  params = {
    sort_by: "release_date.desc",
    ...params
  }
  return Discover(media_type, params)
}

export async function Popular(media_type, params={}){
  return Discover(media_type, params)
}

export async function Trending(media_type, time_window="week"){
  return await Send(Config.BASE_URL+`trending/${media_type}/${time_window}`)
}

export async function GetWatchList(media_type, params={sort_direction:"created_at.desc"}){
  params = {
    ...params,
    session_id: get(User).session_id
  }
  return await Send(Config.BASE_URL+`/account/${get(User).account_id}/watchlist/movies`, params, media_type)
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
  return rawResponse.json();
}

export async function IsOnWatchlist(item_id, media_type="movie"){
  let params ={
    session_id:get(User).session_id
  }
  let res = await Send(Config.BASE_URL+`${media_type}/${item_id}/account_states`, params)
  return res.watchlist
}

export async function GenreSearch(genres, media_type, params={}){
  params ={
    ...params,
    with_genres:genres.join(",")
  }
  return Discover(media_type, params)
}

export async function GetWatchProviders(media_type,region, language="en-US"){
  return await Send(Config.BASE_URL+`watch/providers/${media_type}?watch_region=${region}&language=${language}`)
}

export async function SearchPeople(query, page=1){
  query = encodeURI(query)
  return await SendClean(Config.BASE_URL+`search/person?query=${query}&page=${page}`)
}

export async function SearchCompany(query, page=1){
  query = encodeURI(query)
  return await SendClean(Config.BASE_URL+`search/company?query=${query}&page=${page}`)
}

export async function SearchKeywords(query, page=1){
  query = encodeURI(query)
  return await SendClean(Config.BASE_URL+`search/keyword?query=${query}&page=${page}`)
}

export async function GetGenres(media_type="movie"){
  return await SendClean(Config.BASE_URL+`genre/${media_type.toLocaleLowerCase()}/list`)
}

export async function GetDetails(id,media_type="movie"){
  return await SendClean(Config.BASE_URL+`${media_type.toLocaleLowerCase()}/${id}`,{append_to_response:"release_dates"})
}

export async function GetImages(id,media_type="movie"){
  return await SendClean(Config.BASE_URL+`${media_type.toLocaleLowerCase()}/${id}/images`, [],false)
}

export async function Rate(id,session_id,rating,media_type="movie"){
  return await Post(Config.BASE_URL+`${media_type}/${id}/rating?session_id=${session_id}`,{value:rating})
}

export async function GetRecommendedResults(id, media_type){
  return await SendClean(Config.BASE_URL+`${media_type.toLocaleLowerCase()}/${id}/recommendations`)
}

export async function GetReviews(id, media_type){
  return await SendClean(Config.BASE_URL+`${media_type.toLocaleLowerCase()}/${id}/reviews`)
}

export async function GetVideos(id, media_type){
  return await SendClean(Config.BASE_URL+`${media_type.toLocaleLowerCase()}/${id}/videos`)
}