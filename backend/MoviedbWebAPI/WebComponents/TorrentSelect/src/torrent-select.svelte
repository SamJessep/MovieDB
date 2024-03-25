<script lang="ts">
import { onMount, tick } from "svelte";


	enum MediaType{
		MOVIE="MOVIE",
		TV="TV"
	}

	type Option = {
		value: string|Number,
		text: string
	}

	type Episode = {
		Name:string,
		Number:Number
	}

	type Season = {
		Number: Number,
		Name?: string,
		Episodes: Episode[]
	}

	type Torrent = {
		text:string,
		value:string
	}

	type Selected = {
		Season:number,
		Episode:number,
		Torrent:string
	}


	export let title:string = "Harry Potter";
	export let server:string = "https://localhost:5001/api/dl/links";
	export let options : Option[] = [
		{value:123, text:"321"}
	]
	
	export let seasons: Season[] = [
		{Number: 1, Name: "Season 1", Episodes: [
			{Name:"episode 1", Number:1},
			{Name:"episode 2", Number:2},
			{Name:"episode 3", Number:3}
		]},
		{Number: 2, Name: "Season 2", Episodes: [
			{Name:"episode 1", Number:1}
		]},
		{Number: 3, Name: "Season 3", Episodes: [
			
		]}
	]

	export let seasonsjson:string
	if(seasonsjson) {
		const decodedJSON = unescape(seasonsjson)
		seasons = JSON.parse(decodedJSON)
	}

	export let mediatype:MediaType = MediaType.MOVIE;

	let selected:Selected = {
		Season:null,
		Episode:null,
		Torrent:null
	}
	let shouldLoad=false
	let torrentPromise:Promise<Torrent[]>

	const download = () => window.location.href = selected.Torrent

	const fetchTorrentLinks = async ():Promise<Torrent[]> =>{
		const query = mediatype == MediaType.TV ? title + " S0"+ selected.Season +" E0" + selected.Episode : title;
		const res = await fetch(server+"?query="+encodeURI(query))
		const json = await res.json()
		return json
	}

	const LoadTorrentLinks = () =>{ 
		torrentPromise = fetchTorrentLinks()
		shouldLoad=true
	}
	
	
	onMount(async () => {
		await tick();
		if(mediatype == MediaType.MOVIE) LoadTorrentLinks()
  });
</script>
<div class='extra-feature'>
	{#if mediatype == MediaType.TV}
	<label>
		Season
		<select data-tselect name="season" bind:value={selected.Season} placeholder="Season" on:change={()=>{console.log(selected, seasons, seasons.find(s=>s.Number == selected.Season));if(selected.Episode !== null) LoadTorrentLinks()}}>
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
			<select data-tselect name="episode" bind:value={selected.Episode} placeholder="Episode" on:change={LoadTorrentLinks}>
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
				<select data-tselect name="torrent" bind:value={selected.Torrent} placeholder="Torrent">
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

<svelte:options tag={"t-select"} immutable={false}/>


<style>
	label{
		display: block;
	}
	select{
		max-width: 100%;
		display: block;
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