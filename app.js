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

    // clique sur le bouton random
    socket.on('btnRandomProposition', function(data){
        // recupere les propositions
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
                        var randomItem = o[Math.floor(Math.random()*o.length)].proposition; 
                        // envoie la proposition prise au hasard
                        io.emit('retourBtnRandomProposition', {randomItem: randomItem});
                        
                    }
                });
            }
        });
    })

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



    socket.on('envoieProposition', function(data){
        console.log("data.tabValeurs", data.tabValeurs)
        // connexion a la base
        mongo.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
            if(err){
            console.log('err', err)
            }
            else{
                console.log("Connexion a la base reussi");
                const collection = client.db('heroku_hntk9vw8').collection('Persons');
                collection.insertOne({proposition: data.tabValeurs}, function(err, o) {
                    if(err){
                        console.log(err.message);
                        io.emit('retourEnvoieProposition', {retourBtnRandom: "Erreur"});
                        client.close();
                    }
                    else{
                        console.log("1 proposition inserer");
                        // Envoie la reponse
                        io.emit('retourEnvoieProposition', {retourBtnRandom: "Succes"});
                    }
                });
            }
        });
    })

    socket.on('supprimerToutesPropositions', function(data){
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
                        io.emit('retourSupprimerToutesPropositions', {retourSupprimerToutesPropositions: "Erreur"});
                        client.close();
                    }
                    else{
                        console.log("Suppression de toutes les propositions reussi");
                        // Envoie la reponse
                        io.emit('retourSupprimerToutesPropositions', {retourSupprimerToutesPropositions: "Succes"});
                    }
                });
            }
        });
    })

    socket.on('supprimerUneProposition', function(data){
        // connexion a la base
        mongo.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
            if(err){
            console.log('err', err)
            }
            else{
                console.log("Connexion a la base reussi");
                const collection = client.db('heroku_hntk9vw8').collection('Persons');
                collection.deleteOne({proposition: data.propositionSupprimer}, function(err, o) {
                    if(err){
                        console.log(err.message);
                        io.emit('retourSupprimerUneProposition', {retourSupprimerUneProposition: "Erreur"});
                        client.close();
                    }
                    else{
                        console.log("Suppression de la proposition reussi");
                        // Envoie la reponse
                        io.emit('retourSupprimerUneProposition', {retourSupprimerUneProposition: "Succes"});
                    }
                });
            }
        });
    })
    
});


server.listen(port);
