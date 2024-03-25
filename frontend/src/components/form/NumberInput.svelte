<script>
  export let id;
  export let label;
  export let bindedValue;
  export let min = -10000;
  export let max = 100000;
  export let name;
</script>

<label for={id}>{label}</label>
<span>
  <input {name} {id} type="number" {min} {max} placeholder="0" bind:value={bindedValue}/> Minute{bindedValue>1 ? "s":""}
</span>

<style lang="scss">
  span{
    margin-left: 1rem;
    display: flex;
    &>input{
      margin-right: 1.5ch;
      background-color: $PanelColor;
      padding: 0.25rem;
      color: $FontColor;
      border-radius: 0.2rem;
      border: solid $PanelHover 2px;
      &:focus{
        outline:none;
        border-radius: 0.2rem;
        border: solid $AccentColor 2px;
      }
    }
  }

  label{
    display: inline-block;
  }

</style>