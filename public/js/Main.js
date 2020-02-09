//console.log(Preferences.fetchData());
let savedPreferences = Preferences.fetchData();
let preferencesObject = new Preferences()
if(savedPreferences){
  Preferences.LoadData(preferencesObject,savedPreferences)
}
const app = new App(preferencesObject);

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

function loginSuccess(data){
  console.log(data);
}
