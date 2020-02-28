var m = angular.module("monApp", []);

m.controller('page1', function($scope, $rootScope){
    var divResult = document.getElementById('divResult');  
    $scope.myTabNote = [];
    $rootScope.randomEnCours = [];
    $rootScope.occurenceTab = [];
    var listeVide = '<p>Liste vide</p>';

    (function(window, io){
        window.addEventListener('load', function(){
            var socket = io();
        
            // au clique sur la touche bouton random on ajoute le mot dans le tableau et dans la div puis on supprime la valeur du champ
            $scope.btnRandom = function(e){   
                if($scope.$$nextSibling.myTabNote && $scope.$$nextSibling.myTabNote.length > 0 || e && e.which == 13 && $scope.$$nextSibling.myTabNote && $scope.$$nextSibling.myTabNote.length > 0){
                    // envoie la proposition au serveur
                    socket.emit('btnRandomProposition', {randomEnCours: $rootScope.randomEnCours})
                }else{
                    divResult.innerHTML = listeVide;
                }
            }
            // recupere la proposition prise au hasard
            socket.on('retourBtnRandomProposition', function(data){
                // insere la proposition dans le tableau des propositions en cours
                $rootScope.randomEnCours.push(data.randomItem); 
                // envoie le tableau des propositions en cours
                socket.emit('btnRandom', {randomEnCours: $rootScope.randomEnCours})
            })

            // tous les clients recupere le tableau des occorences des propositions
            socket.on('retourBtnRandom', function(data){
                console.log('test retour btnRandom', $rootScope.occurenceTab)
                $scope.$apply(() => $rootScope.occurenceTab = data.occurenceTab)
            })
        

        })
    })(window, io);
    
});


m.controller('page2', function($scope, $rootScope, $http){
    var divResult = document.getElementById('divResult');  
    $scope.listeDesRestaurants = document.getElementById('listeDesRestaurants')
    

    $scope.listePropositions = function(proposition){
        // si proposition est egale a 'charger' on affiche la table
        if(proposition == 'charger'){
                // recupere les propositions dans la base 
                $http({
                    url: "/recupereProposition",
                    method: 'POST',
                    data: {tabValeurs: proposition}
                }).then(function (httpResponse) {            
                    // si un message d'erreur est envoyer par le serveur
                    if(httpResponse.data.message == 'Erreur'){
                        console.log('Echec')
                    }
                    // sinon la proposition a bien ete enregistrer
                    else{
                        $scope.myTabNote = []
                        for (var i=0; i<httpResponse.data.propositions.length; i++){
                            $scope.myTabNote.push(httpResponse.data.propositions[i].proposition)
                        }
                        console.log($scope.myTabNote)
                    }
                });    
        }
    }
    $scope.listePropositions('charger');


    (function(window, io){
        window.addEventListener('load', function(){
            var socket = io();

            // au clique sur le boutton ajouter on envoie la proposition puis on supprime la valeur du champ    
            $scope.ajouter = function(){
                // recupere la valeur du champ proposition
                var proposition = document.getElementById('proposition').value;
                // vide le champ proposition
                document.getElementById('proposition').value = '';
                socket.emit('envoieProposition', {tabValeurs: proposition});
            }
            
            // au clique sur la touche "Entrer" on envoie la proposition et on supprime la valeur du champ
            $scope.ajouterEnter = function(e) {
                if(e.which == 13){
                    var proposition = document.getElementById('proposition').value;
                    // vide le champ proposition
                    document.getElementById('proposition').value = '';
                    socket.emit('envoieProposition', {tabValeurs: proposition});
                    
                }
            }
            // recharge la liste des propositions apres un ajout pour tout les utilisateurs
            socket.on('retourEnvoieProposition', function(data){
                if(data.retourBtnRandom == "Succes"){
                    $scope.listePropositions('charger');
                }
            })
        
            // supprimer la liste entiere
            $scope.SupprimerTout = function(){
                $scope.myTabNote = []
                socket.emit('supprimerToutesPropositions', {myTabNote: []});
                
            }
            // recharge la liste des propositions apres une suppression de toutes les propositions pour tout les utilisateurs
            socket.on('retourSupprimerToutesPropositions', function(data){
                if(data.retourSupprimerToutesPropositions == "Succes"){
                    $scope.listePropositions('charger');
                    divResult.innerHTML = ''
                }
            })
        
            // supprime une proposition
            $scope.deleteOne = function(element){
                socket.emit('supprimerUneProposition', {propositionSupprimer: element});
            }
            // recharge la liste des propositions apres une suppression d'une propositions pour tout les utilisateurs
            socket.on('retourSupprimerUneProposition', function(data){
                if(data.retourSupprimerUneProposition == "Succes"){
                    $scope.listePropositions('charger');
                }
            })


        })
    })(window, io);


})