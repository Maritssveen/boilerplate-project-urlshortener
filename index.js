require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require("dns");
let bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

function isValidHttpUrl(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)(www\\.)?([a-zA-Z0-9._-]+)\\.([a-zA-Z]{2,})(\\/.*)?$'
  );
  return pattern.test(str);
}

function isValidUrl(string, callback){
  try {
    const parsedUrl = new URL(string);
    dns.lookup(parsedUrl.hostname, (err) => {
      if (err) {
        console.log("Lookup: ", err)
        callback(false);
      } else {
        callback(true);
      }
    });
  } catch (e) {
    console.log("Try/catch: ", e);
    callback(false);
  }
}

let urls = [];

app.post("/api/shorturl", function(req, res){
  console.log(req.body.url);

  isValidUrl(req.body.url, (isValid) => {
    if (isValid){
      urls.push(req.body.url);
      let shorturl = urls.length;
      res.json({"original_url": req.body.url, "short_url": shorturl});
    } else {
      res.json({"error" : "invalid url"});
    }
  })
});

app.get("/api/shorturl/:shorturl", function(req, res){
  res.redirect(urls[req.params.shorturl - 1]);
});


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
