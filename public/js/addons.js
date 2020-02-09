var LazyLoadImg = new LazyLoad({
    elements_selector: ".lazy"
    // ... more custom settings?
});


/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function OpenMenu() {
  document.getElementById("GenreSelect").classList.toggle("show");
}

function CloseMenu(){
  app.getEl('GenreSelect').classList.remove('show')
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !app.getEl('GenreSelect').contains(event.target)) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
  if(!app.getEl('preferencesMenu').contains(event.target) && !event.target.matches('#preferences')){
    app.hide(app.getEl('preferencesMenu'))
  }
}

function throttle(fn, wait) {
  var time = Date.now();
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//
