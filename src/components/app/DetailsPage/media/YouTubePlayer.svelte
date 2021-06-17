<script>
  export let video_id;
  export let width = 640;
  export let height = 390;
  export let shown = false;

  let player;

  $:{
    if(player != null){
      if(shown && player.playVideo != null){
        player.playVideo()
      }else if(!shown && player.pauseVideo != null){
        player.pauseVideo()
      }
    }
  }
  
  window.onYouTubeIframeAPIReady = ()=> {
    player = new YT.Player('player', {
      height: height,
      width: width,
      videoId: video_id,
      playerVars: {
        'playsinline': 1
      },
      events: {
        'onReady': (event)=>{
          console.log("READY", shown, event)
          if(shown) event.target.playVideo();
        }
      }
    });
  }
</script>
<svelte:head>
  <script src="https://www.youtube.com/iframe_api" />
</svelte:head>


<iframe id="player" type="text/html" {width} {height} title="Movie trailer"
  src={`https://www.youtube.com/embed/${video_id}?enablejsapi=1&origin=${window.location.origin}`}
  frameborder="0"></iframe>