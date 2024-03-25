<script>
  import config from "../../../config";
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

  export let adult;
  export let gender;
  export let id;
  export let known_for_department;
  export let name;
  export let original_name;
  export let popularity;
  export let profile_path;
  export let cast_id;
  export let character;
  export let credit_id;
  export let order;
  export let media_type;
  export let imgSize = 'w92'

  </script>

  <div class="castPerson" transition:fly="{{delay: 250, duration: 300, x: 100, y: 500, opacity: 0.5, easing: quintOut}}">
    <div class="profilePictureContainer{profile_path === null?' noPicture':''}">
      {#if profile_path === null}
      <div class="profilePicture" alt="{name}'s profile picture">?</div>
      {:else}
      <img class="profilePicture" src="{config.BASE_IMAGE_URL+imgSize+'/'+profile_path}" alt="{name}'s profile picture"/>
      {/if}
    </div>
    <a href={`#/Discover/${media_type}/Advanced?sort_by=popularity.desc&with_people=${id}`}>{name}</a>
    <small>{character}</small>
  </div>

  <style lang="scss">
    .castPerson{
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      width: 90px;
      text-align: center;
      a{
        color:$AccentColor;
        cursor: pointer;
        &:hover{
          color:$SelectedColor;
        }
      }
    }

    .profilePictureContainer{
      width: 5rem;
      height: 5rem;
      display: flex;
      justify-content: center;
      font-size: 2rem;
      border-radius: 0.5rem;
      margin: 0;
      &.noPicture{
        background: $SecondBackgroundColor;
      }
    }

    .profilePicture{
      height: 100%;
      max-width: 100%;
      border-radius: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>