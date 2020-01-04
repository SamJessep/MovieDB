Torrent = class{
  constructor(quality, website, movie){
    this.quality = quality
    this.movie = movie
    this.website = website
    this.STerm = this.getSTerm()
    this.URL = this.getURL()

  }

  getSTerm() {
    let m = this.movie
    let term = `${m.original_title} ${m.release_date.slice(0,4)} ${this.quality}`
    return encodeURI(term)
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
     return url
  }
}
