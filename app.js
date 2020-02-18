const express = require('express')
const path = require('path')

var port = process.env.PORT || 5005;
let app = express()
let server = require('http').createServer(app);
app.use(express.static(__dirname + '/'));

//////////////BASE DE DONNEE////////////////
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://heroku_hntk9vw8:hka5cie9qfqfa7lithhtjphcft@ds251849.mlab.com:51849/heroku_hntk9vw8';      


//////////////// ROUTES //////////////
app.get('/', function(req, res) {
    console.log('tessssssssssssssssssssssssssssssssssssssssssssssssssssssssssst')
    res.sendFile(path.join(__dirname, 'random.html'));

    // Use connect method to connect to the Server
      MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Connection established to', url);
        var myobj = { name: "Company Inc", address: "Highway 37" };
        MongoClient.collection("Persons").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      }
    });
});

server.listen(port);
