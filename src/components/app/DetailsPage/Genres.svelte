<script>
import GenreTag from "./GenreTag.svelte";
export let genres = []
export let media_type

</script>
<div class="genre_container">
  {#each genres as {id, name}, index}
    <GenreTag {id} {name} last={index == genres.length-1} {media_type}/>
  {/each}
</div>

<style lang="scss">
  .genre_container{
    display: flex;
    justify-items: flex-start;
  }
</style>