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
  if (el){
    el.innerHTML = content;
  }
}

function Append(el, content){
  el.insertAdjacentHTML('beforeend', content);
}

function home(){
  theRouter.Move('Home')
  Clear()
}

function Clear(){
  page = 1;
  hide(getEl('preferencesMenu'))
  empty(getEl('details'))
  empty(getEl('searchResults'))
  //hide(getEl('navBarContainer'))
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

function Scroll(x,y){
  window.scroll({
      top:x,
      bottom:y,
      behavior: 'smooth'
    })
}
function search(term){
  Clear()
  if(term.trim() != ''){
    MDBReq(SEARCH, LoadResults, {
      'query' : term,
      'page' : 1,
      'language' : AppPreferences.getLang(),
      'include_adult' : AppPreferences.includeAdult
    });
    page = 1;
  }
}

function checkForSearch(ele) {
  if (event.key === 'Enter') {
    theRouter.Move('Search/'+ele.value)
  }
}

function updateFontSize(input){
  let text = input.value;
  let charCount = text.length;
  let fontSize = input.style.fontSize;
  let searchBarSize = input.offsetWidth;
  let newFontSize = fontSize
  while((charCount*fontSize) > searchBarSize){
    newFontSize --;
  }
  input.style.fontSize = newFontSize;
}

function Discover(preset){
  Clear()
  let params;
  if(preset.includes('?') && preset.includes('Custom')){
    //Must use "" in JSON, template= URL/#Discover/Custom?{}
    params = JSON.parse(decodeURI(preset.split('?')[1]))
  }else{
    switch(preset){
      case "Theatres":
        params = {
          'with_release_type' : '2|3',
          'release_date.gte' : getDate(),
          'release_date.lte' : getDate(30),
        }
        break;

      case "Popular":
        params = {
          'sort_by' : 'popularity.desc'
        }
        break;

      case "Latest":
        params = {
          'release_date.lte' : getDate(),
          'sort_by' : 'release_date.desc'
        }
        break;

      case "Old":
        params = {
          'sort_by' : 'release_date.asc'
        }
        break;

      default:
        console.error("please provide a discover preset or custom");
        break;
    }
  }

  if(params){
    MDBReq(DISCOVER, LoadResults, {
      ...params,
      'language' : AppPreferences.getLang(),
      'include_adult' : AppPreferences.includeAdult,
      'page' : page
    })
  }
}

function scrollIsNearBottom(){
  return $(window).scrollTop() + $(window).height() > $(document).height() - 400 && !$('searchBody').hidden;
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
        if(timer) {
      		window.clearTimeout(timer);
      	}

      	timer = window.setTimeout(function() {
          checkForScrollBtn()
          if(scrollIsNearBottom()) {
      		    loadMore()
          }
      	}, 250);
    });
  }else{
    showMessage("No results found");
  }
  searchBody.hidden = false;
  return movies;
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

function checkForScrollBtn(){
  let quickBar = getEl('quickBar');
  let scrollBtn = getEl('backToTop')
  if(isInViewport(quickBar)){
    hide(scrollBtn);
  }else{
    show(scrollBtn)
  }
}

function isInViewport (elem) {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

function infinateLoad(resp){
  let aMovie = '',movies = [], html='';
  if(resp.results.length>1){
    for(let result of resp.results){
      aMovie = new Movie(result);
      movies.push(aMovie);
      html += aMovie.makeCard();
    }
    Append(searchArea, html);
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
  Clear()
  MDBReq(DISCOVER, LoadResults, {
    'language' : AppPreferences.getLang(),
    'include_adult' : AppPreferences.includeAdult,
    'release_date.lte' : getDate(),
    'page' : 1,
    'with_genres' : id
  })
}

function GetGenres(){
  var baseURL = 'https://api.themoviedb.org/3/genre/movie/list';
  MDBReq(baseURL, ShowGenres, {
    'language' : AppPreferences.getLang()
  })
}

function makeGenreLink(genre){
  return `<a id='${genre.id}' class='genreLink' href='#Genre/${genre.id}'>${genre.name}</a>`
}

function ShowGenres(data){
  let html = '';
  for(let aGenre of data.genres){
    html += makeGenreLink(aGenre);
  }
  Update(getEl('GenreSelect'), html);
}

GetGenres();
