<script>
import SvgIcon from "../../general/SvgIcon.svelte"
import {GetSCSSVars} from "../../../util";
import {fade} from 'svelte/transition'

export let Message="Loading";
const scssVars = GetSCSSVars();
const loadStyles = `
  --color-1:${scssVars.AccentColor};
  --color-2:${scssVars.AccentColor2};`
</script>
<div transition:fade>
  <SvgIcon src="images/load.svg" styles={loadStyles}/>
  <p>{Message} </p>
</div>

<style lang="scss">
  div{
    z-index: 10;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    max-height: 100%;
  }
  p{
    color: $FontColor;
    font-weight: 600;
  }
  p::after{
    content: "...";
    animation: loading 1.5s linear 0s infinite;
  }
  @keyframes loading {
  0%   {content: ""}
  25%  {content: "."}
  50%  {content: ".."}
  100% {content: "..."}
  }

</style>