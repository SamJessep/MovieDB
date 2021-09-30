<script>
import { Preferences } from '../../../stores/store';
import Config from '../../../config'
import {GetBestImageSize} from '../../../model/dataHelper'
import SvgIcon from '../../general/SvgIcon.svelte';
import {GetSCSSVars} from '../../../util'
import ProfilePicture from '../../general/ProfilePicture.svelte';
export let review;

// No Profile
const profileImageSize = GetBestImageSize("profile", 56) 

</script>
<li>
  <div class="profileContainer">
    <a href={review.url} class="profile">
      <div class="img">
        <ProfilePicture src={review.author_details.avatar_path} alt="{review.author_details.name||review.author}'s profile" size={56}/>
      </div>
      <p class="author">{review.author_details.name!=""?review.author_details.name:review.author}</p>
    </a>
    <p class="date">{new Date(review.updated_at ?? review.created_at).toDateString().split(' ').slice(1).join(' ')}</p>
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
    .img{
      color:$FontColor;
      margin: auto;
      width: 56px;
      height: 56px;
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