var searchArea = getEl('searchResults');
var searchBody = getEl('searchBody');
var details = getEl('details');
var page, totalPages, detailedPageMovie;


var AppPreferences = new Preferences();

MDBReq('https://api.themoviedb.org/3/configuration/languages', AppPreferences.saveLanguages.bind(AppPreferences), {});

MDBReq('https://api.themoviedb.org/3/configuration/countries', AppPreferences.saveCountries.bind(AppPreferences), {});



function showPreferenceMenu(){
  getEl('preferencesMenu').classList.toggle('hidden');
}

function getEl(id){
  return document.getElementById(id);
}

function Update(el, content){
  el.innerHTML = content;
}

function Append(el, content){
  el.insertAdjacentHTML('beforeend', content);
}

function home(){
  hide(getEl('preferencesMenu'))
  empty(getEl('details'))
  empty(getEl('searchResults'))
  hide(getEl('navBarContainer'))
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

function updateFontSize(input){
  let text = input.value;
  let charCount = text.length;
  let fontSize = input.style.fontSize;
  let searchBarSize = input.offsetWidth;
  let newFontSize = fontSize
  console.log(fontSize, charCount)
  console.log('charLen: ', (charCount*fontSize), 'SB SIZE: ', searchBarSize)
  while((charCount*fontSize) > searchBarSize){
    newFontSize --;
  }
  input.style.fontSize = newFontSize;
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
  page = resp.page;
  totalPages = resp.total_pages;
  let aMovie = '',movies = [], html='';
  if(resp.results.length>0){
    for(let result of resp.results){
      aMovie = new Movie(result);
      movies.push(aMovie);
      html += aMovie.makeCard();
    }
    Update(searchArea, html);
    var timer;
    $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() > $(document).height() - 400) {
        if(timer) {
      		window.clearTimeout(timer);
      	}

      	timer = window.setTimeout(function() {
      		loadMore()
      	}, 100);

      }
    });
  }else{
    showMessage("No results found");
  }
  searchBody.hidden = false;
  return movies;
}

function infinateLoad(resp){
  console.log(resp)
  let aMovie = '',movies = [], html='';
  if(resp.results.length>1){
    for(let result of resp.results){
      aMovie = new Movie(result);
      movies.push(aMovie);
      html += aMovie.makeCard();
    }
    Append(searchArea, html);
   // console.log(resp);
  }
}
function loadMore(){
  let newPage = page + 1;
  if(!(newPage<1 || newPage>totalPages)){
    page = newPage
    let req = HISTORY;
    req.filters['page'] = page;
    MDBReq(req.baseURL, infinateLoad, req.filters,false);
  }
}

function LoadDetailed(id){
  MDBReq(DETAILS(id), DetailResult, {'append_to_response': 'release_dates'})
}

function DetailResult(data){
  searchBody.hidden = true;
  let movie = new Movie(data);
  let html = movie.GetDetailed();
  detailedPageMovie = movie;
  Update(details, html);
  Torrent.GetTorrents();
  movie.MakeReviewSection()
  movie.MakeRecomendationSection()
  details.hidden = false;
}

function AddReviews(data){
  let html = '<summary>Reviews</summary><div class="detailContents">';
  if(data.results.length == 0){html += '<strong>no reviews</strong>'}
  for(let aReview of data.results){
    html += new Review(aReview).formatReview();
  }
  html += '</div>'
  Update(getEl('reviews'), html)
}

function AddRecomendations(data){
  let html = '<summary>Similar movies</summary><div class="detailContents">'
  for(aMovie of data.results){
    html += new Movie(aMovie).makeCard();
  }
  html += '</div>'
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

function hideLazyLoads(el){
  let LazyLoads = document.getElementsByClassName('movie')
  getEl(el.parentNode.id+'_LL').outerHTML = '';
}

GetGenres();
