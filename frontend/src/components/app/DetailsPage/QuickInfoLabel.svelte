<script>
  export let label
</script>
<div class="line">
  <p>{label}</p>
  <div class="slot">
    <slot/>
  </div>
</div>

<style lang="scss">
  .line{
    display: flex;
  }

  .slot{
    margin-left: 0.25rem;
  }

  p{
    white-space: nowrap;
  }
</style>