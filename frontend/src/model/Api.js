import { ParamsToString } from "../util";
import config from "../config";

export default class Api{

  static StreamPath = "api/TorrentStream";

  static async GetWatchProviderDirectLinks(title, tmdb_link, media_type, username){
    let params = {
      title:title,
      url: tmdb_link,
      username:username,
      mediatype:media_type,
    }
    const res = await fetch(config.DOTNET_API_URL+"api/WatchProviders?"+ParamsToString(params));
    return res.json()
  }
  
  static async GetStreamLinks(title){
    const res = await fetch(config.DOTNET_API_URL+"api/TorrentLink?"+ParamsToString({
      title:title
    }));
    return res.json()
  }

}