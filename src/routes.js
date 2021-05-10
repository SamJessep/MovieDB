import Home from './routes/Home.svelte'
import Search from './routes/Search.svelte'
import GenreSearch from './routes/GenreSearch.svelte'
import Discover from './routes/Discover.svelte'
import Watchlist from './routes/Watchlist.svelte'
import NotFound from './routes/NotFound.svelte'

const routes = {
    // Exact path
    '/': Home,

    // Using named parameters, with last being optional
    '/search/:query': Search,
    '/search/:media_type/:query': Search,
    '/genre/:media_type/:genre_id': GenreSearch,
    '/discover/:media_type/:discoverType?*': Discover,
    '/:User/:media_type/Watchlist': Watchlist,
    // Catch-all
    // This is optional, but if present it must be the last
    '*': NotFound,
}
export default routes
