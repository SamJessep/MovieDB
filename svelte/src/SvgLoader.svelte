<script>
let Svgs = [
  'close'
]

export async function LoadSvgFile(filename){
  var svgContents = await fetch(`/images/${filename}.svg`).then(f=>f.text()).then(f=> f)
  return /(<svg[\s\S]*>[\s\S]*<\/svg>)/.exec(svgContents)[0].replace(/id="[\w\W]{1,}?"/,`id="${filename}_svg" display="none"`)
  .replace(/<path/, `<symbol id="${filename}_icon"/><path`).replace("path>", "path></symbol>")
}

console.log(Svgs)

</script>
{#each Svgs as svg}
  {#await LoadSvgFile(svg)}
    <p style="display:none">Loading SVGS</p>
  {:then loadedSVG}
    {@html loadedSVG}
  {/await}
{/each}
