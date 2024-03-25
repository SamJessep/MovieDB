<script>
  import WatchProviders from './WatchProviders.svelte';
  import {GetTrailerInfo} from '../../../../util'
  export let media_type;
  export let title;
  export let id;
  export let result

  let trailer
  (async()=>{
    trailer = GetTrailerInfo(id, media_type)
  })();

  const seasonsJSON = result.seasons ? result.seasons.map(season=>{
    return {
      Number:season.season_number,
      Name:season.name,
      Episodes:Array.from(Array(season.episode_count).keys()).map(v=>{
        return {
          Name: `Episode ${v+1}`,
          Number: v+1
        }
      })
    }
  }):""
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