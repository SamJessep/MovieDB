import Config from "../config.js";
import {User, IsLoggedIn} from '../stores/userStore.js'
import {get} from 'svelte/store';

export default class Account{
  static async StartLogin(){
    let res = await Account.CreateRequestToken()
    const requestToken = res.request_token
    Account.GetUserApproval(requestToken)
  }

  static async Logout(sessionId){
    const res = await fetch(Config.BASE_URL+"authentication/session?api_key="+Config.API_KEY, {
      method: "DELETE", 
      body: {
        "session_id": sessionId
      }
    })
    return res
  }
  
  
  static async CreateRequestToken(){
    const rawResponse = await fetch(Config.BASE_URL+"authentication/token/new", {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+Config.API_KEY_V4
      }
    });
    const content = await rawResponse.json();
    return content
  }
  
  static GetUserApproval(token){
    const url = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${encodeURIComponent(document.location.href)}`
    window.location.assign(url)
  }
  
  static async CreateAccessToken(AuthToken){
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
    return content
  }
  
  
  static async GetDetails(session_id){
    const rawResponse = await fetch(Config.BASE_URL+"account?session_id="+session_id+"&api_key="+Config.API_KEY,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': 'Bearer '+Config.API_KEY_V4
      }
    });
    const content = await rawResponse.json();
    return content
  }

}
