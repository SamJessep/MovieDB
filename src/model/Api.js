import { ParamsToString } from "../util";
import config from "../config";

export async function GetWatchProviderDirectLinks(title, tmdb_link){
  const res = await fetch(config.AZURE_API+"WatchProviders?"+ParamsToString({
    title:title,
    url:tmdb_link
  }));
  return res.json()
}