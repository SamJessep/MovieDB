<script>
import config from "../../config";

  import { GetBestImageSize } from "../../model/dataHelper";
  import { GetSCSSVars } from "../../util";
  import SvgIcon from "./SvgIcon.svelte";

  export let alt;
  export let src;
  export let svg_src = "images/user.svg";
  export let size = 50;
  const vars = GetSCSSVars()
  // No Profile
  export let styles = `
    margin: auto;
    width: 3.5rem;
    color: ${vars.FontColor};
  `

  const getProfileImageUrl = path=>{
    let profileImageSize = GetBestImageSize("profile",size)
    return path.startsWith("/http") ? path.substr(1) : config.BASE_IMAGE_URL+profileImageSize+path
  }
</script>
{#if src}
  <img src={getProfileImageUrl(src)} {alt} width={size} height={size}/>
{:else}
  <SvgIcon {styles} src={svg_src}/>
{/if}

<style lang="scss">
  img{
    border-radius: 0.5rem;
  }
</style>