var IO
function START_SOCKET(url){
  if(!IO){
    IO = io(url);
    IO.on('streamResponse', (res)=> Torrent.StreamStatus(res))
  }
}

function ADD_WATCHER(torrentID){
  IO.emit("addWatcher", torrentID)
}

function REMOVE_WATCHER(torrentID){
  IO.emit("removeWatcher", torrentID)
}
