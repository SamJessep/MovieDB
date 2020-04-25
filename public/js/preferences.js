class Preferences{
  constructor(){
    this.language = 'en'
    this.country = 'US'
    this.includeAdult = false;
    this.downloadSite = '1337x';
    this.account = {
      username:'',
      password:''
    }
    this.possibleLanguages = [];
    this.possibleCountries = [];
    this.langSelect = document.getElementById('lang')
    this.countrySelect = document.getElementById('countries')
    this.adultSelect = document.getElementById('adult')
    this.downloadSiteSelect = document.getElementById('siteSelect');

    this.garbageFilters = {
      'vote_count.gte' : 50
    }

    //GET PREFERENCE DATA
    MDBReq('https://api.themoviedb.org/3/configuration/languages', this.saveLanguages.bind(this), {});

    MDBReq('https://api.themoviedb.org/3/configuration/countries', this.saveCountries.bind(this), {});
  }

  static fetchData(){
    let data = localStorage.getItem('preferences');
    if(data) data = JSON.parse(data);
    return data;
  }

  static LoadData(oldData, newData){
    return Object.assign(oldData,newData)
  }

  saveData(){
    var preferenceData = {
      language: this.language,
      country: this.country,
      includeAdult: this.includeAdult,
      downloadSite: this.downloadSite,
      account:this.account
    }
    localStorage.setItem('preferences', JSON.stringify(preferenceData));
  }


  getLang(){
    return this.language + '_' + this.country;
  }

  saveLanguages(data){
      this.possibleLanguages = data.sort(this.Comparator);
      this.addSelectOptions()
  }

  saveCountries(data){
    this.possibleCountries = data.sort(this.Comparator);
    this.addSelectOptions()
  }

 Comparator(a, b) {
    if (a['english_name'] < b['english_name']) return -1;
    if (a['english_name'] > b['english_name']) return 1;
    return 0;
  }

  addSelectOptions(){
    let langOptions = '', countryOptions = '', selected;
    for(let aLang of this.possibleLanguages){
      selected = aLang['iso_639_1'] == this.language ? 'selected' : '';
      langOptions += `<option value='${aLang['iso_639_1']}' ${selected}>${aLang['english_name']}</option>`
    }
    for(let aCountry of this.possibleCountries){
      selected = aCountry['iso_3166_1'] == this.country ? 'selected' : '';
      countryOptions += `<option value='${aCountry['iso_3166_1']}' ${selected}>${aCountry['english_name']}</option>`
    }
    this.langSelect.innerHTML = langOptions;
    this.countrySelect.innerHTML = countryOptions;
    this.adultSelect.innerHTML = `<option ${this.includeAdult == true ? 'selected' : ''} value='true'>Yes</option> <option ${this.includeAdult == false ? 'selected' : ''} value='false'>No</option>`;
    app.getEl('username').value = this.account['username']
    app.getEl('password').value = this.account['password']
    this.addDownloadSites()
  }

  addDownloadSites(){
    let sites = ['1337x', 'thepiratebay', 'rarbg'];
    let options = '';
    for(let aSite of sites){
      options += `<option value=${aSite}>${aSite}</option>`
    }
    this.downloadSiteSelect.innerHTML = options;
  }

  async tryValidateUser(username, password){
    let postUrl = app.PC_URL+"/validate_user"
    let postData = {
      username:username,
      password:password
    }
    return await $.post(postUrl, $.param(postData)).promise();
  }

  async savePreferences(){
    let username = app.getEl('username').value;
    let password = app.getEl('password').value;
    if(username != '' || password != ''){
      app.setLoading(app.getEl("preferencesMenu"), true);
      let validateUser = await this.tryValidateUser(username, password);
      app.setLoading(app.getEl("preferencesMenu"), false);
      if(!validateUser.success){
        alert(validateUser.message);
        app.getEl('username').value = ''
        app.getEl('password').value = ''
        return;
      }else{
        this.language = this.langSelect.value
        this.country = this.countrySelect.value
        this.includeAdult = this.adultSelect.value == 'true'
        this.downloadSite = this.downloadSiteSelect.value;
        this.account['username'] = username
        this.account['password'] = password
        this.saveData();
        app.hide(app.getEl('preferencesMenu'));
        theRouter.LoadPage()
      }
    }else{
      this.language = this.langSelect.value
      this.country = this.countrySelect.value
      this.includeAdult = this.adultSelect.value == 'true'
      this.downloadSite = this.downloadSiteSelect.value;
      this.saveData();
      app.hide(app.getEl('preferencesMenu'));
      theRouter.LoadPage()
      }
    }

}
