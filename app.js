const express = require('express')
const path = require('path')

var port = process.env.PORT || 5005;
let app = express()
let server = require('http').createServer(app);
app.use(express.static(__dirname + '/'));

//////////////BASE DE DONNEE////////////////

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.

//(Focus on This Variable)
var url = 'mongodb://heroku_tzdttpft:vinil75020@ds131041.mlab.com:31041/heroku_tzdttpft';      
//(Focus on This Variable)

// Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
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

//////////////// ROUTES //////////////
app.get('/', function(req, res) {
    console.log('tessssssssssssssssssssssssssssssssssssssssssssssssssssssssssst')
    res.sendFile(path.join(__dirname, 'random.html'));
});

server.listen(port);
