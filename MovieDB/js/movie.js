class Movie {
  constructor(data) {
    this.allData = data
    this.id = data.id;
    this.title = data.title;
    this.about = data.overview;
    this.rating;
    this.releaseDate = data.release_date;
    this.runTime = data.runtime;
    this.genres = data.genres || data.genre_ids;
    this.images = {
      poster: IMAGE(data.poster_path, 'original'),
      backdrop: IMAGE(data.backdrop_path, 'original') || '../images/noBackDrop.jpg'
    }
  }
  
  updateCountryData(data){
    for(let aRegion of data){
      if(aRegion['iso_3166_1'] == AppPreferences.country){
        console.log(aRegion['release_dates'][0])
        this.rating = aRegion['release_dates'][0]['certification'];
        this.releaseDate = aRegion['release_dates'][0]['release_date'].split('T')[0];
      }
    }
  }

  makeCard(){
    return `
    <div class="card movie" id=${this.id} onclick='LoadDetailed(this.id)'>
      <img class='poster' src="${this.images['poster']}">
      <div class="card-body hidden">
        <h1 class="card-title">${this.title}</h1>
        <p>${this.about}</p>
      </div>
    </div>`;
  }

  GetDetailed(){
    this.updateCountryData(this.allData.release_dates.results)
    let genreLinks = [];
    for(let aLink of this.genres){
      genreLinks.push(makeGenreLink(aLink));
    }
    return`
    <div class="detailedDiv" >
    
      <div id='shortAbout'>
      <img class="detailsBackDrop" src="${this.images['backdrop']}">
        <p class='noBoarder'>${this.rating}</p>
        <p>${this.runTime} mins</p>
        <p>${this.releaseDate}</p>
      </div>
      <div class="detailedText">
        <h2>${this.title}</h2>
        <p>${this.about}</p>
        <strong>Genres:</strong><span>${genreLinks.join(', ')}</span>
        <details id='downloads' class='detailSection' open>
          <summary>Downloads</summary>
          <label for="quality">Movie quality</label>
          <select id="quality" onchange='GetTorrents()'>
            <option value="720p">720p</option>
            <option value="1080p" selected>1080p</option>
            <option value="1440p">1440p</option>
            <option value="4k">4k</option>
          </select>
          <img class='inline hidden' id='torrentLoad' src='../images/torrentLoad.gif' />
          <div id='linkSelect' class='inline shown'>
            <label for="selector">Choose a link</label>
            <select id="selector">
              <option value="">Link 1</option>
              <option value="">Link 2</option>
              <option value="">Link 3</option>
            </select>
            <button onclick='RunTorrent()'>Download</button>
          </div>
          <span id='torrentError' class='hidden'>No links available</span>
        </details>
      </div>
      <details class='detailSection' id='reviews'></details>
      <details class='detailSection' id='Recommendations' open></details>
    </div>`;

  }

  MakeRecomendationSection(){
    MDBReq(SIMILAR(this.id), AddRecomendations, {
      'language' : AppPreferences.getLang(),
      'include_adult' : AppPreferences.includeAdult
    })
  }
  MakeReviewSection(){
    MDBReq(REVIEW(this.id), AddReviews, {
      'language' : AppPreferences.getLang(),
      'include_adult' : AppPreferences.includeAdult,
    })
  }
}
