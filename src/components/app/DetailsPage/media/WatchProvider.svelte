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
    padding: 0.6rem;
    img{
      width: 50px;
      height: 50px;
      min-width: 50px;
      border-radius: 0.9rem;
    }
  }
</style>