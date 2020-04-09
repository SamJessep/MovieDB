Torrent = class{
  constructor(quality, website, media){
    this.quality = quality
    this.media = media
    this.website = website
    this.STerm;
    this.URL = this.getURL()

  }
  static loadGif;
  static linkSelect;
  static errorMsg;

  static GetTorrents(isTVShow = false){
    let resultData = app.loadedResult
    Torrent.loadGif = app.getEl('torrentLoad')
    Torrent.linkSelect = app.getEl('linkSelect')
    Torrent.errorMsg = app.getEl('torrentError')
    app.show(Torrent.loadGif);
    app.hide(Torrent.linkSelect);
    app.hide(Torrent.errorMsg);
    var baseURL = 'https://mdbscrap.herokuapp.com/Torrent.php'
    SendReq(baseURL, {'success':Torrent.torrentLoaded.bind(isTVShow), 'fail':Torrent.torrentFailed}, {
      'url' : new Torrent(app.getEl('quality').value,
       app.preferences.downloadSite,resultData).URL,
      'site' : app.preferences.downloadSite
    })
    if(isTVShow){
      SendReq(baseURL, {'success':Torrent.torrentLoaded.bind(false), 'fail':Torrent.torrentFailed}, {
        'url' : new Torrent(app.getEl('quality').value,
         app.preferences.downloadSite,resultData).getURL(true),
        'site' : app.preferences.downloadSite
      })
    }
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
      Torrent.torrentFailed(this)
    }
  }

  static torrentFailed(skip){
    if(!skip){
      app.hide(Torrent.loadGif);
      app.show(Torrent.errorMsg);
    }
  }

  static RunTorrent(){
    let magnet = app.getEl('selector').value;
    window.location.href = magnet;
  }

  static DownloadToPC(){
    let link = app.getEl('selector').value;
    let port = 5000
    let pcURL = `http:192.168.1.90${port}/add_torrent`
    let query = {magnet:link}

    MDBReq(pcURL, (response)=>{
      alert(response)
    }, query, scrollTop = false);
  }

  getTVSearchTerm(tryZeroPrefix){
    let s = this.media;
    let sn = s.selectedSeason.seasonNumber;
    let en = s.selectedEpisode.episodeNumber;
    if(tryZeroPrefix){
      sn = sn.toString.length==1?'0'+sn:sn;
      en = en.toString.length==1?'0'+en:en;
    }
    let term = `${s.title} S${sn}E${en} ${this.quality}`
    return term;
  }

  getSearchTerm() {
    let m = this.media
    let term = `${m.title} ${m.releaseDate.slice(0,4)} ${this.quality}`
    return term;
  }

  getURL(zeroPrefix) {
    if(this.media.hasOwnProperty('season') || this.media.type == 'tv'){
      this.STerm = this.getTVSearchTerm(zeroPrefix);
    }else{
      this.STerm = this.getSearchTerm()
    }
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
     return url;
  }
}
