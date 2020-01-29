class Router {
  constructor(){

  }

}

window.onload = () => {
  let hash = window.location.hash;
  if(hash){
    LoadPage(hash.split('#')[1])
  }
}

window.addEventListener("hashchange", () => {
  const CurrentPath = window.location.hash
  //Move(hash)
  console.log(CurrentPath);
  if (CurrentPath === '#login') {
    // Display a login page (maybe using innerHTML)
  } else if (CurrentPath === '#register') {
    // Display a register page
  }
})


function Move(hash, title){
  hash = hash!=''?'#'+hash:hash;
  if(!title) title = hash;
  window.location.hash = hash;
  //window.history.pushState({}, title, hash)
}


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
        title = 'Genre:'+query;
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
window.onpopstate = LoadPage
