class Preferences{
  constructor(){
    this.language = 'en'
    this.country = 'US'
    this.includeAdult = false;
    this.downloadSite = '1337x';
    this.possibleLanguages = [];
    this.possibleCountries = [];
    this.langSelect = getEl('lang')
    this.countrySelect = getEl('countries')
    this.adultSelect = getEl('adult')
    this.downloadSiteSelect = getEl('siteSelect');
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

  savePreferences(){
    this.language = this.langSelect.value
    this.country = this.countrySelect.value
    this.includeAdult = this.adultSelect.value == 'true'
    this.downloadSite = this.downloadSiteSelect.value;
    showPreferenceMenu()
  }
}
