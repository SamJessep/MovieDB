class Result{
    constructor(data){
      this.allData = data;
    }

    makeCard(){
      let poster;
      return `
      <button class="card movie" id=${this.id} onclick='theRouter.Move("Details/${this.id}")' tabindex='0'>
        ${poster}
          <h1 class="card-title hidden">${this.title}</h1>
      </button>`;
    }
}
