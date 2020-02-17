const express = require('express')
const path = require('path')
const {MongoClient} = require('mongodb');

var port = process.env.PORT || 5005;
let app = express()
let server = require('http').createServer(app);
app.use(express.static(__dirname + '/'));

//////////////BASE DE DONNEE////////////////
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://heroku_tzdttpft:<vinil75020>@ds131041.mlab.com:31041/heroku_tzdttpft", function (err, db) {
   
    db.collection('Persons', function (err, collection) {
        
        collection.insert({ id: 1, firstName: 'Steve', lastName: 'Jobs' });
        collection.insert({ id: 2, firstName: 'Bill', lastName: 'Gates' });
        collection.insert({ id: 3, firstName: 'James', lastName: 'Bond' });
        
        

        db.collection('Persons').count(function (err, count) {
            if (err) throw err;
            
            console.log('Total Rows: ' + count);
        });
    });
                
});

//////////////// ROUTES //////////////
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'random.html'));
});

server.listen(port);
