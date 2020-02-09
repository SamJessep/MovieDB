class Result{
    constructor(data){
      this.allData = data;
      this.trailer;
      this.type = data.media_type || 'movie';
    }

    updateCountryData(data){
      for(let aRegion of data){
        if(aRegion['iso_3166_1'] == app.preferences.country){
          this.rating = aRegion['release_dates'][0]['certification'] || 'n/a';
          this.releaseDate = aRegion['release_dates'][0]['release_date'].split('T')[0];
        }
      }
    }

    makeCard(){
      let poster = this.getPoster(this.images['poster'], 'poster')
      return `
      <button class="card movie" id=${this.id} onclick='theRouter.Move("Details/${this.type}/${this.id}")' tabindex='0'>
      <div class='cardContainer' >
        <div class='posterContainer'>
        ${poster}
          <h1 class="card-title hidden">${this.title}</h1>
          <p class='addToFavourites'  onclick='app.LoggedUser.AddMovieToWatchList(this.parentElement.parentElement.parentElement.id)'>Add to favs</p>
        </div>
        </div>
      </button>`;
    }


    makeDetailedPage(){
      this.updateCountryData(this.allData.release_dates.results);
      this.trailer = new Trailer(this.allData)
      let backdrop = this.getPoster(this.images['backdrop'], 'detailsBackDrop');
      let trailer = this.getTrailer();
      let shortAbout = this.getShortAbout();
      let description = this.getDescripton();
      let downloadSection = this.getDownloadSection();
      this.addReviews(null,'movie')
      this.addRelatedResults(null,'movie');
      return`
      <div class="detailedDiv" >
        <div id='BackdropDiv'>
          ${backdrop}
          ${trailer}
        </div>
          ${shortAbout}
          ${description}
          ${downloadSection}
        <details class='detailSection' id='reviews'></details>
        <details class='detailSection' id='Recommendations' open></details>
      </div>`;
    }

    getPoster(srcs, classSelector){
      let poster;
      if(srcs){
        poster = `<img class='${classSelector} lazy' id="${this.id}_Poster" src="${srcs['SD']}" data-src="${srcs['HD']}" alt='"${this.title}" Movie poster'>
        <div class="spinner" id='${this.id}_loader'>
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
        `
      }else{
        poster = `<div class='${classSelector} ${'no_'+classSelector}'>
        ${classSelector == 'poster'? `<p>${this.title}</p><strong>No Poster</strong>`:`<strong>No Backdrop</strong>`}
        </div>`
      }
      return poster;
    }

    getTrailer(){
      return `
      <div class='trailerSlide'><img class='openTrailer' src='images/roundedPlay.svg' onclick='app.loadedResult.trailer.showTrailer()'></div>
      <div id='trailer'>
        <img class='closeTrailer' src='images/close.svg' onclick='app.loadedResult.trailer.hideTrailer()'>
        <iframe id='trailerPlayer'>
          <h1>Loading trailer...</h1>
        </iframe>
      </div>`
    }

    getShortAbout(){
      return `
      <div id='shortAbout'>
        <p class='noBoarder'>${this.rating?this.rating:''}</p>
        <p>${this.runTime} mins</p>
        <p id='release-date'>${this.releaseDate}</p>
        <div id="starRatingContainer">
          <div class='ratings' id='rating-bg'></div>
          <div class='ratings' id='rating' style='width:${(this.starRating/2)*5}vmin;'></div>
        </div>
      </div>
      `;
    }

    getDescripton(){
      let genreLinks = [];
      for(let aLink of this.genres){
        genreLinks.push(new Genre(aLink.id,aLink.name,this.type).makeLink('result'));
      }
      return `
      <div class="detailedText">
        <h2 id='title'>${this.title}</h2>
        <p id='description'>${this.about}</p>
        <strong>Genres:</strong><span>${genreLinks.join(', ')}</span>
      </div>`
    }

    getDownloadSection(errorMsg = 'No links available'){
        let isTV = this.type == "tv";
        let selectOptions = ''
        let qualities = ['720p', '1080p', '1440p', '4k'];
        for(let quailty of qualities){
          selectOptions += `<option value="${quailty}">${quailty}</option>`;
        }
        return `
        <details id='downloads' class='detailSection' open>
          <summary>Downloads</summary>
          <div class='detailContents'>
            <label for="quality">Movie quality</label>
            <select id="quality" onchange='Torrent.GetTorrents(${isTV})'>
              ${selectOptions}
            </select>

            <div id="torrentLoad" class='hidden' >
              <div class="bounce1"></div>
              <div class="bounce2"></div>
              <div class="bounce3"></div>
            </div>

            <div id='linkSelect' class='inline hidden'>
              <label for="selector">Choose a link</label>
              <select id="selector">
                <option value="">Loading</option>
              </select>
              <button onclick='Torrent.RunTorrent()'>Download</button>
          </div>
          <span id='torrentError' class='hidden'>${errorMsg}</span>
        </details>
        `
    }

    addReviews(data,type){
      if(data){
        let html = '<summary>Reviews</summary><div class="detailContents">';
        if(data.results.length == 0){html += '<strong>no reviews</strong>'}
        for(let aReview of data.results){
          html += new Review(aReview).formatReview();
        }
        html += '</div>'
        app.Update(app.getEl('reviews'), html)
      }else{
        MDBReq(REVIEW(this.id,type), this.addReviews, {
          'language' : app.preferences.getLang(),
          'include_adult' : app.preferences.includeAdult,
        })
      }
    }

    addRelatedResults(data,type){
      if(data){

        let title = this.type == 'tv' ? 'TV shows' : 'Movies';
        let html = `<summary>Similar ${title}</summary><div class="detailContents">`
        for(let aMovie of data.results){
          aMovie.media_type = this.type;
          html += new Movie(aMovie).makeCard();
        }
        html += '</div>'
        app.Update(app.getEl('Recommendations'), html)
      }else{
        this.type = type;
        MDBReq(SIMILAR(this.id,type), this.addRelatedResults.bind(this), {
          'language' : app.preferences.getLang(),
          'include_adult' : app.preferences.includeAdult
        },false, type)
      }
    }
}
