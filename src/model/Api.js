import { ParamsToString } from "../util";
import config from "../config";

export default class Api{

  static StreamPath = "api/TorrentStream";

  static async GetWatchProviderDirectLinks(title, tmdb_link, username, media_type){
    let params = {
      title:title,
      url: tmdb_link,
      username:username,
      mediatype:media_type,
    }
    const res = await fetch(config.AZURE_URL+"api/WatchProviders?"+ParamsToString(params));
    return res.json()
  }

  static async GetFeatureHTML(url,seasonsJSON){
    const res = await fetch(
      url,
      {
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(seasonsJSON)
      });
      console.log(res)
    return res.json()
  }
  
  static async GetStreamLinks(title){
    const res = await fetch(config.AZURE_URL+"api/TorrentLink?"+ParamsToString({
      title:title
    }));
    return res.json()
  }

}