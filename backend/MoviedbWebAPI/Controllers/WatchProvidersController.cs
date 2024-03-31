using AngleSharp;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MoviedbWebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoviedbWebAPI.Controllers
{
    [EnableCors("cors-allow")]
    [Route("api/[controller]")]
    [ApiController]
    public class WatchProvidersController : ControllerBase
    {
        private readonly ILogger<WatchProvidersController> _logger;
        private List<string> torrent_whitelist = new List<string>()
        {
            "srj0070",
            ""
        };
        public WatchProvidersController(ILogger<WatchProvidersController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<List<WatchProvider>> GetAsync(string title, string url, string mediatype)
        {
            url = System.Uri.UnescapeDataString(url);
            title = System.Uri.UnescapeDataString(title);

            var config = Configuration.Default.WithDefaultLoader();
            var context = BrowsingContext.New(config);
            var document = await context.OpenAsync(url);
            var providertypesSelector = ".ott_provider";
            var providerContainers = document.QuerySelectorAll(providertypesSelector);
            var providers = new List<WatchProvider>();
            providerContainers.ToList().ForEach(container =>
            {
                string type = container.QuerySelector("h3").TextContent.ToLower();
                container.QuerySelectorAll("a").ToList().ForEach(link=> {
                    var aLink = (AngleSharp.Html.Dom.IHtmlAnchorElement)link;
                    var providerName = "unknown";
                    try{
                        providerName = aLink.Title.ToLower().Split(title.ToLower() + " on ")[1];
                    }catch{}

                    var wp = new WatchProvider
                    {
                        Name = providerName,
                        Url = aLink.Href,
                        Type = type
                    };
                    providers.Add(wp);
                });
            });
            return providers;
        }

    }
}
