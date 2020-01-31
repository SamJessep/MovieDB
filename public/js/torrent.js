Torrent = class{
  constructor(quality, website, movie){
    this.quality = quality
    this.movie = movie
    this.website = website
    this.STerm = this.getSTerm()
    this.URL = this.getURL()

  }
  static loadGif;
  static linkSelect;
  static errorMsg;

  static GetTorrents(data){
    Torrent.loadGif = getEl('torrentLoad')
    Torrent.linkSelect = getEl('linkSelect')
    Torrent.errorMsg = getEl('torrentError')
    show(Torrent.loadGif);
    hide(Torrent.linkSelect);
    hide(Torrent.errorMsg);
    var baseURL = 'https://mdbscrap.herokuapp.com/'
    SendReq(baseURL, {'success':Torrent.torrentLoaded, 'fail':Torrent.torrentFailed}, {
      'url' : new Torrent(getEl('quality').value, AppPreferences.downloadSite, {'original_title' : detailedPageMovie.title, 'release_date': detailedPageMovie.releaseDate}).URL,
      'site' : AppPreferences.downloadSite
    })
  }

  static torrentLoaded(data){
    if(data.length > 0){
      let options = ''
      for(let aTorrent of data){
        let difference = aTorrent.seeds - aTorrent.leeches;
        options += `<option value=${aTorrent.link}>${aTorrent.title} ${aTorrent.seeds}&#8593; ${aTorrent.leeches}&#8595;</option>`
      }
      Update(getEl('selector'), options);
      hide(Torrent.loadGif);
      show(Torrent.linkSelect);
    }else{
      Torrent.torrentFailed()
    }
  }

  static torrentFailed(){
    hide(Torrent.loadGif);
    show(Torrent.errorMsg);
  }

  static RunTorrent(){
    let magnet = getEl('selector').value;
    window.location.href = magnet;
  }

  getSTerm() {
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
