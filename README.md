# MovieDB
Javascript Web app using
  - The Movie Database API: for movie data
  - Svelte framework for creating UI
  - NodeJs for backend services

## Tasks
  ### Major Features
  - [ ] Add advanced search to quick bar
    - [ ] choose date range
    - [ ] rating range
    - [ ] select multiple genres
    - [ ] select media type e.g. movie/tv/any
  - [ ] Revamp genre search
    - [ ] use tag input for genre select multiple
  - [ ] Implement more preferences
    - [ ] Junk filter
      - [x]  only if results with posters
      - [ ]  only results with local releases
      - [ ]  only results below specific age rating
    - [ ] Color themes, Dark mode/Light mode
  - [ ] Recreate details page
    - [ ] Remake trailer feature. Maybe fetch from imdb to get more reliable trailers
  - [ ] Re-create backend services with nodejs
  ### Minor/Possible Features
  - [ ] Save preferences to mongo db
  - [ ] Implement movie Tinder ?
  - [ ] signup to recive notification when movie is available to download
  - [ ] Link to streaming platforms

  ## Bug Fixes
  - [ ] Infinate loop when changing pages sometimes
  - [ ] Janky animation for sort element
  - [ ] Some performace issues on mobile
  - [ ] Fix image sizing, some posters are different sizes and get stretched
  
  ### Done
  - [x] Sort results 
  - [x] Import search feature
  - [x] Implement setting section
  - [x] Implement account login via TMDb
  - [x] Setup some kind or router 
  - [x] Save a copy to local storage or cookies
  - [x] Implement some kind of pagination for going back combination of scroll to and reloading all past pages(like news sites).
  - [x] Redesign top bar, get new logo, add login & preferences section
  - [x] Auto select region if not set
  - [x] Add a user section w/ liked movies…
  - [x] Fix search algorithm & make sure its accurate
  - [x] Add user accounts
  - [x] Save movies to list