// search format "[title] [release year] partner hd"
function showTrailer(){
  let trailerDIV = getEl('trailer');
  trailerDIV.style.left = 0;
}

function hideTrailer(){
  let trailerDIV = getEl('trailer');
  trailerDIV.style.left = '100%';
}

function getTrailer(movie){
  var id;
  let searchTerm = movie.title + ' movie trailer';
  let filters = {
    'part': 'snippet',
    'maxResults': 1,
    'q': searchTerm,
    'type': 'video',
    'key': configs['YT_API_KEY']
  }
  SendReq(VIDEO, {'success':loadVideoPlayer}, filters)
}


function loadVideoPlayer(response) {
  console.log(response)
  let id = response.items[0].id.videoId;
  console.log(id)
  let trailer = `<iframe id='trailerPlayer' class='YTPlayer' src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  getEl('trailerPlayer').outerHTML = trailer;
}
