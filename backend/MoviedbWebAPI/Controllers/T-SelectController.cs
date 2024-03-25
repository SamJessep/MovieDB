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
    [Route("api/tAccess")]
    [ApiController]
    public class TorrentSelectController : ControllerBase
    {
        private readonly ILogger<WatchProvidersController> _logger;
        private List<string> torrent_whitelist = new List<string>()
        {
            "srj0070"
        };
        public TorrentSelectController(ILogger<WatchProvidersController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public string Get(string username)
        {
            username = System.Uri.UnescapeDataString(username);
            var a = $"https://{Request.Host}/api/dl/links";
            if(!torrent_whitelist.Contains(username)) a = "";
            return a;
        }

    }
}
