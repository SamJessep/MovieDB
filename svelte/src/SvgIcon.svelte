<script>
import {SvgIDS} from './stores.js';
export let src;
export let styles = "";

var svgID = GetSvgID();

styles = styles.replaceAll("SVGID", svgID);

function GetSvgID(){
  return "SVG_"+$SvgIDS++
}

async function LoadSvgFile(src){
  var svgContents = await fetch(src).then(f=>f.text()).then(f=> f)
  var inner = /<svg[\w\W]{1,}?>([\w\W]*)<\/svg>/.exec(svgContents)[1];
  return svgContents.replace(inner, "<style>"+styles+"</style>"+inner).replace(/<svg/, `<svg id=${svgID}`);
}
</script>
{#await LoadSvgFile(src)}
  <svg/>
{:then loadedSVG}
    {@html loadedSVG}
{/await}
