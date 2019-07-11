var page = 1;
var searchTerm = formatTerm(searchBox.value)
var id = 100;
const apiKey = '579872d8976e8f07d27624584808fee2'
const YTapiKey = 'AIzaSyBwdzAW5hpb-jtIKH5upVA58f53KUcBkg0'

var  options = { 
                'sort_by' : "release_date.desc",
                'include_adult' : "false",
                'release_date_gte' : "",
                'release_date_lte' : "",
                'vote_average_gte' : "",
                'vote_average_lte' : "",
                'with_genres' : "",
                'with_keywords' : "",
                'year' : "",
                'with_runtime_gte' : "",
                'with_runtime_lte' : "",
                'with_release_type' : "",
                'with_original_language' : "",
              }

// REQUESTS 
var currentRequest
var currentUrl

var getDate = function(){
  var date  = new Date
  var fullDate =`${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}`

  return fullDate
}

var SEARCH = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}&page=${page}`
var DETAILS = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
var NEWEST = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=release_date.desc&include_adult=false&include_video=false&page=${page}&release_date.lte=${getDate()}&vote_count.gte=1&with_original_language=en`
var POPULAR = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&release_date.lte=${getDate()}&with_original_language=en&vote_count.gte=2&page=${page}`

var ADVANCED  = new AdvSearch(options).makeUrl()

var searchRequest = openXML('GET',SEARCH)
var detailsRequest = openXML('GET',DETAILS)
var newestRequest = openXML('GET',NEWEST)
var popularRequest = openXML('GET',POPULAR)
var advancedSearchRequest = openXML('GET', ADVANCED)


var getDate = function(){
  var date  = new Date
  var fullDate =`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

  return fullDate
}




//Request onload events

searchRequest.onload = function () { 
  currentRequest = this
  let data = checkRequest(this)
  
  //check response is good
  if(data){
    loadSearchPage(data, searchRequest)
    console.log(data)
  }
  else{
    //responseFailed()
  }
}

advancedSearchRequest.onload = function () { 
  currentRequest = this
  let data = checkRequest(this)
  
  //check response is good
  if(data){
    processData(data.results)
    console.log(data)
  }
  else{
    //responseFailed()
  }
}

detailsRequest.onload = function () {  
  currentRequest = this
  let data = checkRequest(this)
  
  //check response is good
  if(data){
    loadDetailsPage(data)
    createVideoBox(data)
    document.title = 'Movie DB|'+data.original_title
    addTorrent(data)
    console.log(data)
  }
  else{
    //responseFailed()
  }
}

newestRequest.onload = function () {  
  currentRequest = this
  let data = checkRequest(this)
  
  //check response is good
  if(data){
    processData(data.results)
    console.log(data)
  }
  else{
    //responseFailed()
  }
}

popularRequest.onload = function () {  
  currentRequest = this
  let data = checkRequest(this)
  
  //check response is good
  if(data){
    processData(data.results)
    console.log(data)
  }
  else{
    //responseFailed()
  }  
}


var processData = function(movies) {
if(movies.length!=0){
  movies.forEach(movie => {
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

function checkRequest(XMLReq){
  var data = JSON.parse(XMLReq.response);
  // Check for error code from the request
  if (XMLReq.status >= 200 && XMLReq.status < 400) {
    return data
  }   
  else{
     // Do some error handling
     console.log('Error')
  }
}
  
  
//Makes XML request object
function openXML(reqType,Url){
   let request = new XMLHttpRequest();
   request.open(reqType, Url, true);
   
   return request
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