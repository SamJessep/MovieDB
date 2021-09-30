<script>
  import SvgIcon from "../../../general/SvgIcon.svelte";

  export let title = "";
  export let click = ()=>false;
  export let disabled = false

  const chevronStyles = `
  width: 3rem;
  height: 3rem;
  padding: 1vmin 0;
  transition: fill 0.5s;`
</script>

<button class="nonStandard roundedBtn" on:click={()=>{if(!disabled)click()}} alt={title}>
  <SvgIcon src="images/chevron-left.svg" styles={chevronStyles} />
  <h1>{title}</h1>
  <div class="icon">
    <slot/>
  </div>
</button>

<style lang="scss">
  .icon{
    width: 56px;
    height: 56px;
  }

  button{
    font-size: $HeaderFontSize;
    background-color: transparent;
    border: none;
    display: flex;
    color: $FontColor;
    width: 100%;
    height: 3.5rem;
    align-items: center;
    justify-content:space-between;
    &.roundedBtn{
      border-radius: 0rem;
      border: none;
    }
  }

  @media only screen and (max-width: $MobileWidth){

  }
</style>