//console.log(Preferences.fetchData());
let savedPreferences = Preferences.fetchData();
let preferencesObject = new Preferences()
if(savedPreferences){
  Preferences.LoadData(preferencesObject,savedPreferences)
}
const app = new App(preferencesObject);

window.addEventListener('scroll', throttle(infinateLoad, 500));
window.onscroll = function(ev) {
  if(app.isOnBottom()){
    app.loadMore();
  }
}
function infinateLoad(){
  app.showScrollButton()
  if(app.scrollIsNearBottom()){
    app.loadMore()
  }
}
