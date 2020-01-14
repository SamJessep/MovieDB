var searchArea = getEl('searchResults');
var searchBody = getEl('searchBody');
var details = getEl('details');
var page, totalPages, detailedPageMovie;
var AppPreferences = new Preferences();

MDBReq('https://api.themoviedb.org/3/configuration/languages', AppPreferences.saveLanguages.bind(AppPreferences), {});

MDBReq('https://api.themoviedb.org/3/configuration/countries', AppPreferences.saveCountries.bind(AppPreferences), {});



function showPreferenceMenu(){
  getEl('PreferencesMenu').classList.toggle('hidden');
}

function getEl(id){
  return document.getElementById(id);
}

function Update(el, content){
  el.innerHTML = content;
}

function Append(el, content){
  el.innerHTML += content
}

function home(){
  hide(getEl('PreferencesMenu'))
  empty(getEl('details'))
  empty(getEl('searchResults'))
}

function showMessage(msg){
  Update(searchArea, msg);
}

function show(el){
  if(!el.classList.contains('shown')){
    el.classList.add('shown');
  }
  if(el.classList.contains('hidden')){
    el.classList.remove('hidden');
  }
}
function hide(el){
  if(el.classList.contains('shown')){
    el.classList.remove('shown');
  }
  if(!el.classList.contains('hidden')){
    el.classList.add('hidden');
  }
}

function empty(el){
  el.innerHTML = ''
}

function search(term){
  home()
  MDBReq(SEARCH, LoadResults, {
    'query' : term,
    'page' : 1,
    'language' : AppPreferences.getLang(),
    'include_adult' : AppPreferences.includeAdult
  });
  page = 1;
}

function checkForSearch(ele) {
  if (event.key === 'Enter') {
    search(ele.value)
  }
}

function latest(){
  home()
  MDBReq(DISCOVER, LoadResults, {
    'language' : AppPreferences.getLang(),
    'include_adult' : AppPreferences.includeAdult,
    'release_date.lte' : getDate(),
    'page' : 1,
    'sort_by' : 'release_date.desc'
  })
  page = 1;
}

function popular(){
  home()
  MDBReq(DISCOVER, LoadResults, {
    'language' : AppPreferences.getLang(),
    'include_adult' : AppPreferences.includeAdult,
    'release_date.lte' : getDate(),
    'page' : 1,
    'sort_by' : 'popularity.desc'
  })
  page = 1;
}

function LoadResults(resp){
  details.hidden = true;
  searchBody.hidden = false;
  page = resp.page;
  totalPages = resp.total_pages;
  let aMovie = '',movies = [], html='';
  if(resp.results.length>1){
    for(let result of resp.results){
      aMovie = new Movie(result);
      movies.push(aMovie);
      html += aMovie.makeCard();
    }
    Update(searchArea, html);
    console.log(resp);
  }else{
    showMessage("No results found");
  }
  return movies;
}

function navigatePage(dir){
  let newPage = page + dir;
  if(!(newPage<1 || newPage>totalPages)){
    page = newPage
    let req = HISTORY;
    req.filters['page'] = page;
    MDBReq(req.baseURL, req.successMethod, req.filters);
  }
}

function LoadDetailed(id){
  MDBReq(DETAILS(id), DetailResult)
}

function DetailResult(data){
  details.hidden = false;
  searchBody.hidden = true;
  let movie = new Movie(data);
  let html = movie.GetDetailed();
  detailedPageMovie = movie;
  Update(details, html);
  GetTorrents();
  movie.MakeReviewSection()
  movie.MakeRecomendationSection()
}

function AddReviews(data){
  let html = '<h3>Reviews</h3>';
  if(data.results.length == 0){html += '<strong>no reviews</strong>'}
  for(let aReview of data.results){
    html += new Review(aReview).formatReview();
  }
  Update(getEl('reviews'), html)
}

function AddRecomendations(data){
  let html = '<h3>Similar movies</h3>'
  for(aMovie of data.results){
    html += new Movie(aMovie).makeCard();
  }
  Update(Recommendations, html)
}

function SearchGenre(id){
  home()
  MDBReq(DISCOVER, LoadResults, {
    'language' : AppPreferences.getLang(),
    'include_adult' : AppPreferences.includeAdult,
    'release_date.lte' : getDate(),
    'page' : 1,
    'with_genres' : id
  })
  page = 1;
}

function GetGenres(){
  var baseURL = 'https://api.themoviedb.org/3/genre/movie/list';
  MDBReq(baseURL, ShowGenres, {
    'language' : AppPreferences.getLang()
  })
}

function makeGenreLink(genre){
  return `<a id='${genre.id}' class='genreLink' onclick='SearchGenre(${genre.id})' href='#'>${genre.name}</a>`
}

function ShowGenres(data){
  let html = '';
  for(let aGenre of data.genres){
    html += makeGenreLink(aGenre);
  }
  Update(getEl('GenreSelect'), html);
}

function GetTorrents(data){
  let loadGif = getEl('torrentLoad')
  let linkSelect = getEl('linkSelect')
  let errorMsg = getEl('torrentError')
  if(!data){
    show(loadGif);
    hide(linkSelect);
    hide(errorMsg);
    var baseURL = 'https://mdbscrap.herokuapp.com/'
    SendReq(baseURL, GetTorrents, {
      'url' : new Torrent(getEl('quality').value, AppPreferences.downloadSite, {'original_title' : detailedPageMovie.title, 'release_date': detailedPageMovie.releaseDate}).URL,
      'site' : AppPreferences.downloadSite
    })
  }else{
    console.log(data);
    if(data.length > 0){
      let options = ''
      for(let aTorrent of data){
        options += `<option value=${aTorrent.link}>${aTorrent.title}</option>`
      }
      Update(getEl('selector'), options);
      hide(loadGif);
      show(linkSelect);
    }else{
      hide(loadGif);
      show(errorMsg);
    }


  }

}

function RunTorrent(){
  magnet = getEl('selector').value;
  window.location.href = magnet;
  console.log(magnet);
}
GetGenres();
