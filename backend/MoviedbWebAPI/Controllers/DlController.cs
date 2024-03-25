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
using Newtonsoft.Json;
using System.Web;
using System.Text.Encodings.Web;

namespace MoviedbWebAPI.Controllers
{
    [EnableCors("cors-allow")]
    [Route("api/[controller]")]
    [ApiController]
    public class dlController : ControllerBase
    {
        private readonly ILogger<dlController> _logger;
        private List<string> torrent_whitelist = new List<string>()
        {
            "srj0070"
        };
        public dlController(ILogger<dlController> logger)
        {
            _logger = logger;
        }

        [EnableCors("cors-allow")]
        [Route("links")]
        [HttpGet]
        public async Task<List<TorrentOption>> GetLinks(string query)
        {
            List<TorrentOption> options = new List<TorrentOption>();
            var torrents = await LinkController.GetUrls(query);
            foreach (var torrent in torrents)
            {
                options.Add(torrent.ToOption());
            }

            return options;
        }

    }
}
