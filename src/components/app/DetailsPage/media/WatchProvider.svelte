<script>
import config from '../../../../config';

  import {GetBestImageSize} from '../../../../model/dataHelper'
  export let title;
  export let src;
  export let tmdb_link
</script>

<a class="provider" {title} href={tmdb_link}>
  <img src={config.BASE_IMAGE_URL + GetBestImageSize("logo", 100) + src} alt={title}/>
</a>

<style lang="scss">
  .provider{
    display: inline-block;
    grid-row:2;
    padding: 0.6rem;
    width: min-content;
    img{
      max-width: 50px;
      max-height: 50px;
      border-radius: 0.9rem;
    }
  }
</style>