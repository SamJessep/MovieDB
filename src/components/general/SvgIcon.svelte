<script>
export let src;
export let styles = "width:fit-content;";
export let cache = true;
export let width = "100%"
export let height = "100%"
export let attributes = []
let name = /([^\/]*).svg/g.exec(src)[1]

async function LoadSvgFile(src){
  var svgContents = await fetch(src).then(f=>f.text()).then(f=> f)
  var container = document.createElement('div')
  container.innerHTML = svgContents
  var svg = container.querySelector('svg')
  svg.style=styles
  if(!cache) return svg.outerHTML;
  const inner = svg.innerHTML
  if(!svg_ref_exists(name)){
    create_svg_ref(name, inner, svg)
  }
  svg.innerHTML = `<use href="#svg_ref_${name}"/>`
  attributes = [
    {name:"width", value:width},
    {name:"height", value:height},
    ...attributes
  ]
  attributes.forEach(atribute=>svg.setAttribute(atribute.name, atribute.value))
  return svg.outerHTML;
}

const svg_ref_exists = name => {
  return document.getElementById("svg_ref_"+name) !== null
}

const create_svg_ref = (name,svg_insides, svgNode) => {
  var svgns   = "http://www.w3.org/2000/svg";
  const svgShell = svgNode.cloneNode()
  const container = document.createElementNS(svgns, "g");
  container.innerHTML = svg_insides
  container.setAttributeNS(null, "id", "svg_ref_"+name)
  svgShell.appendChild(container)
  document.querySelector('#svg_refs').appendChild(svgShell)
}
</script>
{#await LoadSvgFile(src)}
  <svg/>
{:then loadedSVG}
    {@html loadedSVG}
{/await}
