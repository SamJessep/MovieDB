<script>
import { Preferences } from '../../../stores/store';
import Config from '../../../config'
import {GetBestImageSize} from '../../../model/dataHelper'
import SvgIcon from '../../general/SvgIcon.svelte';
import {GetSCSSVars} from '../../../util'
export let review;

const vars = GetSCSSVars()
// No Profile
const styles = `
  margin: auto;
  width: 3.5rem;
  color: ${vars.FontColor};
`
const src = "images/user.svg";

const profileImageSize = GetBestImageSize("profile", 56) 
const getProfileImageUrl = path=>{
  return path.startsWith("/http") ? path.substr(1) : Config.BASE_IMAGE_URL+profileImageSize+path
}
</script>
<li>
  <div class="profileContainer">
    <a href={review.url} class="profile">
      {#if review.author_details.avatar_path == null}
        <SvgIcon {styles} {src}/>
      {:else}
        <img src={getProfileImageUrl(review.author_details.avatar_path)} alt={`${review.author_details.name!=""?review.author_details.name:review.author} profile picture`}/>
      {/if}
      <p class="author">{review.author_details.name!=""?review.author_details.name:review.author}</p>
    </a>
    <p class="date">{new Date(review.updated_at ?? review.created_at).toLocaleDateString($Preferences.RequestParams.region)}</p>
  </div>
  <p class="quote">"{review.content.open ? review.content.original+"\"" : review.content.short} 
    {#if review.content.short.length < review.content.original.length}
      <span class="expand" on:click={()=>review.content.open=!review.content.open}>Show {review.content.open ? "less":"more"}</span>
    {:else}
    "
    {/if}
  </p>
</li>

<style lang="scss">

  .date{
    text-align: center;
  }

  
  li{
    overflow: auto;
    margin-bottom: 1rem;
    background-color: $TransparentPanel;
    border-radius: 0.5rem;
    padding: 1rem;
    display: grid;
    grid-template-columns: 10rem 1fr;
    .profileContainer{
      grid-column: 1;
      width: 8rem;
    }
    .profile{
      text-align: center;
      display: flex;
      flex-direction: column;
    }
    img{
      color:$FontColor;
      margin: auto;
      width: 56px;
      height: 56px;
      border-radius: 0.5rem;
    }
    p.quote{
      grid-column: 2;
      margin-left: 1rem;
    }
  }
  
  .expand, .author{
    color:$AccentColor;
    cursor: pointer;
    &:hover{
      color:$SelectedColor;
    }
  }

  .expand{
    white-space: nowrap;
  }

  @media only screen and (max-width: $MobileWidth){
    li{
      display: block;
      .profileContainer{
        display:inline-block;
        margin-bottom: 0.5rem;
        float:left;
      }
      p.quote{
        display:inline;
      }
    }
  }
  
  </style>