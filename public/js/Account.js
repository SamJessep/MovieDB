class Account{
  constructor(data){
    this.id = data.id;
    this.name = data.name;
    this.username = data.username

  }
  static OpenSession(){
    let URL = `https://api.themoviedb.org/3/authentication/token/new`
    let filters = {
      api_key: '579872d8976e8f07d27624584808fee2'
    }
    SendReq(URL, {'success':Account.AuthenticateUser}, filters)
  }

  static AuthenticateUser(data){
    let token = data.request_token;
    let URL = `https://www.themoviedb.org/authenticate/${token}?redirect_to=http://moviedb-77.netlify.com/`
    window.open(URL);
  }

  static CloseSession(){
    let URL = 'https://api.themoviedb.org/3/authentication/session?api_key=579872d8976e8f07d27624584808fee2'
    $.ajax({
      url: URL,
      type: 'DELETE',
      data: {
        session_id: REQUEST_TOKEN
      },
      success: function(response){
        let page = window.location.href.split('?')[0]+window.location.hash;
        window.location = page;
      },
      error: function(response){
        console.error(response)
      },
    })
  }
  static GetSessionID(){
    let URL = 'https://api.themoviedb.org/3/authentication/session/new?api_key='+configs['MDB_API_KEY']
    $.ajax({
      url: URL,
      type: 'POST',
      data: {
        request_token: REQUEST_TOKEN
      },
      success: function(response){
        Account.SetSessionCookie(response.session_id);
        app.SESSION_ID = response.session_id;
        Account.AddUser();
      },
      error: function(response){
        console.error(response)
      },
    })
  }

  static SetSessionCookie(id){
    var d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    document.cookie = `MDB_SID=${id}; expires=${d.toUTCString()}; path=/`;
  }

  static AddUser(key){
    let url = `https://api.themoviedb.org/3/account`;
    app.SESSION_ID = key;
    let filters = {
      api_key: configs['MDB_API_KEY'],
      session_id: key || app.SESSION_ID
    }
    SendReq(url, {success:Account.LoadUser}, filters)
  }

  static LoadUser(data){
    app.LoggedUser = new Account(data);
  }

  AddMovieToWatchList(id){
    let success = this.MovieAdded;
    let url = `https://api.themoviedb.org/3/account/${this.id}/watchlist?api_key=${configs['MDB_API_KEY']}&session_id=${app.SESSION_ID}`
    $.ajax({
      url: url,
      headers: {
        'Content-Type':'application/json;charset=utf-8'
      },
      method: 'POST',
      data:JSON.stringify({
        "media_type": "movie",
        "media_id": 11,
        "watchlist": true
      }),
      processData: false,
      success: function(response){
        success(response);
      },
      error: function(response){
        console.error(response)
      },
    })
  }

  MovieAdded(data){
    alert('movie Added to favourites')
  }
}
