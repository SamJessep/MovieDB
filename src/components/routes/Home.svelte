<script>
import AppShell from '../AppShell.svelte'
export let params = {}

let focused = false;
$:focused
</script>



<!-- <AppShell>
  <div/>
</AppShell> -->

<section class="hero is-success is-fullheight">
  <!-- Hero head: will stick at the top -->
  <div class="hero-head">
    <header class="navbar">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item">
            <img src="https://bulma.io/images/bulma-type-white.png" alt="Logo">
          </a>
          <span class="navbar-burger" data-target="navbarMenuHeroC">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
        <nav class="panel" class:Open={focused} id="searchContainer">
        <div id="searchbar" class="panel-block ">
          <p class="control has-icons-left is-large">
            <input on:click={()=>focused=true} class="input is-large" type="search" placeholder="Search MovieDB">
            <span class="icon is-left">
              <i class="fas fa-search" aria-hidden="true"></i>
            </span>
          </p>
        </div>
        <div id="datalist" class:Open={focused}>
          <p class="panel-tabs">
          <a class="is-active">All</a>
          <a>Movie</a>
          <a>TV Shows</a>


          </p>
          <a class="panel-block is-active">
          bulma
          </a>
          <a class="panel-block">
          marksheet
          </a>
          <a class="panel-block">
          minireset.css
          </a>
          <a class="panel-block">
          jgthms.github.io
          </a>
          <a class="panel-block">
          daniellowtw/infboard
          </a>
          <a class="panel-block">
          mojs
          </a>
        </div>


      </nav>
        <!-- <div id="navbarMenuHeroC" class="navbar-menu">
          <div class="navbar-end">
            <a class="navbar-item is-active">
              Watchlist
            </a>
            <a class="navbar-item">
              Popular
            </a>
            <a class="navbar-item">
              Recent Releases
            </a>
          </div>
        </div> -->
      </div>
    </header>
  </div>

  <!-- Hero footer: will stick at the bottom -->
  <div class="hero-foot">
    <nav class="tabs is-boxed is-fullwidth">
      <div class="container">
        <ul>
          <li class="is-active"><a>Home</a></li>
          <li><a>Popular</a></li>
          <li><a>Recent Releases</a></li>
          <li><a>Login</a></li>
        </ul>
      </div>
    </nav>
  </div>
</section>
<style>
.navbar > .container {
    justify-content: space-between;
}

#searchbar{
  border:none;
}

#searchContainer{
  flex-grow: 1;
  margin: auto 2rem;
}

#datalist.Open{
  display: block;
}

#datalist{
  height:0;
  display: none;
}

</style>
