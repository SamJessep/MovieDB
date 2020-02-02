Torrent = class{
  constructor(quality, website, movie){
    this.quality = quality
    this.movie = movie
    this.website = website
    this.STerm = this.getSearchTerm()
    this.URL = this.getURL()

  }
  static loadGif;
  static linkSelect;
  static errorMsg;

  static GetTorrents(data){
    Torrent.loadGif = app.getEl('torrentLoad')
    Torrent.linkSelect = app.getEl('linkSelect')
    Torrent.errorMsg = app.getEl('torrentError')
    app.show(Torrent.loadGif);
    app.hide(Torrent.linkSelect);
    app.hide(Torrent.errorMsg);
    var baseURL = 'https://mdbscrap.herokuapp.com/'
    SendReq(baseURL, {'success':Torrent.torrentLoaded, 'fail':Torrent.torrentFailed}, {
      'url' : new Torrent(app.getEl('quality').value, app.preferences.downloadSite, {'original_title' : app.loadedMovie.title, 'release_date': app.loadedMovie.releaseDate}).URL,
      'site' : app.preferences.downloadSite
    })
  }

  static torrentLoaded(data){
    if(data.length > 0){
      let options = ''
      for(let aTorrent of data){
        let difference = aTorrent.seeds - aTorrent.leeches;
        options += `<option value=${aTorrent.link}>${aTorrent.title} ${aTorrent.seeds}&#8593; ${aTorrent.leeches}&#8595;</option>`
      }
      app.Update(app.getEl('selector'), options);
      app.hide(Torrent.loadGif);
      app.show(Torrent.linkSelect);
    }else{
      Torrent.torrentFailed()
    }
  }

  static torrentFailed(){
    app.hide(Torrent.loadGif);
    app.show(Torrent.errorMsg);
  }

  static RunTorrent(){
    let magnet = app.getEl('selector').value;
    window.location.href = magnet;
  }

  getSearchTerm() {
    let m = this.movie
    let term = `${m.original_title} ${m.release_date.slice(0,4)} ${this.quality}`
    return term;
  }

  getURL() {
    let url;
    switch (this.website) {
      case 'thepiratebay':
        url = `https://www.thepiratebay.org/search/${this.STerm}/0/99/0`;
        break;
      case '1337x':
        url = `https://1337x.to/search/${this.STerm}/1/`;
        break;
      case 'rarbg':
         url = `http://rarbg.to/torrents.php?search=${this.STerm}`;
         break;
     }
     //return encodeURI(url)
     return url
  }
}
