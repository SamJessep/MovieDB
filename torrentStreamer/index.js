const WebTorrent = require('webtorrent-hybrid');
const express = require('express');
const rimraf = require("rimraf");
const bodyParser = require('body-parser');
const RateLimiter = require('limiter').RateLimiter;


const TORRENTS_PATH = "./torrents"

var limiter = new RateLimiter(1,2000);
var client = new WebTorrent()
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get("/", (req, res)=>{
  res.status(200).send("home")
})
app.post('/requestWebTorrent', (req, res) => {
  console.log(client.files)
  let sentRes = false
  const magLink = req.query.magnet
  client.add(magLink,{path:TORRENTS_PATH}, (torrent)=> {
    var file = torrent.files.find((file)=> {
      return file.name.endsWith('.mp4')
    })
    if(file){
      console.log("found playable video", file.name)
      torrent.on('download', (bytes)=> {
        limiter.removeTokens(1, (err, remainingRequests)=> {
          console.log("downloading...", file.downloaded+"/"+file.length, Math.floor(file.progress*100)+"%")
        });
        if(torrent.ready && !sentRes){
          res.status(200).send({
            message: "torrent ready"
          })
          sentRes = true
        }
      })
      torrent.on('upload', function (bytes) {
        limiter.removeTokens(1, (err, remainingRequests)=> {
          console.log("seeding: ",bytes)
        });
      })
    }else{
      client.remove(magLink)
      rimraf(torrent.path+"/"+torrent.name, ()=> {
        res.status(400).send({
          message: "playable video file, server torrent seed has been stopped, try another link"
        })
      });
    }
  })
})

app.get('/stream', (req, res) => {
  let sentRes = false
  console.log(req.query)
  const magLink = req.query.magnet
  client.add(magLink,{path:TORRENTS_PATH}, (torrent)=> {
    var torrentFile = torrent.files.find((file)=> {
      return file.name.endsWith('.mp4')
    })
    if(torrentFile){
      const fileSize = torrentFile.length
      const range = req.headers.range
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
          ? parseInt(parts[1], 10)
          : fileSize-1
        const chunksize = (end-start)+1
        const file = torrentFile.createReadStream({start, end})
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        }
        console.log("6", head)
        res.writeHead(206, head);
        file.pipe(res);
      }else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        }
        console.log("5", head)
        res.writeHead(200, head)
        torrentFile.createReadStream().pipe(res)
      }
    }else{
      client.remove(magLink)
      rimraf(torrent.path+"/"+torrent.name, ()=> {
        res.status(400).send({
          message: "playable video file, server torrent seed has been stopped, try another link"
        })
      });
    }
  })
})

app.listen(8181)
console.log("listening on http://localhost:8181")
