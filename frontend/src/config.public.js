export default{
  "BASE_URL":"https://api.themoviedb.org/3/",
  "BASE_URL_V4":"https://api.themoviedb.org/4/",
  "BASE_IMAGE_URL":"https://image.tmdb.org/t/p/",
  "DOTNET_API_URL": process.env.BACKEND_API_URL,
  "imageSizes":{
     "backdrop":[
        "w780",
        "w1280"
     ],
     "poster":[
        "w92",
        "w154",
        "w185",
        "w342",
        "w500",
        "w780"
     ],
     "still":[
        "w92",
        "w185",
        "w300"
     ],
     "logo":[
        "w45",
        "w92",
        "w154",
        "w185",
        "w300",
        "w500"
     ],
     "profile":[
        "w45",
        "w185",
        "h632"
     ]
  }
}