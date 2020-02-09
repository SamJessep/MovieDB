//console.log(Preferences.fetchData());
let savedPreferences = Preferences.fetchData();
let preferencesObject = new Preferences()
let REQUEST_TOKEN = getParameterByName('request_token');
if(savedPreferences){
  Preferences.LoadData(preferencesObject,savedPreferences)
}
const app = new App(preferencesObject);
if(getParameterByName('approved') == 'true' && REQUEST_TOKEN){
  console.log('logged in')
  let btn = app.getEl('loginButton');
  btn.innerText = "Logout"
  btn.onclick = logout;
}

$('#search').on('input', function(){
  app.getAutoCompleteItems(this);
});
window.addEventListener("resize", app.SetImageSizes.bind(app));
window.addEventListener('scroll', throttle(infinateLoad, 500));
window.onscroll = function(ev) {
  app.showScrollButton()
  if(app.isOnBottom() && app.getEl('details').classList.contains('hidden')){
    app.loadMore();
  }
}
function infinateLoad(){
  if(app.scrollIsNearBottom() && app.getEl('details').classList.contains('hidden')){
    app.loadMore()
  }
}

function getKey(){
  let URL = `https://api.themoviedb.org/3/authentication/token/new`
  let filters = {
    api_key: '579872d8976e8f07d27624584808fee2'
  }
  SendReq(URL, {'success':login}, filters)
}

function login(data){
  let token = data.request_token;
  let URL = `https://www.themoviedb.org/authenticate/${token}?redirect_to=http://moviedb-77.netlify.com/`
  window.open(URL);
}

function logout(){
  let URL = 'https://api.themoviedb.org/3/authentication/session?api_key=579872d8976e8f07d27624584808fee2'
  $.ajax({
    url: URL,
    type: 'DELETE',
    data: {
      session_id: REQUEST_TOKEN
    },
    success: function(response){
      window.location.reload()
    },
    error: function(response){
      console.error(response)
    },
  })
}
