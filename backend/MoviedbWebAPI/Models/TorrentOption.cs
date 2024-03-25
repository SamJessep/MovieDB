using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoviedbWebAPI.Models
{
    public class TorrentOption
    {
        public TorrentOption(string text, string value)
        {
            Text = text;
            Value = value;
        }
        public string Text { get; set; }
        public string Value { get; set; }
    }
}
