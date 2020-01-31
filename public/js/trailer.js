// search format "[title] [release year] partner hd"
var trailer;

function showTrailer(){
  let trailerDIV = getEl('trailer');
  trailerDIV.classList.add('open');
  trailer.playVideo();
}

function hideTrailer(){
  let trailerDIV = getEl('trailer');
  trailerDIV.classList.retheRouter.Move('open')
  trailer.pauseVideo();
}

function getTrailer(movie){
  var id;
  let searchTerm = movie.title + ' movie trailer';
  let filters = {
    'part': 'snippet',
    'fields': 'id',
    'maxResults': 1,
    'q': searchTerm,
    'type': 'video',
    'key': configs['YT_API_KEY']
  }
  SendReq(VIDEO, {'success':loadVideoPlayer, 'fail':hidePlayer}, filters)
}


function loadVideoPlayer(response) {
  let id = response.items[0].id.videoId;
  let trailer = `<iframe id='trailerPlayer' class='YTPlayer' tabindex="-1" src="https://www.youtube.com/embed/${id}?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  getEl('trailerPlayer').outerHTML = trailer;
  addYoutubeScripts()
}

function hidePlayer(){
  let player = document.getElementsByClassName('trailerSlide')[0];
  if(player){
    player.outerHTML = '';
    getEl('trailer').outerHTML = '';
  }
}

function addYoutubeScripts(){
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('trailerPlayer', {
      events: {
        'onReady': onPlayerReady
      }
  });
}
function onPlayerReady(event) {
  trailer = event.target;
  if(getEl('trailerPlayer').classList.contains('open')){
    trailer.playVideo();
  }
}
