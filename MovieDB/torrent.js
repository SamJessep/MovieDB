var Torrent = class{
  constructor(quality, website, title){
    this.quality = quality
    this.title = title
    this.website = website
    this.STerm = this.getSTerm(this.website, this.title)
    this.URL = this.getURL(this.website, this.STerm)
    
  }
  
  getSTerm(website, title) {
    let term = `${title.original_title} ${title.release_date.slice(0,4)} ${this.quality}`
    term = encodeURI(term)
    
    return term   
  }
  
  getURL(website, term) {
    var url
    
    switch (website) {
      case 'Pirate Bay':
        return url = `https://www.thepiratebay.org/search/${term}/0/99/0`;
      case '1337x':
        return url = `https://1337x.to/search/${term}/1/`;
      case 'rarbg':
         return url = `http://rarbg.to/torrents.php?search=${term}`;      
    return url
    }
  }
}
