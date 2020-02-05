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
  if(app.isOnBottom() && $('details').hidden){
    app.loadMore();
  }
}
function infinateLoad(){
  if(app.scrollIsNearBottom()){
    app.loadMore()
  }
}
