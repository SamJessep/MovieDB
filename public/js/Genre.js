class Genre{
  constructor(id, name){
      this.id = id;
      this.name = name;
  }

  makeLink(){
    return `<a id='${this.id}' class='genreLink' href='#Genre/${this.id}'>${this.name}</a>`;
  }
}
