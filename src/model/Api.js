import { ParamsToString } from "../util";
import config from "../config";

export default class Api{

  static StreamPath = "api/TorrentStream";

  static async GetWatchProviderDirectLinks(title, tmdb_link, username, media_type){
    const res = await fetch(config.AZURE_URL+"api/WatchProviders?"+ParamsToString({
      title:title,
      url: tmdb_link,
      username:username,
      mediaType:media_type
    }));
    return res.json()
  }
  
  static async GetStreamLinks(title){
    const res = await fetch(config.AZURE_URL+"api/TorrentLink?"+ParamsToString({
      title:title
    }));
    return res.json()
  }

}