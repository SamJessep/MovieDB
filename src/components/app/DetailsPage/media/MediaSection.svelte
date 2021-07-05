<script>
  import {GetVideos} from '../../../../model/TMDbAPI'
  import { ModalView } from '../../../../stores/store';
  import StreamPlayer from './StreamPlayer.svelte';
  import WatchProviders from './WatchProviders.svelte';
  import YouTubePlayer from './YouTubePlayer.svelte'
  export let media_type;
  export let title;
  export let id;

  let trailer
  (async()=>{
    const res = await GetVideos(id, media_type);
    trailer = res.results.find(video=>video.type.toLowerCase()=="trailer" && video.site.toLowerCase() == "youtube")
  })();

  const showVideo = ()=>{
    ModalView.set({
      component:YouTubePlayer,
      props:{
        video_id: trailer.key,
        width: "100%",
        height: "100%",
      },
      options:{useTitle:false}
    })
  }
</script>
<div class="btn_container">
<button on:click={()=>showVideo("YouTube")} disabled={trailer == null}>Watch Trailer</button>
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
</style>