const express = require('express')
const path = require('path')
var bodyParser = require('body-parser')
var socketIO = require('socket.io');

var port = process.env.PORT || 5005;
let app = express()
let server = require('http').createServer(app);
var io = socketIO(server);

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/socket", express.static(path.join(__dirname + "/node_modules/socket.io-client/dist/")));

//////////////BASE DE DONNEE////////////////
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://heroku_hntk9vw8:hka5cie9qfqfa7lithhtjphcft@ds251849.mlab.com:51849/heroku_hntk9vw8';      


//////////////// ROUTES //////////////
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'random.html'));
});

app.post('/envoieProposition', function(req, res){
    // connexion a la base
    mongo.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
        if(err){
          console.log('err', err)
        }
        else{
            console.log("Connexion a la base reussi");
            const collection = client.db('heroku_hntk9vw8').collection('Persons');
            collection.insertOne({proposition: req.body.tabValeurs}, function(err, o) {
                if(err){
                    console.log(err.message);
                    res.send({message: 'Erreur'});
                    client.close();
                }
                else{
                    console.log("1 proposition inserer");
                    // Envoie la reponse
                    res.send({message: "Ok"});
                }
            });
        }
    });
});

app.post('/recupereProposition', function(req, res){
    // connexion a la base
    mongo.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
        if(err){
          console.log('err', err)
        }
        else{
            console.log("Connexion a la base reussi");
            const collection = client.db('heroku_hntk9vw8').collection('Persons');
            collection.find().toArray(function(err, o) {
                if(err){
                    console.log(err.message);
                    res.send({message: 'Erreur'});
                    client.close();
                }
                else{
                    console.log("Recuperation des propositions reussi");
                    // Envoie la reponse
                    res.send({propositions: o});
                }
            });
        }
    });
});


app.post('/supprimerToutesPropositions', function(req, res){
    // connexion a la base
    mongo.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
        if(err){
          console.log('err', err)
        }
        else{
            console.log("Connexion a la base reussi");
            const collection = client.db('heroku_hntk9vw8').collection('Persons');
            collection.drop(function(err, o) {
                if(err){
                    console.log(err.message);
                    res.send({message: 'Erreur'});
                    client.close();
                }
                else{
                    console.log("Suppression de toutes les propositions reussi");
                    // Envoie la reponse
                    res.send({propositions: o});
                }
            });
        }
    });
});


app.post('/supprimerUneProposition', function(req, res){
    console.log(req.body.propositionSupprimer)
    // connexion a la base
    mongo.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
        if(err){
          console.log('err', err)
        }
        else{
            console.log("Connexion a la base reussi");
            const collection = client.db('heroku_hntk9vw8').collection('Persons');
            collection.deleteOne({proposition: req.body.propositionSupprimer}, function(err, o) {
                if(err){
                    console.log(err.message);
                    res.send({message: 'Erreur'});
                    client.close();
                }
                else{
                    console.log("Suppression de la proposition reussi");
                    // Envoie la reponse
                    res.send({propositions: "succes"});
                }
            });
        }
    });
});


// Websocket
var tabConnection = [];
io.on('connection', function(socket){
    tabConnection.push(socket);
    console.log('tabConnection');

    socket.on('btnRandom', function(data){
        console.log('test btnRandom', data.randomEnCours)
        function countOccurences(tab){
            var result = {};
            tab.forEach(function(elem){
                if(elem in result){
                    result[elem] = ++result[elem];
                }
                else{
                    result[elem] = 1;
                }
            });
            occurenceTab = Object.keys(result).map(function(key) {
                return [key, result[key]];
              });
            //   envoie a tous les clients connecter le tableau des propositions traiter dans la fonction countOccurences
            io.emit('retourBtnRandom', {occurenceTab: occurenceTab});
        }
        countOccurences(data.randomEnCours)

    })
    
});


server.listen(port);
