import Home from './routes/Home.svelte'
import Search from './routes/Search.svelte'
import GenreSearch from './routes/GenreSearch.svelte'
import Discover from './routes/Discover.svelte'
import Watchlist from './routes/Watchlist.svelte'
import NotFound from './routes/NotFound.svelte'
import AdvancedSearch from './routes/AdvancedSearch.svelte'
import Detail from './routes/Detail.svelte'
import Trending from './routes/Trending.svelte'

const routes =  new Map()
routes.set('/', Home)
routes.set(/^\/Search\/(?<mediatype>(?:movie|multi|tv))?\/?(?<query>[^\/]*)\/?(?<page>\d+)?$/, Search)
routes.set('/genre/:media_type/:genre_id/:page?', GenreSearch)
routes.set('/discover/:media_type/:discoverType/:page?*', Discover)
routes.set('/trending/:media_type/:page?*', Trending)
routes.set('/advancedSearch/', AdvancedSearch)
routes.set('/:User/:media_type/Watchlist/:page?', Watchlist)
routes.set('/:media_type/:id', Detail)
routes.set('*', NotFound)
export default routes
