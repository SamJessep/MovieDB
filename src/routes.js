import Home from './routes/Home.svelte'
import Search from './routes/Search.svelte'
import GenreSearch from './routes/GenreSearch.svelte'
import Discover from './routes/Discover.svelte'
import Watchlist from './routes/Watchlist.svelte'
import NotFound from './routes/NotFound.svelte'

const routes =  new Map()
routes.set('/', Home)
routes.set(/^\/Search\/(?<mediatype>(?:movie|multi|tv))?\/?(?<query>[^\/]*)\/?(?<page>\d+)?$/, Search)
routes.set('/genre/:media_type/:genre_id/:page?', GenreSearch)
routes.set('/discover/:media_type/:discoverType/:page?*', Discover)
routes.set('/:User/:media_type/Watchlist/:page?', Watchlist)
routes.set('*', NotFound)
export default routes
