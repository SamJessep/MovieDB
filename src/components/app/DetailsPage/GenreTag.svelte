<script>
  export let id;
  export let name;
  export let last;
  export let media_type;
</script>

<a href={`#/genre/${media_type}/${id}`} class:last>
{name}
</a>

<style lang="scss">
  a{
    @include link;
    margin-right: 0.25rem;
    white-space: nowrap;
    &:not(.last)::after{
      content: ",";
    }
  }
</style>