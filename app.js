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

    mongo.connect(url, {useNewUrlParser: true}, function(err, client) {
        if(err){
          console.log('err', err)
        }
        else{
            console.log("Connexion a la base reussi");
            const collection = client.db('heroku_hntk9vw8').collection('Persons');
            collection.insertOne({nom: "cohen", prenom: "nathan", mail: "manathane.test@test.com"}, function(err, o) {
                if(err){
                    console.log(err.message);
                    res.send({message: 'Erreur'});
                    client.close();
                }
                else{
                    console.log("1 inserer!!!!!!!!!!!!!!!!!");
                }
            })
        }
    });
});

server.listen(port);
