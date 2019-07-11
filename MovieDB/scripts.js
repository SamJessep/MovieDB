const app = document.getElementById('root')
const searchBox = document.getElementById('searchBox')
const container = document.createElement('div');
container.setAttribute('class', 'container');
container.setAttribute('id', 'search-Area');
app.append(container);

//Loading Gif
let loadImage = document.createElement('img')
loadImage.id = 'load-image'
loadImage.src = 'loading.gif'
app.append(loadImage)
loadImage.style.visibility = 'hidden'


var page = 1;
//Utility functions 

function checkForEnter() {
  var enter = event.keyCode === 13 || event.which === 13
  if(document.activeElement.id === 'searchBox' && enter){
    search() 
  }
}

var clearPage = function () {  
	var page = document.getElementById("search-Area"); 	
  page.innerHTML = ''
  
  var pageArrows = document.getElementById('arrow-div')
  if(pageArrows){
    pageArrows.remove()
    window.scrollTo(0, 0);
  }
}

var clearSB = function () {
  let SB = document.getElementById('searchBox').value = ''
}

function formatTerm(term) {
  return term.trim().replace(' ', '+')
}

function formatTitle(title) {
  let str = title.replace('_', ' ')
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function checkLoading(){
  let img = document.getElementById('load-image')
   img.style.visibility = (container.innerHTML === '' ? 'visible' : 'hidden');
   
   if(document.getElementsByClassName('card')!= undefined){}
}

var action

// Create a request variable and assign a new XMLHttpRequest object to it.


// Open a new connection, using the GET request on the URL endpoint


function details(){
  clearPage()
  checkLoading()
  DETAILS = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
  currentUrl = DETAILS
  detailsRequest.open('GET', DETAILS, true);
  detailsRequest.send();
}

function search() {
  let searchTerm = formatTerm(searchBox.value)
  if(searchTerm !== ''){
    page = 1
    clearPage()
    checkLoading()
    SEARCH = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}&page=${page}`
    currentUrl = SEARCH
    searchRequest.open('GET', SEARCH, true);
    searchRequest.send();
  }
}

function advancedSearch() {
  page = 1
  clearPage()
  clearSB()
  checkLoading()
  options = getOptions()
  ADVANCED  = new AdvSearch(options).makeUrl()
  currentUrl = ADVANCED
  advancedSearchRequest.open('GET',ADVANCED, true);
  advancedSearchRequest.send()
}

function newest(){
  page = 1
  clearPage()
  clearSB()
  checkLoading()
  NEWEST = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=release_date.desc&include_adult=false&include_video=false&page=${page}&release_date.lte=${getDate()}&vote_count.gte=1&with_original_language=en`
  currentUrl = NEWEST
  newestRequest.open('GET', NEWEST, true);
  newestRequest.send();
}

function popular(){
  page = 1
  clearPage()
  clearSB()
  checkLoading()
  POPULAR = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&release_date.lte=${getDate()}&with_original_language=en&vote_count.gte=2&page=${page}`
  currentUrl = POPULAR
  popularRequest.open('GET', POPULAR, true);
  popularRequest.send();
}
function refreshRequest(){
  clearPage()
  //updatePage
  currentUrl = currentUrl = currentUrl.replace(/page=[0-9]+/, `page=${page}`);
  currentRequest.open('GET', currentUrl, true);
  currentRequest.send();
  
}

function detailsPage(movieId) {
  id = movieId
  details()
}

function getOptions(){
  let checkBoxes = document.getElementsByClassName('checkBox')
  for(let checkBox of checkBoxes){
    checkBox.setAttribute('value', checkBox.checked)
  }
  
  let options ={}
  let inputs = document.querySelectorAll('#dropDown select, #dropDown input')
  for(let i = 0; i<inputs.length;i++){
    options[inputs[i].id] = inputs[i].value
  }
  console.log(options)
  return options
}


function addTorrent(data) {
  var TorretSites = ['Pirate Bay', '1337x', 'rarbg']
  var qualities = ['720p', '1080p']
  
  let card = document.getElementById(data.id)
  let downloadSection = document.createElement('div')
  downloadSection.setAttribute('class', 'Download-section')
  let torrentDiv = document.createElement('div')
  let torrentTitle = document.createElement('h2')
  torrentTitle.textContent = 'Download section'
  
  let TorrentList = document.createElement('select')
  TorrentList.setAttribute('id', 'website');
  TorretSites.forEach(site => {
    let option = document.createElement('option')
    option.value = site
    option.innerHTML = site
    TorrentList.append(option)
  })
  console.log(TorrentList.value)
  
  let QualityList = document.createElement('select')
  QualityList.setAttribute('id', 'quality');
  qualities.forEach(site => {
    let option = document.createElement('option')
    option.value = site
    option.innerHTML = site
    QualityList.append(option)
  })
  console.log()
  
  let downloadBttn = document.createElement('button')
  downloadBttn.innerHTML = 'DOWNLOAD'
  
  downloadBttn.onclick = function( e ) {
        getTorrent(e, data);
    }
  
  torrentDiv.append(TorrentList)
  torrentDiv.append(QualityList)
  downloadSection.append(torrentTitle, torrentDiv, downloadBttn)
  card.append(downloadSection)  
}

function getTorrent(e, movie){
  let quality = document.getElementById('quality').value
  let website = document.getElementById('website').value
  var torrentTest = new Torrent(quality, website, movie)
  console.log(torrentTest)
  window.open(torrentTest.URL);
  
}

function loadSearchPage(data) {
  if(data.total_results !== 0){
    data.results.forEach(movie => {
      makeMovieCard(movie, 'search')
    })
    addPageArrows()
  }
  else{
    var page = document.getElementById("search-Area"); 	
    page.innerHTML = "<span id='error-message'>No Matching Results try somthing else...</span>"
    checkLoading()
  }
}


function makeMovieCard(movie, action){
  //Create card for each movie
  const card = document.createElement('div');
  card.setAttribute('class', 'card');
  card.setAttribute('id', movie.id);
  
  if(action === 'search'){
    card.setAttribute('onclick', `detailsPage(${movie.id})`);
  }
  //Create Movie Title/Heading
  const h1 = document.createElement('h1');
  h1.textContent = movie.original_title;
  
  //Set Poster image
  let mobile = window.matchMedia("(max-width: 975px)").matches
  const placeHolderImage = document.createElement('img');
  placeHolderImage.src = getPoster(movie,mobile,true)
  placeHolderImage.style.width = '185px'
  placeHolderImage.style.height = '278px'

  const poster = document.createElement('img');
  poster.src = getPoster(movie,mobile)
  poster.style.visibility = 'hidden'
  poster.onload = function() {
    poster.style.visibility = 'visible'
    //placeHolderImage.style.visibility = 'hidden'
    placeHolderImage.remove()
  }
  
  
  
  //make area to put trailer and poster
  let media = document.createElement('div')
  media.id = movie.id + ' media'
  media.setAttribute('class', 'media');
  media.append(placeHolderImage,poster)

  //set Description
  let desDiv = document.createElement('div')
  desDiv.setAttribute('id', 'description')
  let des = document.createElement('h2');
  if(action === 'details'){des.textContent = 'Description'}
  desDiv.append(des)
  var aboutFlex = document.createElement('div')
  aboutFlex.setAttribute('id', 'about-flex');
  const p = document.createElement('p');
  p.textContent = getDescription(movie, action)
  desDiv.append(p)
  
 

  //Commit all changes made to the DOM
  container.append(card);
  card.append(h1,media,aboutFlex);
  aboutFlex.append(desDiv);
  checkLoading()
  return  movie
}

function getPoster(movie, mobile, placeHolder) {
  //Set Poster Image
  if(movie.poster_path){
    if(placeHolder){
      return "http://image.tmdb.org/t/p/w45/"+movie.poster_path
    }
    if(mobile){
      return"http://image.tmdb.org/t/p/w185_and_h278_bestv2/"+movie.poster_path
    }
    return"http://image.tmdb.org/t/p/w342/"+movie.poster_path
  }
 return 'noPoster.jpg'
}


function getDescription(movie, action){
  //Add Description for each movie
  if ((movie.overview.length > 300) && (action === 'search')){
    movie.overview = movie.overview.substring(0, 300);
    return `${movie.overview}...`;  
  }
  else{return movie.overview }
}

function addPageArrows() {
  let arrowDiv = document.createElement('div')
  let arrowBack = document.createElement('p')
  let arrowForward = document.createElement('p')
  arrowDiv.setAttribute('id', 'arrow-div')
  
  arrowBack.innerHTML = 	'&larr;'
  arrowBack.setAttribute('onclick', `backPage()`);
    
  arrowForward.innerHTML = 	'&rarr;'
  arrowForward.setAttribute('onclick', `nextPage()`);
  arrowDiv.append(arrowBack, arrowForward)
  app.append(arrowDiv)
  
}

function nextPage(){
  page ++
  refreshRequest()
  checkLoading()
}
function backPage(){
  page --
  refreshRequest()
  checkLoading()
}


function loadDetailsPage(movie) {
  var data = makeMovieCard(movie, 'details')
  addAboutSection(data)
  document.getElementsByClassName('card')[0].scrollIntoView();
}

function addAboutSection(movie) {
  subHeadings = ['original_title', 'genres', 'original_language', 'release_date', 'runtime', 'status', 'production_companies', 'vote_average']
  
  var aboutFlex = document.getElementById('about-flex')
  var about = document.createElement('div')
  about.setAttribute('id', 'AboutSection');
  
  let det = document.createElement('h2');
  det.textContent = 'Details'
  about.append(det)
  subHeadings.forEach(function(element) {
    var subHeadingsData = movie[element];
    
    if(typeof(movie[element]) === 'object'){
      subHeadingsData = ''
      movie[element].forEach(function(obj) {
       subHeadingsData += obj.name + ', '
      })
      subHeadingsData = subHeadingsData.slice(0, -1)
    }
    
    let p = document.createElement('p')
    let title = formatTitle(element)
    p.textContent = `${title}: ${subHeadingsData}`
    about.append(p);
  });
  
  aboutFlex.append(about)
}

//Youtube Video API
//Used for Video trailers

function createVideoBox(movie) {
  //Make a area for Trailers to go
  //Also Centralized control for the trailers
  let card = document.getElementById(movie.id + ' media')
  let vidArea = document.createElement('div')
  vidArea.id = 'video-area'
  
  
  var mobile = window.matchMedia("(max-width: 810px)")
  mobile.addListener(videoPlayerLocation) // Attach listener function on state changes
  
  card.append(vidArea)
  videoPlayerLocation(mobile)
  getVideoID(movie.original_title, movie.release_date)
}

function videoPlayerLocation(mobile){
  
  if(action === 'details'){
    let el = document.getElementsByTagName('h2')
    if(mobile.matches){
      document.getElementsByClassName('card')[0].append(document.getElementById('video-area'))
      for (let i = 0; i< el.length; i++){
        el[i].style.paddingLeft = '0px'
      }  
    }
    else{
      for (let i = 0; i< el.length; i++){
        el[i].style.paddingLeft = window.getComputedStyle(document.getElementsByTagName('h2')[i].nextSibling, null).getPropertyValue('padding-left')
      }  
      
      document.getElementsByClassName('media')[0].append(document.getElementById('video-area'))
    }
  }
}

function getVideoID(title, release){
  var id;
  release = release.slice(0, 4);
  YTRequest = new XMLHttpRequest();
  YTRequest.open('GET',`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${formatTerm(title)+ ' ' +release+'Movie trailer'}&type=video&key=${YTapiKey}`);
  YTRequest.send() 
  
  YTRequest.onload = function () { 
    //Get video id
    //Send video id to Load YTPlayer function
    var data = JSON.parse(this.response);
    id = data.items[0].id.videoId
    loadYTPlayer(id)
  }
}


function loadYTPlayer(videoId) {
  //Uses video ID to get a trailer for details page
  //Uses YT iframe 
  let VideoArea = document.getElementById('video-area');
  VideoArea.innerHTML = `<iframe width="560" height="315" class='YTPlayer' src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  let title = document.createElement('h2')
  title.textContent = 'Trailer'
  VideoArea.prepend(title)
}