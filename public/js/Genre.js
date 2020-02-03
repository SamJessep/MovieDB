class Genre{
  constructor(id, name,type){
      this.type = type;
      this.id = id;
      this.name = name;
  }

  makeLink(){
    return `<a id='${this.id}' class='genreLink' href='#Genre/${this.type}/${this.id}'>${this.name}</a>`;
  }
}
