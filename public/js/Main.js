//console.log(Preferences.fetchData());
let savedPreferences = Preferences.fetchData();
let preferencesObject = new Preferences()
var REQUEST_TOKEN = getParameterByName('request_token');
var SESSION_ID;
if(savedPreferences){
  Preferences.LoadData(preferencesObject,savedPreferences)
}
const app = new App(preferencesObject);
let btn = $('#loginButton')[0];

if(getParameterByName('approved') == 'true' && REQUEST_TOKEN){
  //Try get User data;
  if(getCookie('MDB_SID')){
    Account.AddUser(getCookie('MDB_SID'));
  }else{
    Account.GetSessionID(REQUEST_TOKEN);
  }
  console.log('logged in')
  preferencesObject.Session_token = REQUEST_TOKEN;
  //preferencesObject.savePreferences();
  btn.innerText = "Logout"
  btn.onclick = Account.CloseSession;
}else{
  //btn.innerText = 'Login';
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
