<script>
import { onDestroy } from "svelte";

import config from "../../../../config";
import Api from "../../../../model/Api";
import TorrentWebsocket from "../../../../model/TorrentWebsocket"
import StreamSelect from "./StreamSelect.svelte";

export let width = 640;
export let height = 390;
// export let shown = false;
// export let autoplay = false;
export let title;

let selectedMagnet;
let src;
let videoElement
let streaming=false;
let src_selected = false;
let socket;
let status = "Awaiting status";


const SelectTorrent = e =>{
  selectedMagnet = e.detail.selected[0].value
  src_selected = selectedMagnet.startsWith("magnet:");
}

const StartStream = ()=>{
  src=config.DOTNET_API_URL+Api.StreamPath+"?magnetLink="+selectedMagnet;
  streaming = true;
  socket = TorrentWebsocket.Connect();
  console.log("socket connected", socket)
  socket.onmessage=ReciveMessage
  socket.addEventListener('open', function (event) {
    window.SOCKET= socket
    socket.send('Hello Server!');
    socket.send("MOVIEDB: hello")
  });
}

var progressData = {
  Seeds:0,
  Leechs:0,
  Progress:"",
  Status:""
}
const ReciveMessage = e =>{
  const message = e.data
  if(message){
    const json = JSON.parse(message)
    console.log(json)
    switch(json.Name){
      case "status":
        status = json.Message;
        break;
      case "progress":
        progressData = JSON.parse(json.Message);
        break;
    }
  }
}

onDestroy(()=>{
  if(socket) TorrentWebsocket.Close(socket)
})
</script>

{#if streaming}
<div class="stream_wrapper">
  <video {width} {height} {src} controls bind:this={videoElement}/>
  <div class="torrent_info">
    <div>Status: {status}</div>
    <div>Progress:{progressData.Progress} Seeds:{progressData.Seeds} Leechs:{progressData.Leechs}</div>
  </div>
</div>
{:else}
<div class="torrent_select_container">
  <span>
    <StreamSelect {title} on:select={SelectTorrent}/>
  </span>
  <button on:click={StartStream} disabled={!src_selected} class="start_btn">Start</button>
</div>
{/if}
<style lang="scss">
  // selector scss
  .start_btn{
    @include darkBtnOutline;
  }

  .torrent_select_container{
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & *{
      min-width: 50%;
    }    
  }

  // stream scss
  .stream_wrapper{
    width: 100%;
    display: flex;
    flex-direction: column;
    & video{
      flex-grow: 1;
    }
  }

  .torrent_info{
    width: 100%;
    background-color: red;
    height: 5rem;
  }
</style>