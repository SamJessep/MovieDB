<script>
import SvgIcon from "../../general/SvgIcon.svelte"
import {GetSCSSVars} from "../../../util";
import {fade} from 'svelte/transition'

const scssVars = GetSCSSVars();
const loadStyles = `
  --color-1:${scssVars.AccentColor};
  --color-2:${scssVars.AccentColor2};`
</script>
<div transition:fade>
  <SvgIcon src="images/load.svg" styles={loadStyles}/>
  <p>Loading </p>
</div>

<style lang="scss">
  div{
    position: absolute;
    width:100%;
    display: flex;
    flex-direction: column;
    align-items: center;
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