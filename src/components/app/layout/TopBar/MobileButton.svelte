<script>
  import SvgIcon from "../../../general/SvgIcon.svelte";

  export let title = "";
  export let click = ()=>false;

  const chevronStyles = `svg#SVGID{
  width: 3rem;
  height: 3rem;
  padding: 1vmin 0;
  transition: fill 0.5s;
}`
</script>

<button class="nonStandard roundedBtn" on:click={click}>
  <SvgIcon src="images/chevron-left.svg" styles={chevronStyles} />
  <h1>{title}</h1>
  <slot/>
</button>

<style>
  button{
    font-size: var(--HeaderFontSize);
    background-color: transparent;
    border: none;
    display: flex;
    color: var(--FontColor);
    width: 100%;
    align-items: center;
    justify-content:flex-end;
    border-radius: 0rem;
  }
</style>