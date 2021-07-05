<script>
  import {push} from 'svelte-spa-router'
import { ModalView } from '../../../../stores/store';
  import Selector from '../../../form/Selector.svelte';
  
  let movieSelect;
  let tvSelect;
  let media_type = "movie";
  export let genresPromises = [
    {
      name:'Tv',
      promise:GetTVGenres()
    },
    {
      name:'Movie',
      promise:GetMovieGenres()
    }
  ]

  export async function GetTVGenres(){
    return await GetGenres('https://api.themoviedb.org/3/genre/tv/list?language=en_US&api_key=579872d8976e8f07d27624584808fee2');
  }

  export async function GetMovieGenres(){
    return await GetGenres('https://api.themoviedb.org/3/genre/movie/list?language=en_US&api_key=579872d8976e8f07d27624584808fee2');
  }

  async function GetGenres(url){
    return await fetch(url)
    .then(data=>data.json())
    .then(json=>json.genres.map(genre=>{return {text:genre.name, value:genre.id}}));
  }

  export function Refresh(){
    genresPromises[0].promise = GetTVGenres();
    genresPromises[1].promise = GetMovieGenres();
  }

  export function GenreSearch(){
    let selector;
    if(media_type == "tv"){
      selector = tvSelect
    }else if (media_type == "movie"){
      selector = movieSelect
    }

    let genreIds = selector.getSelectedOptions().join(",");
    if(genreIds === ""){
      alert("Please select at least one genre")
    }else{
      push(`/Genre/${media_type}/${genreIds}`)
      ModalView.set({})
    }
  }
</script>

<Selector on:select={e=>{media_type=e.detail.selected[0].value}} selectID={"media_type"} name={"media_type"} fetchItemsFunction={()=>[{text:"Movies", value:"movie"},{text:"TV", value:"tv"}]} label={"Media Type"} mandatoryChoice={true}/>
  {#if media_type == "movie"}
    <Selector 
      selectID={"movieGenreSelect"} 
      name={"movieGenreSelect"} 
      fetchItemsFunction={GetMovieGenres} 
      label={"Movie Genres"} 
      multiple={true} 
      bind:this={movieSelect} 
      mandatoryChoice={false}
      size=100
    />
  {:else if media_type == "tv"}
    <Selector 
      selectID={"tvGenreSelect"} 
      name={"tvGenreSelect"} 
      fetchItemsFunction={GetTVGenres} 
      label={"TV Genres"} 
      multiple={true} 
      bind:this={tvSelect} 
      mandatoryChoice={false}
      size=100
    />
  {/if}
  <button class="searchBtn" on:click={GenreSearch}>Search</button>

  <style lang="scss">
    .searchBtn{
      @include darkBtnOutline;
    }
  </style>