<script>
  export let width = 640;
  export let height = 390;
  export let shown = false;
  export let autoplay = false;
  const src = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  let videoElement
  $:{
    if(shown){
      if(autoplay) videoElement.play();
    }else {
      videoElement.pause();
    }
  }
</script>

<video {width} {height} {src} controls bind:this={videoElement}/>

<style lang="scss">
  video{
    
  }
</style>