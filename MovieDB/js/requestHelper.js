//URLS
var SEARCH = 'https://api.themoviedb.org/3/search/movie';
var DISCOVER = 'https://api.themoviedb.org/3/discover/movie';
function DETAILS(id){
   return `https://api.themoviedb.org/3/movie/${id}`;
}
function IMAGE(id,size = 'w185_and_h278_bestv2'){
  return path = id ? `http://image.tmdb.org/t/p/${size}/${id}` : '../images/noPoster.jpg';
}
function SIMILAR(movie_id){
  return `https://api.themoviedb.org/3/movie/${movie_id}/similar`
}
function REVIEW(movie_id){
  return `https://api.themoviedb.org/3/movie/${movie_id}/reviews`
}
var HISTORY;

function MDBReq(baseURL, successMethod, filters){
  filters = {...filters, ...{'api_key': configs['MDB_API_KEY']}}
  HISTORY = {
    baseURL : baseURL,
    successMethod : successMethod,
    filters : filters
  }
  SendReq(baseURL, successMethod, filters);
  window.scrollTo(0, 0);
}


function SendReq(baseURL, successMethod, filters){
  let query = $.ajax({
    url: baseURL,
    type: 'GET',
    data: {
      ...filters
    },
    success: function(response){
      successMethod(response);
    },
    error: function(response){
      console.log(response);
    }
  })
}

function getDate(){
  var date  = new Date
  var month = date.getMonth()+1;
  var day = date.getDate().toString().length ==1 ? '0'+date.getDate() : date.getDate();
  month = month.toString().length == 1 ? '0'+ month : month;
  var fullDate =`${date.getFullYear()}-${month}-${day}`
  return fullDate
}
