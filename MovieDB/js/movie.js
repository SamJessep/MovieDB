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
      poster: IMAGE(data.poster_path),
      backdrop: IMAGE(data.backdrop_path, 'w92')
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
    let poster = this.getPoster(this.images['poster'], 'poster')
    let id = this.id+'_Poster';
    return `
    <div class="card movie" id=${this.id} onclick='LoadDetailed(this.id)'>
      ${poster}
      <div class="card-body hidden">
        <h1 class="card-title">${this.title}</h1>
        <p>${this.about}</p>
      </div>
    </div>`;
  }

  getPoster(srcs, classSelector){
    let poster;
    if(srcs){
        poster = `<img class='${classSelector} lazy' id="${this.id}_Poster" src="${srcs['SD']}" data-src="${srcs['HD']}">`
    }else{
      poster = `<div class='${classSelector} ${'no_'+classSelector}'>
                  ${classSelector == 'poster'? `<p>${this.title}</p><strong>No Poster</strong>`:`<strong>No Backdrop</strong>`}
                </div>`
    }
    return poster;
  }

  GetDetailed(){
    getTrailer(this)
    this.updateCountryData(this.allData.release_dates.results)
    let genreLinks = [];
    for(let aLink of this.genres){
      genreLinks.push(makeGenreLink(aLink));
    }
    let poster = this.getPoster(this.images['backdrop'], 'detailsBackDrop')
    return`
    <div class="detailedDiv" >
      <div id='BackdropDiv'>
        ${poster}
        <div class='trailerSlide'><img class='openTrailer' src='images/roundedPlay.svg' onclick='showTrailer()'></div>
        <div id='trailer'>
          <img class='closeTrailer' src='images/close.svg' onclick='hideTrailer()'>
          <iframe id='trailerPlayer'></iframe>
        </div>
      </div>
      <div id='shortAbout'>
        <p class='noBoarder'>${this.rating}</p>
        <p>${this.runTime} mins</p>
        <p>${this.releaseDate}</p>
      </div>
      <div class="detailedText">
        <h2>${this.title}</h2>
        <p>${this.about}</p>
        <strong>Genres:</strong><span>${genreLinks.join(', ')}</span>
      </div>
        <details id='downloads' class='detailSection' open>
          <summary>Downloads</summary>
          <div class='detailContents'>
            <label for="quality">Movie quality</label>
            <select id="quality" onchange='Torrent.GetTorrents()'>
              <option value="720p">720p</option>
              <option value="1080p" selected>1080p</option>
              <option value="1440p">1440p</option>
              <option value="4k">4k</option>
            </select>
            <img class='inline hidden' id='torrentLoad' src='images/torrentLoad.gif' />
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
