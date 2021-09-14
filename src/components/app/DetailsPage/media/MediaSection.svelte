<script>
  import {GetVideos} from '../../../../model/TMDbAPI'
  import { ModalView } from '../../../../stores/store';
  import StreamPlayer from './StreamPlayer.svelte';
  import WatchProviders from './WatchProviders.svelte';
  import YouTubePlayer from './YouTubePlayer.svelte'
  export let media_type;
  export let title;
  export let id;
  export let result

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
      options:{useTitle:false, singleView:true, height: "80%"}
    })
  }

  export const ShowTrailer = () => showVideo("YouTube")
  const seasonsJSON = result.seasons.map(season=>{
    return {
      number:season.season_number,
      name:season.name,
      episodes:Array.from(Array(season.episode_count).keys()).map(v=>{
        return {
          name: `Episode ${v+1}`,
          number: v+1
        }
      })
    }
  })
</script>
<WatchProviders {title} {id} {media_type} {seasonsJSON}/>
<svelte:options accessors={true}></svelte:options>

<style lang="scss">
  .btn_container{
    display:flex;
    margin-top: 1rem;
  }
  button{
    @include darkBtnOutline;
  }
</style>