// search format "[title] [release year] partner hd"
class Trailer{
  constructor(movie){
    this.searchTerm = movie.title + ' movie trailer';
    this.video;
    this.trailerEl;
    this.player;
    this.getTrailer();
  }

  getTrailer(){
    let filters = {
      'part': 'id',
      'maxResults': 1,
      'q': this.searchTerm,
      'type': 'video',
      'key': configs['YT_API_KEY']
    }
      SendReq(VIDEO, {'success':this.loadVideoPlayer.bind(this), 'fail':this.tryWebScrape.bind(VIDEO,filters)}, filters);
  }

  /*checkForYoutubeAPI(url, filters){
    $.ajax({
        url: url,
        type: 'GET',
        data: {
          ...filters
        },
        xhr: function(){
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener("error", function(evt){
                alert("an error occured");
            }, false);
            xhr.addEventListener("abort", function(){
                alert("cancelled");
            }, false);
            this.loadVideoPlayer(xhr)
            return xhr;
        },
        error: function (err) {
          alert('YT API down');
            console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            this.removePlayer()
        }
    });
  }*/

  showTrailer(){
    console.log(this)
    let trailerEl = app.getEl('trailer');
    trailerEl.classList.add('open');
    if(this.player){
      console.log(this.player)
      this.player.playVideo();
    }
  }

  hideTrailer(){
    let trailerEl = app.getEl('trailer');
    trailerEl.classList.remove('open')
    this.player.pauseVideo();
  }

  tryWebScrape(url,filters){

  }

  removePlayer(){
    let player = document.getElementsByClassName('trailerSlide')[0];
    if(player){
      player.outerHTML = '';
      app.getEl('trailer').outerHTML = '';
    }
  }

  loadVideoPlayer(response) {
    let id = response.items[0].id.videoId;
    let origin = window.location.href;
    this.video = `<iframe id='trailerPlayer' class='YTPlayer' onload="attachYTController()" tabindex="-1" src="https://www.youtube.com/embed/${id}?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    app.getEl('trailerPlayer').outerHTML = this.video;
  }
}
var player;
function attachYTController() {
  player = new YT.Player('trailerPlayer', {
      events: {
        'onReady': onPlayerReady
      }
  });
}
function onPlayerReady(event) {
  app.loadedResult.trailer.player = event.target;
}
