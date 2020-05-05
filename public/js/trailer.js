// search format "[title] [release year] partner hd"
class Trailer{
  constructor(movie){
    this.searchTerm = this.getYTSearchTerm();
    this.video;
    this.trailerEl;
    this.player;
    this.getTrailer();
  }

  getYTSearchTerm(){
    if(app.loadedResult.type == 'tv'){
      return app.loadedResult.title + ' trailer';
    }else if(app.loadedResult.type == 'movie'){
      return app.loadedResult.title + ' movie trailer';
    }
  }

  getTrailer(){
    let filters = {
      'part': 'id',
      'maxResults': 1,
      'q': this.searchTerm,
      'type': 'video',
      'key': configs['YT_API_KEY']
    }
      //SendReq(VIDEO, {'success':this.loadVideoPlayer.bind(this), 'fail':this.tryWebScrape.bind(VIDEO,filters)}, filters);
      this.checkForYoutubeAPI(VIDEO,filters,this.loadVideoPlayer.bind(this))
  }

  checkForYoutubeAPI(url, filters,success){
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
            success()
            return xhr;
        },
        error: this.YTError.bind(this)
    });
  }

  YTError(err){
    console.log("Youtube API unavailable, trying alt method");
    this.tryWebScrape()
    this.hideTrailer()
  }

  showTrailer(){
    let trailerEl = app.getEl('trailer');
    trailerEl.classList.add('open');
    if(this.player){
      this.player.playVideo();
    }
  }

  hideTrailer(){
    let trailerEl = app.getEl('trailer');
    if(trailerEl){
      trailerEl.classList.remove('open')
      if(this.player){
        this.player.pauseVideo();
      }

    }
  }

  tryWebScrape(){
    let url = `https://mdbscrap.herokuapp.com/YT.php`
    SendReq(url, {'success':this.loadVideoPlayer.bind(this), 'fail':this.hideTrailer.bind(this)}, {q:encodeURI(this.searchTerm)});
  }

  removePlayer(){
    let player = document.getElementsByClassName('trailerSlide')[0];
    if(player){
      player.outerHTML = '';
      app.getEl('trailer').outerHTML = '';
    }
  }

  loadVideoPlayer(response) {
    let id
    if(response.hasOwnProperty('items')){
      id = response.items[0].id.videoId;
    }else{
      id = response.id
    }
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
