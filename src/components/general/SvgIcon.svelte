<script>
import {SvgIDS} from '../../stores/store';

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
  return svgContents.replace(/<svg/, `<svg id=${svgID} style="${styles}"`);
}
</script>
{#await LoadSvgFile(src)}
  <svg/>
{:then loadedSVG}
    {@html loadedSVG}
{/await}
