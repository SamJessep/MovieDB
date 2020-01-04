class Movie {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.about = data.overview;
    this.releaseDate = data.release_date;
    this.runTime = data.runtime;
    this.genres = data.genres || data.genre_ids;
    this.images = {
      poster: IMAGE(data.poster_path),
      backdrop: IMAGE(data.backdrop_path, 'w1280') || '../images/noBackDrop.jpg'
    }
  }

  makeCard(){
    return `
    <div class="card movie" id=${this.id} onclick='LoadDetailed(this.id)'>
      <img src="${this.images['poster']}">
      <div class="card-body">
        <h1 class="card-title">${this.title}</h1>
        <p>${this.about}</p>
      </div>
    </div>`;
  }

  GetDetailed(){
    let genreLinks = [];
    for(let aLink of this.genres){
      genreLinks.push(makeGenreLink(aLink));
    }
    return`
    <div class="detailedDiv" >
      <img class="detailsBackDrop" src="${this.images['backdrop']}">
      <div class="detailedText">
        <h1>${this.title}</h1>
        <p>${this.about}</p>
        <ul>
          <li>Release Date: ${this.releaseDate}</li>
          <li>Run time: ${this.runTime} mins</li>
          <li>Genres: ${genreLinks.join(', ')}</li>
        </ul>
        <div>
          <h2>Download</h2>
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
        </div>
      </div>
      <div id='reviews'></div>
      <div id='Recommendations'></div>
    </div>`;

  }

  MakeRecomendationSection(){
    MDBReq(SIMILAR(this.id), AddRecomendations, {
      'language' : AppPreferences.getLang()
    })
  }
  MakeReviewSection(){
    MDBReq(REVIEW(this.id), AddReviews, {
      'language' : AppPreferences.getLang()
    })
  }
}
