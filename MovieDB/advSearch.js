var AdvSearch = class{
  constructor(options){
    this.baseURL = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`
    this.endURL = `&page=${page}`
    this.sort_by= "" || options.sort_by
    this.include_adult= "" || options.include_adult
    this.include_video= "" || options.include_poster
    this.release_date_gte= "" || options.release_date_gte
    this.release_date_lte= "" || options.release_date_lte
    this.vote_average_gte= "" || options.vote_average_gte
    this.vote_average_lte= "" || options.vote_average_lte
    this.year= "" || options.year
    this.with_runtime_gte= "" || options.with_runtime_gte
    this.with_runtime_lte= "" || options.with_runtime_lte
    this.with_release_type= "" || options.with_release_type
    this.with_original_language= "" || options.with_original_language
  }
  
  makeUrl(){
    this.endURL = `&page=${page}`
    for(let attribute in this){
      if(this.hasOwnProperty(attribute)){
        this.endURL += this.formatUrlPart(this,attribute)
      }
    }
    return this.baseURL+this.endURL
  }
  
  formatUrlPart(theClass, attribute){
    if(theClass[attribute]==='' || attribute == 'baseURL' || attribute == 'endURL'){
      return ''
    }
    return `&${attribute}=${theClass[attribute]}`
  }
}


