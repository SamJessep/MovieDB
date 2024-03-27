<script lang="js">
	import { onMount, tick } from "svelte";
	
	const MediaType = {
		MOVIE:"MOVIE",
		TV:"TV"
	}

	export let title = "";
	export let server = "";
	export let options = []
	export let seasons = []
	export let seasonsjson;
	if(seasonsjson) {
		const decodedJSON = unescape(seasonsjson)
		seasons = JSON.parse(decodedJSON)
	}

	export let mediatype = MediaType.MOVIE;

	let selected = {
		Season:null,
		Episode:null,
		Torrent:null
	}
	let shouldLoad=false
	let torrentPromise

	const download = () => window.location.href = selected.Torrent

	const fetchTorrentLinks = async () =>{
		const query = mediatype == MediaType.TV ? title + " S0"+ selected.Season +" E0" + selected.Episode : title;
		const res = await fetch(server+"?query="+encodeURI(query))
		const json = await res.json()
		return json
	}

	const loadTorrentLinks = () =>{ 
		torrentPromise = fetchTorrentLinks()
		shouldLoad=true
	}

	const seasonChange = () => {
		if(selected.Episode !== null) loadTorrentLinks()
	}
	
	
	onMount(async () => {
		await tick();
		if(mediatype == MediaType.MOVIE) loadTorrentLinks()
  });
</script>
<div class='extra-feature'>
	{#if mediatype == MediaType.TV}
	<label>
		Season
		<select name="season" bind:value={selected.Season} placeholder="Season" on:change={seasonChange}>
			{#if seasons.length > 0}
				<option disabled selected>Select a season</option>
			{/if}
			{#each seasons as season}
				<option value={season.Number}>{season.Number}: {season.Name}</option>
			{:else}
				<option selected disabled value="">No seasons found</option>
			{/each}
		</select>
	</label>

		{#if selected.Season !== null}
		<label>
			Episode
			<select name="episode" bind:value={selected.Episode} placeholder="Episode" on:change={loadTorrentLinks}>
				{#each seasons.find(s=>s.Number == selected.Season).Episodes as episode}
					<option value={episode.Number}>{episode.Number}: {episode.Name}</option>
				{:else}
					<option selected disabled value="">No episodes found</option>
				{/each}
			</select>
		</label>
		{/if}
	{/if}

	{#if (selected.Season !== null && selected.Episode !== null) || mediatype == MediaType.MOVIE}

	{#if shouldLoad}
		{#await torrentPromise}
			Fetching Links... :)
		{:then torrents}
			<label>
				Torrent
				<select name="torrent" bind:value={selected.Torrent} placeholder="Torrent">
					{#each torrents as option}
						<option value={option.value}>{option.text}</option>
					{:else}
						<option selected disabled value="">No links found</option>
					{/each}
				</select>
			</label>
		{:catch error}
			<span>{error}</span>
		{/await}
	{/if}


	{/if}
	<button data-button on:click={download} disabled={!selected}>
			Download
	</button>
</div>

<style lang="css">
	label{
		display: grid;
		grid-template-columns: 25% auto;
	}

	select{
	  max-width: 100%;
    flex-grow: 1;
    background-color: #3a3a3a;
    padding: 0.25rem;
    color: #ffffff;
    border-radius: 0.2rem;
    border: solid #2c2c2c 2px;
	}

	button{
		border-radius: 0.2rem;
    padding: 0.3rem;
    font-size: 1rem;
    background-color: #3a3a3a;
    color: #ffffff;
    transition: border 0.2s;
    border: solid 2px #ffffff;
    width: fit-content;
    display: flex;
    text-align: center;
    align-items: center;
		cursor: pointer;
	}
</style>