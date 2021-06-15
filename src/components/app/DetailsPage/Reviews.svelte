<script>
import {GetReviews} from '../../../model/TMDbAPI'
import Review from './Review.svelte';

export let id;
export let media_type;

const fetchReviews = async ()=>{
  let res = await GetReviews(id,media_type);
  let reviews = res.results
  while(res.page < res.total_pages){
    res = await GetReviews(id,media_type, res.page+1);
    reviews = [...reviews, ...res.results]
  }

  reviews = reviews.map(r=>{
    r.content = {
      original:r.content,
      short:r.content.substr(0,350),
      open:false
    }
    return r
  })
  return reviews
}


</script>
<h2>Reviews</h2>
{#await  fetchReviews()}
  FETCHING REVIEWS
{:then reviews} 
 <ul>
   {#each reviews as review (review.id)}
   <Review {review}/>
   {:else}
   NO REVIEWS
   {/each}
 </ul> 
{/await}

<style lang="scss">

</style>