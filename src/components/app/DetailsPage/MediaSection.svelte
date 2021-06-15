<script>
  export let media_type
  export let title;
</script>

<div class="btn_container">
<button>Trailer</button>
<button>Stream</button>
<button>Download</button>
</div>

<style lang="scss">
  .btn_container{
    display:flex;
  }
  button{
    @include darkBtnOutline;
  }
</style>