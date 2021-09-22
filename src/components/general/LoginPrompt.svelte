<script>
  import Account from '../../model/account' 
  export let message = "You need to be logged in to use this feature";
</script>
<p>{message}</p>
<button on:click={Account.StartLogin}>Login</button>

<style lang="scss">
  p{
    color:$FontColor;
  }

  button{
    @include darkBtnOutline;
  }
</style>