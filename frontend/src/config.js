import publicConfig from "./config.public.js";
import privateConfig from "./config.private.js";
export default{
   ...publicConfig,
   ...privateConfig
}