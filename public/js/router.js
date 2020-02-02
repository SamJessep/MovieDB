var theRouter;
class Router {
  constructor(hash){
    this.hash = hash;

    window.addEventListener("hashchange", this.Hashchange.bind(this));
  }

  Close(){
    window.removeEventListener("hashchange",)
  }

  Hashchange(){
    if(this.hash != window.location.hash){
      this.hash = window.location.hash;
      this.LoadPage();
    }
  }

  Move(hash, title){
    hash = hash!=''?'#'+hash:hash;
    if(!title) title = hash;
    this.hash = hash;
    window.location.hash = hash;
  }

  LoadPage(event){
    let title;
    if(this.hash.includes('/')){
      let pathParts = this.hash.split('#')[1].split('/');
      let action = pathParts[0];
      let query = pathParts[1];
      title = this[action](query);
    }
    else {
      app.home();
      title = 'Home';
    }
    document.title = 'MDB-'+title
  }

  Search(query){

    query = decodeURI(query);
    app.Action('Search', query);
    return "search: "+query;
  }

  Details(id){
    app.Action('GetDetailedPage',id)
    return 'MovieID:'+id;
  }

  Discover(query){
    app.Action('Discover',query)
    return query;
  }

  Genre(id){
    app.Action('SearchGenre', id);
    return 'Genre:'+app.getEl(id).innerText;
  }

  Home(){
    app.Home();
    return 'Home';
  }

}

window.onload = () => {
  let hash = window.location.hash;
  theRouter = new Router(hash);
  window.onpopstate = theRouter.LoadPage.bind(theRouter);
  if(hash){
    theRouter.LoadPage(hash.split('#')[1])
  }
}
