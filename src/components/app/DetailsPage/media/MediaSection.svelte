<script>
  import {GetVideos} from '../../../../model/TMDbAPI'
  import YouTubePlayer from './YouTubePlayer.svelte'
  export let media_type;
  export let title;
  export let id;

  let popupOpen = false;
  let shownVideo;

  let trailer
  (async()=>{
    const res = await GetVideos(id, media_type);
    trailer = res.results.find(video=>video.type.toLowerCase()=="trailer" && video.site.toLowerCase() == "youtube")
  })();

  const showVideo = (type)=>{
    shownVideo = type
    popupOpen = true;
  }

  const hideVideo = ()=>{
    popupOpen = false;
    shownVideo = "";
    console.log("CLOSE VIDEO", shownVideo, popupOpen)
  }
</script>

<div class="btn_container">
<button on:click={()=>showVideo("YouTube")} disabled={trailer == null}>Trailer</button>
<button on:click={()=>showVideo("Stream")}>Stream</button>
<button>Download</button>

<div class="video_popup" class:popupOpen on:click={hideVideo}>
  <div class="video_container">
    {#if shownVideo == "YouTube"}
        <YouTubePlayer video_id={trailer.key} width={"100%"} height={"100%"} shown={popupOpen}/>
    {:else if shownVideo == "Stream"}
      STREAM
    {/if}
  </div>
</div>
</div>

<style lang="scss">
  .btn_container{
    display:flex;
  }
  button{
    @include darkBtnOutline;
  }

  .video_popup{
    position: fixed;
    top:0;
    left: -100%;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $TransparentBackgroundHover;
    opacity: 0;
    transition: opacity 0.4s;
    &.popupOpen{
      left:0;
      z-index: 2;
      opacity: 100%;
    }
    .video_container{
      width: 75%;
      height: 75%;
      background-color: $TransparentPanel;
    }
  }

  @media only screen and (max-width: $MobileWidth){
    .video_popup{
      .video_container{
        width: 95%;
        height: 40%;
      }
    }
  }

</style>