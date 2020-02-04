class App{
  constructor(preferences){
    this.page = 1;
    this.totalPages = 0;
    this.preferences = preferences;
    this.loadedResult;

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
    this.SearchBar = this.getEl('search');
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

  Replace(el,content){
    if(el){
      el.outerHTML = content
    }
  }

  Append(el, content){
    el.insertAdjacentHTML('beforeend', content);
  }

  Clear(){
    CloseMenu()
    this.page = 1;
    this.hide(this.PreferencesMenu)
    this.Empty(this.SearchArea)
    this.Empty(this.DetailPage)
    this.Empty(app.getEl('suggestedResults'))
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

  isOnBottom(){
    return ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight);
  }
//---User-Actions---------------------------------------------------------------
Action(method,...params){
  this.Clear()
  if(method) this[method](...params);
}

//HOME
home(){
  this.SearchBar.value = '';
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
    this.Clear();
    theRouter.Move('Search/'+ele.value)
  }
}
getAutoCompleteItems(ele){
  console.log(ele.value)
  let term = ele.value
  if(term != ''){
    MDBReq(SEARCH, this.updateAutoComplete, {
      'query' : term,
      'page' : 1,
      'language' : this.preferences.getLang(),
      'include_adult' : this.preferences.includeAdult
    },false)
  }
}
updateAutoComplete(data){
  let list = app.getEl('suggestedResults');
  let items ='';
  for(let aResult of data.results){
    items += `<option value='${aResult.title || aResult.name}'>`
  }
  app.Update(list, items);
}
//DISCOVER

Discover(hash){
  let params;
  if(this.discoverParams.hasOwnProperty(hash)){
    params = this.discoverParams[hash];
  }else if(hash.includes('?') && hash.includes('Custom')){
    params = this.GetCustomParams(params);
  }else{
    console.error("please provide a discover preset or custom");
    return;
  }
  MDBReq(DISCOVER+'movie', this.LoadResults.bind(this), {
    ...params,
    'language' : this.preferences.getLang(),
    'include_adult' : this.preferences.includeAdult,
    'page' : this.page,
    'append_to_response': 'media_type'
  },true,'movie')
}

GetCustomParams(params){
  return JSON.parse(decodeURI(preset.split('?')[1]));
}


LoadResults(data,type){
  console.log(data);
  let timer
  this.totalPages = data.total_pages;
  this.hide(this.DetailPage);
  this.page = data.page;
  if(data.results.length>0){
    if(data.results.length == 1){
      theRouter.Move(`Details/${data.results[0].media_type}/${data.results[0].id}`)
    }else{
      this.Update(this.SearchArea, this.GetResultHTML(data.results,type));
      if(!$(window).scroll) timer = this.scrollEvent(timer,500);
    }
  }else{
    this.showMessage('No results found...')
  }
}

GetResultHTML(results,type){
  let html = '';
  for(let aResult of results){
    if(type && !aResult.media_type){
      aResult.media_type = type;
    }
    if(aResult.media_type == 'tv'){
      html += new TVshow(aResult).makeCard();
    }else if(aResult.media_type == 'movie'){
      html += new Movie(aResult).makeCard();
    }
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
    if(data.hasOwnProperty('results')){
      if(data.results.length>1){
        app.Append(this.SearchArea, this.GetResultHTML(data.results,'movie'));
      }
    }
  }else if (this.page<this.totalPages) {
    this.page++;
    let req = HISTORY;
    req.filters['page'] = this.page;
    MDBReq(req.baseURL, this.loadMore.bind(this), req.filters,false);
  }
}

showScrollButton(){
  let quickBar = app.getEl('quickBar');
  let scrollBtn = app.getEl('backToTop')
  this[app.isInViewport(quickBar)?'hide':'show'](scrollBtn);
}

//DETAILED

GetDetailedPage(type,id){
  MDBReq(DETAILS(type,id), this.LoadDetailedPage.bind(this), {'append_to_response': 'release_dates'},true, type)
}

LoadDetailedPage(data,type){
  let page;
  this.hide(this.SearchArea);
  if(type == 'tv'){
    this.loadedResult = page = new TVshow(data);
    page.makeDetailedPage()
  }else{
    this.loadedResult = page = new Movie(data);
    this.Update(this.DetailPage, page.makeDetailedPage())
  }
  this.loadedResult = page;
  if(type=='movie') page.LoadTorrents();
  this.show(this.DetailPage);
}

//GENRE SEARCH

SearchGenre(type,id){
  MDBReq(DISCOVER+type, this.LoadResults.bind(this), {
    'language' : this.preferences.getLang(),
    'include_adult' : this.preferences.includeAdult,
    'release_date.lte' : getDate(),
    'page' : 1,
    'with_genres' : id
  },true, type)
}

GetGenres(){
  var baseURL = 'https://api.themoviedb.org/3/genre/movie/list';
  MDBReq(baseURL, this.AddGenres.bind(this), {
    'language' : this.preferences.getLang()
  },false,'movie')
  baseURL = 'https://api.themoviedb.org/3/genre/tv/list';
  MDBReq(baseURL, this.AddGenres.bind(this), {
    'language' : this.preferences.getLang()
  },false,'tv')
}

AddGenres(data,type){
  let title = type == 'movie'?'Movie':'TV'
  let html, links = ''
  for(let aGenre of data.genres){
    links += new Genre(aGenre.id, aGenre.name,type).makeLink();
  }
  html = `
    <details>
      <summary>${title}</summary>
      ${links}
    </details>
  `
  this.Append(this.getEl('GenreSelect'), html);
}

}
