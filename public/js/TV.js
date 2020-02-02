class TV extends Result{
  constructor(data){
    super()
    this.id = data.id;
    this.title = data.name;
    this.about = data.overview;
    this.starRating = data.vote_average;
    this.rating;
    this.releaseDate = data.release_date;
    this.runTime = data.runtime;
    this.genres = data.genres || data.genre_ids;
    this.images = {
      poster: IMAGE(data.poster_path),
      backdrop: IMAGE(data.backdrop_path, 'w92')
    }
  }
}
