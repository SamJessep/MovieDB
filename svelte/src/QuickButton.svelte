<script>
export let buttonText;
export let buttonClick;
</script>

<button on:click={buttonClick}>
  {buttonText}
</button>

<style>
button{
  background-color: transparent;
  color: var(--FontColor,black);
  border: none;
  margin: 1.5vmin 0;
  padding: 0;
  cursor: pointer;
}

button:hover{
  font-weight:600;
  color:var(--AccentColor, green);
}

button:active{
  color:var(--SelectedColor, lightgreen);
  background-color:transparent;
}
</style>
