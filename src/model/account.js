import {Config} from "../config.js";
import {User, IsLoggedIn} from '../stores/userStore.js'
import {get} from 'svelte/store';

export async function StartLogin(){
  let res = await CreateRequestToken()
  const requestToken = res.request_token
  GetUserApproval(requestToken)
}

export async function StartSession(){
  try{
    let res = await CreateAccessToken(params.request_token)
    localStorage.setItem("session_id", res.session_id)
    TryLoadProfile()
    window.location.href = window.location.origin +"#"+ $location;
  }
  catch(e){
    console.error("user wasn't authenticated correctly", e)
  }
}

export async function CreateRequestToken(){
  const rawResponse = await fetch(Config.BASE_URL+"authentication/token/new", {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer '+Config.API_KEY_V4
    }
  });
  const content = await rawResponse.json();
  console.log(content)
  return content
}

export function GetUserApproval(token){
  const url = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${encodeURIComponent(document.location.href)}`
  window.location.replace(url)
}

export async function CreateAccessToken(AuthToken){
  const rawResponse = await fetch(Config.BASE_URL+"authentication/session/new", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer '+Config.API_KEY_V4
    },
    body: JSON.stringify({"request_token": AuthToken})
  });
  const content = await rawResponse.json();
  console.log(content)
  return content
}


export async function GetDetails(session_id){
  const rawResponse = await fetch(Config.BASE_URL+"account?session_id="+session_id+"&api_key="+Config.API_KEY);
  const content = await rawResponse.json();
  return content
}
