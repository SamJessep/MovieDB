<script>
import {GetReviews} from '../../../model/TMDbAPI'
import { GetSCSSVars, IsMobile } from '../../../util';
import AnimatedIcon from '../../general/AnimatedIcon.svelte';
import Review from './Review.svelte';

export let id;
export let media_type;

const scss = GetSCSSVars();
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
<details open={!IsMobile()}>
  <summary class="h2">Reviews</summary>
  {#await  fetchReviews()}
    Loading reviews
    <div style="width:50px; height:50px display:inline;">
      <AnimatedIcon src="images/animatedIcons/loading.json" id="watchProviderLoader" autoplay={true} loop={true} styles={`#ID *{stroke:${scss.FontColor};}`}/>
    </div>
  {:then reviews} 
   <ul>
     {#each reviews as review (review.id)}
     <Review {review}/>
     {:else}
     NO REVIEWS
     {/each}
   </ul> 
  {/await}
</details>

<style lang="scss">

</style>