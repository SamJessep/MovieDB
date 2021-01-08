<script>
	export let PlaceHolder = "Search...";
</script>

	<img id="logo" src="images/MDB_logo.png" />
	<div id="search">
		<input placeholder={PlaceHolder} />
		<img src="images/search.svg" />
	</div>

<style>
	#logo {
		max-width: 50vw;
		max-height: 20vh;
		display: block;
		cursor: pointer;
		margin: 0 auto 4rem auto;
	}

	#search {
		display: flex;
		justify-content: center;
		margin: 0 2vw;
		text-align: center;
	}

	#search>img {
	width: 10vmin;
	height: auto;
	cursor: pointer;
	filter: var(--ImgColor);
}

  #search>img:active,#search>img:hover {
    filter: var(--ImgClickColor);
}
	#search>input {
		width: 80vw;
		height: 10vmin;
		display: block;
		font-size: 10vmin;
		border: none;
		border-bottom: solid var(--FontColor, black) 0.5vmin;
		margin-right: 2vmin;
		padding: 0;
	}

	#search>input:hover,
	#search>input:focus {
		border-bottom: solid #00d474 0.5vmin;
		outline: none;
	}
</style>
