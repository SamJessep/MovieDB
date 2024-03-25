using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoviedbWebAPI.Models
{
    public class Torrent
    {
        public Torrent(string title, string url)
        {
            Title = title;
            Url = url;
        }
        public string Title { get; set; }
        public string Url { get; set; }

        public TorrentOption ToOption(){
            return new TorrentOption(Title, Url);
        }
    }
}
