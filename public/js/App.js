class App{
  constructor(){
    this.page = 1;
    this.totalPages = 0;
    this.preferences = new Preferences();

    this.discoverParams = {
      "Theatres":{
        'with_release_type' : '2|3',
        'release_date.gte' : getDate(),
        'release_date.lte' : getDate(30)
      },
      "Popular" : {
        'sort_by' : 'popularity.desc'
      },
      "Latest" : {
        'release_date.lte' : getDate(),
        'sort_by' : 'release_date.desc'
      },
      "Old" : {
        'sort_by' : 'release_date.asc'
      }
    }
    //Saved elements
    this.SearchArea = this.getEl('searchResults');
    this.DetailPage = this.getEl('details');
    this.PreferencesMenu = this.getEl('preferencesMenu');

    //Fetch UI data
    this.GetGenres();
  }

//---Basic-Utilities/Helper-Functions-------------------------------------------

  Update(el, content){
    if (el){
      el.innerHTML = content;
    }
  }

  Append(el, content){
    el.insertAdjacentHTML('beforeend', content);
  }

  Clear(){
    this.page = 1;
    this.hide(this.PreferencesMenu)
    this.Empty(this.SearchArea)
    this.Empty(this.DetailPage)
  }

  Empty(el){
    el.innerHTML = '';
  }

  Scroll(x,y){
    window.scroll({
        top:x,
        bottom:y,
        behavior: 'smooth'
      })
  }

  getEl(id){
    return document.getElementById(id);
  }

  showMessage(msg){
    this.Update(this.SearchArea, msg);
  }

  setVisability(el,visable){
    el.classList[visable?'add':'remove']('shown');
    el.classList[visable?'remove':'add']('hidden');
  }

  hide(el){this.setVisability(el,false)}
  show(el){this.setVisability(el, true)}

  scrollIsNearBottom(){
    return $(window).scrollTop() + $(window).height() > $(document).height() - 400 && !$('searchBody').hidden;
  }

  isInViewport(elem){
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
//---User-Actions---------------------------------------------------------------
Action(method,params){
  this.Clear()
  if(method) this[method]();
}

showPreferenceMenu(){
  this.PreferencesMenu.classList.toggle('hidden');
}

//HOME
home(){
  theRouter.Move('Home')
  this.Clear()
}

//SEARCH

Search(term){
  if(term.trim() != ''){
    MDBReq(SEARCH, this.LoadResults.bind(this), {
      'query' : term,
      'page' : 1,
      'language' : this.preferences.getLang(),
      'include_adult' : this.preferences.includeAdult
    });
    this.page = 1;
  }
}

checkForSearch(ele) {
  if (event.key === 'Enter') {
    theRouter.Move('Search/'+ele.value)
  }
}

//DISCOVER

Discover(hash){
  this.Clear()
  let params;
  if(this.discoverParams.hasOwnProperty(hash)){
    params = this.discoverParams[hash];
  }else if(hash.includes('?') && hash.includes('Custom')){
    params = this.GetCustomParams(params);
  }else{
    console.error("please provide a discover preset or custom");
    return;
  }
  MDBReq(DISCOVER, this.LoadResults.bind(this), {
    ...params,
    'language' : this.preferences.getLang(),
    'include_adult' : this.preferences.includeAdult,
    'page' : this.page
  })
}

GetCustomParams(params){
  return JSON.parse(decodeURI(preset.split('?')[1]));
}


LoadResults(data){
  let timer
  this.totalPages = data.total_pages;
  this.hide(this.DetailPage);
  this.page = data.page;
  if(data.results.length>0){
    this.Update(this.SearchArea, this.GetResultHTML(data.results));
    if(!$(window).scroll) timer = this.scrollEvent(timer,500);
  }
}

GetResultHTML(results){
  let html = '';
  for(let aResult of results){
      html += new Movie(aResult).makeCard();
  }
  return html;
}

scrollEvent(timer,milliseconds){
  if(timer) window.clearTimeout(timer);
  timer = window.setTimeout(function (){
    this.showScrollButton()
    if(this.scrollIsNearBottom()) this.loadMore();
  },milliseconds)
  return timer
}

loadMore(data){
  if(data){
    if(resp.results.length>1) Append(searchArea, this.GetResultHTML(data.results));
  }else if (this.page<this.totalPages) {
    this.page++;
    let req = HISTORY;
    req.filters['page'] = this.page;
    MDBReq(req.baseURL, this.loadMore, req.filters,false);
  }
}

showScrollButton(){
  let quickBar = getEl('quickBar');
  let scrollBtn = getEl('backToTop')
  this[isInViewport(quickBar)?'hide':'show'](scrollBtn);
}

//DETAILED

GetDetailedPage(id){
  MDBReq(DETAILS(id), this.DrawDetailedPage, {'append_to_response': 'release_dates'})
}

LoadDetailedPage(data){
  this.hide(this.SearchArea);
  let movie = new Movie(data);
  this.Update(this.DetailPage, movie.GetDetailed())
  this.show(this.DetailPage);
}

//GENRE SEARCH

SearchGenre(id){
  this.Clear()
  MDBReq(DISCOVER, this.LoadResults.bind(this), {
    'language' : this.preferences.getLang(),
    'include_adult' : this.preferences.includeAdult,
    'release_date.lte' : getDate(),
    'page' : 1,
    'with_genres' : id
  })
}

GetGenres(){
  var baseURL = 'https://api.themoviedb.org/3/genre/movie/list';
  MDBReq(baseURL, this.AddGenres.bind(this), {
    'language' : this.preferences.getLang()
  })
}

AddGenres(data){
  let html = ''
  for(let aGenre of data.genres){
    html += new Genre(aGenre.id, aGenre.name).makeLink();
  }
  this.Update(this.getEl('GenreSelect'), html);
}

}
