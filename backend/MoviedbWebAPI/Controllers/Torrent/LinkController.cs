using AngleSharp;
using AngleSharp.Html.Dom;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MoviedbWebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace MoviedbWebAPI.Controllers
{
    [EnableCors("cors-allow")]
    [Route("api/[controller]")]
    [ApiController]
    public class LinkController : ControllerBase
    {
        public static readonly List<string> providerUrls = new List<string>()
        {
            "https://1337x.to/search/",
            "https://rarbg.to/torrents.php?search="
        };
        public enum LinkProvider
        {
            _1337x,
            _rarbg
        };

        [HttpGet]
        public async Task<List<Torrent>> GetAsync(string title, LinkProvider provider = LinkProvider._1337x)
        {
            return await GetUrls(title, provider);
        }

        public static async Task<List<Torrent>> GetUrls(string title, LinkProvider provider = LinkProvider._1337x)
        {
            var ctx = GetBrowsingContext();
            switch (provider)
            {
                case LinkProvider._1337x:
                    return await GetTorrentLinks1337xAsync(ctx, title);
                case LinkProvider._rarbg:
                    return await GetTorrentLinksRarbgAsync(ctx, title);
                default:
                    return await GetTorrentLinks1337xAsync(ctx, title);
            }
        }

        private static IBrowsingContext GetBrowsingContext()
        {
            var config = Configuration.Default.WithDefaultLoader();
            var context = BrowsingContext.New(config);
            return context;
        }

        private static async Task<List<Torrent>> GetTorrentLinks1337xAsync(IBrowsingContext context, string title)
        {
            var torrents = new List<Torrent>();
            var url = providerUrls[(int)LinkProvider._1337x] + Uri.EscapeUriString(title) + "/1/";
            var document = await context.OpenAsync(url);

            var linkSelector = "li>a[onclick=\"javascript: count(this);\"]";
            var resultsSelector = "td a";

            var results = document.QuerySelectorAll(resultsSelector);
            foreach(IHtmlAnchorElement resultAnchor in results)
            {
                if (resultAnchor.Href.StartsWith("https://1337x.to/torrent/"))
                {
                    if (torrents.Count > 4) break;
                    var torrentDocument = await context.OpenAsync(resultAnchor.Href);
                    var possibleAnchors = torrentDocument.QuerySelectorAll(linkSelector);
                    foreach (IHtmlAnchorElement link in possibleAnchors){
                        if (torrents.Count > 4) break;
                        if(link.TextContent == "Magnet Download")
                        {
                            torrents.Add(new Torrent(resultAnchor.TextContent, link.Href));
                        }
                    }
                }

            }
            return torrents;
        }
        private static async Task<List<Torrent>> GetTorrentLinksRarbgAsync(IBrowsingContext context, string title)
        {
            var torrents = new List<Torrent>();
            var url = providerUrls[(int)LinkProvider._rarbg] + HttpUtility.UrlEncode(title);
            var document = await context.OpenAsync(url);

            var resultsSelector = "body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > table.lista2t > tbody > tr td:nth-child(2) a:nth-child(1)";
            var linkSelector = "body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(1) > td.lista > a:nth-child(3)";

            var results = document.QuerySelectorAll(resultsSelector);
            foreach (IHtmlAnchorElement resultAnchor in results)
            {
                if (resultAnchor.Href.StartsWith("https://rarbg.to/torrent"))
                {
                    if (torrents.Count > 4) break;
                    var torrentDocument = await context.OpenAsync(resultAnchor.Href);
                    var possibleAnchors = torrentDocument.QuerySelectorAll(linkSelector);
                    foreach (IHtmlAnchorElement link in possibleAnchors)
                    {
                        if (torrents.Count > 4) break;
                        torrents.Add(new Torrent(resultAnchor.TextContent, link.Href));
                    }
                }

            }
            return torrents;
        }
    }
}
