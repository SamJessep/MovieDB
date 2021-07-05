<script>
  import {GetVideos} from '../../../../model/TMDbAPI'
  import StreamPlayer from './StreamPlayer.svelte';
  import WatchProviders from './WatchProviders.svelte';
  import YouTubePlayer from './YouTubePlayer.svelte'
  export let media_type;
  export let title;
  export let id;

  let popupOpen = false;
  let shownVideo = "";
  let videoContainer;
  let trailer
  let videoBackground;
  (async()=>{
    const res = await GetVideos(id, media_type);
    trailer = res.results.find(video=>video.type.toLowerCase()=="trailer" && video.site.toLowerCase() == "youtube")
  })();

  const showVideo = (type)=>{
    shownVideo = type
    popupOpen = true;
  }

  const hideVideo = e=>{
    console.log()
    if(e.target == videoBackground){
      popupOpen = false;
      shownVideo = "";
    }
  }

</script>
<div class="btn_container">
<button on:click={()=>showVideo("YouTube")} disabled={trailer == null}>Watch Trailer</button>

<div class="video_popup" class:popupOpen on:click={hideVideo} bind:this={videoBackground}>
  <div class="video_container" bind:this={videoContainer}>
    {#if shownVideo == "YouTube"}
      <YouTubePlayer video_id={trailer.key} width={"100%"} height={"100%"} shown={popupOpen}/>
    {/if}
  </div>
</div>
</div>
<WatchProviders {title} {id} {media_type}/>

<style lang="scss">
  .btn_container{
    display:flex;
    margin-top: 1rem;
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
      display: flex;
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