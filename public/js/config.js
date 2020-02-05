var configs = {
  'MDB_API_KEY' : '579872d8976e8f07d27624584808fee2',
  'YT_API_KEY' : 'AIzaSyBwdzAW5hpb-jtIKH5upVA58f53KUcBkg0',
  'imageSizes':{
    'posterSizes': [],
    'backdropSizes': [],
    'stillSizes': []
  }
}
let i = {
  "backdrop_sizes": [
    "w780",
    "w1280",
    "original"
  ],
  "poster_sizes": [
    "w92",
    "w154",
    "w185",
    "w342",
    "w500",
    "w780",
    "original"
  ],
  "still_sizes": [
    "w92",
    "w185",
    "w300",
    "original"
  ]
}

function addSizes(type, location, sizes){
  for(let aSize of sizes){
    if(aSize != "original"){
      let key = Number(aSize.split('w')[1]);
      configs.imageSizes[location].push({'type':type,'w':key, querySize:aSize});
    }
  }
}

addSizes('poster','posterSizes', i.poster_sizes);
addSizes('backdrop', 'backdropSizes', i.backdrop_sizes);
addSizes('still', 'stillSizes', i.still_sizes);
