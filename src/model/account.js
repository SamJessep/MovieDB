import {Config} from "../config.js";
import {User} from '../stores.js'

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
  const url = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${document.location.origin}?LoggedIn=True`
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
  User.set({...content,session_id:session_id})
  return content
}
