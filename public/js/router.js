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
    this.hash = window.location.hash;
    this.LoadPage();
  }

  Move(hash, title){
    hash = hash!=''?'#'+hash:hash;
    if(!title) title = hash;
    this.hash = hash;
    window.location.hash = hash;
  }

  LoadPage(event){
    let title;
    console.log(this.hash)
    if(this.hash.includes('/')){
      let pathParts = this.hash.split('#')[1].split('/');
      let action = pathParts[0];
      let query = pathParts[1];
      title = this[action](query);
    }
    else {
      home();
      title = 'Home';
    }
    document.title = 'MDB-'+title
  }

  Search(query){
    query = decodeURI(query);
    search(query);
    return "search: "+query;
  }

  Details(id){
    LoadDetailed(id)
    return 'MovieID:'+id;
  }

  Discover(query){
    Discover(query)
    return query;
  }

  Genre(id){
    SearchGenre(id);
    return 'Genre:'+getEl(id).innerText;
  }

  Home(){
    home();
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


/*
function LoadPage(event){
  let hash = window.location.hash;
  let title;
  console.count(hash)
  if(hash.includes('/')){
    let pathParts = hash.split('#')[1].split('/');
    let action = pathParts[0];
    let query = pathParts[1];
    console.log(pathParts);
    switch(action){
      case 'Search':
        query = decodeURI(query);
        title = "search: "+query;
        search(query);
        break;
      case 'Details':
        title = 'MovieID:'+query;
        LoadDetailed(query)
        break;
      case 'Discover':
        title = query;
        Discover(query)
        break;
      case 'Genre':
        title = 'Genre:'+getEl(query).innerText;
        SearchGenre(query);
        break;
      default:
        home();
        title = 'Home';
        break;
    }
  }
  else {
    home();
    title = 'Home';
  }
  document.title = 'MDB-'+title
}
*/
