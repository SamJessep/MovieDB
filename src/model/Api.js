import { ParamsToString } from "../util";

const base_url = "https://localhost:44371/api/"

export async function GetWatchProviderDirectLinks(title, tmdb_link){
  const res = await fetch(base_url+"WatchProviders?"+ParamsToString({
    title:title,
    url:tmdb_link
  }));
  return res.json()
}