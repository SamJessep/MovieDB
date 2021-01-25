import Home from './components/routes/Home.svelte'
import Search from './components/routes/Search.svelte'
import GenreSearch from './components/routes/GenreSearch.svelte'
import Discover from './components/routes/Discover.svelte'
import Watchlist from './components/routes/Watchlist.svelte'
import NotFound from './components/routes/NotFound.svelte'

const routes = {
    // Exact path
    '/': Home,

    // Using named parameters, with last being optional
    '/search/:query': Search,
    '/genre/:media_type/:genre_id': GenreSearch,
    '/discover/:discoverType?*': Discover,
    '/:User/Watchlist': Watchlist,
    // Catch-all
    // This is optional, but if present it must be the last
    '*': NotFound,
}
export default routes
