# MovieDB
Javascript Web app using
  - The Movie Database API: for movie data
  - Svelte framework for creating UI
  - NodeJs for backend services

## Tasks
  ### Major Features
  - [ ] implement toasts
  - [ ] Implement more preferences
    - [ ] preference tabs
  - [ ] Recreate details page
    - [x] add basic info, title, release date, runtime
    - [x] add related results
    - [x] add reviews
    - [x] Remake trailer feature. Maybe fetch from imdb to get more reliable trailers
    - [ ] download as torrent
    - [ ] streaming torrent functionality
    - [ ] watch trailer
    - [ ] add genres
  - [ ] Re-create backend services with nodejs
  ### Minor/Possible Features
  - [ ] Save preferences to mongo db
  - [ ] Implement movie Tinder ?
  - [ ] signup to recive notification when movie is available to download
  - [ ] Link to streaming platforms
  - [ ] Junk filter
      - [x]  only if results with posters
      - [ ]  only results with local releases
      - [ ]  only results below specific age rating
    - [ ] Color themes, Dark mode/Light mode

  ## Bug Fixes
  - [ ] Infinate loop when changing pages sometimes
  - [ ] Janky animation for sort element
  - [ ] Some performace issues on mobile
  - [x] Fix image sizing, some posters are different sizes and get stretched
  - [ ] Reloading a discover page resets the sort type
  - [ ] fix popup dialog
  - [ ] Add to fav button breaks nearly half the time
  
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
  - [x] Add advanced search to quick bar
    - [x] choose date range
    - [x] rating range
    - [x] select multiple genres
    - [x] select media type e.g. movie/tv/
  - [x] Revamp genre search
  - [x] Modified bottom bar for mobile