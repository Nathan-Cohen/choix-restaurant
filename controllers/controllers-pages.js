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
                 
        
            function loading(item){
                // ajoute les bars de chargements
                divResult.innerHTML = '<div class="line"></div><div class="line"></div><div class="line"></div>'
                // ajoute la class load
                $('#divResult').addClass('load')
                // cache la div des resultats du nombre d'occurences
                $('#totalResultatRandom').css('display', 'none')
                
                var load = Math.floor(Math.random() * (200 - 500 + 1)) + 500;
                var timeLoad = setTimeout(function(){
                    // affiche le resultat dans la div resultat
                    divResult.innerHTML = '<strong>' + item + '</strong>';
                    // supprime la class load            
                    $('#divResult').removeClass('load')
                    // affiche la div des resultats du nombre d'occurence
                    $('#totalResultatRandom').css('display', 'table')            
                }, load);
            }
        
            // au clique sur la touche bouton random on ajoute le mot dans le tableau et dans la div puis on supprime la valeur du champ
            $scope.btnRandom = function(e){   
                if($scope.$$nextSibling.myTabNote && $scope.$$nextSibling.myTabNote.length > 0 || e && e.which == 13 && $scope.$$nextSibling.myTabNote && $scope.$$nextSibling.myTabNote.length > 0){
                    var randomItem = $scope.$$nextSibling.myTabNote[Math.floor(Math.random()*$scope.$$nextSibling.myTabNote.length)]; 
                    console.log('test randomItem', randomItem)
                    $rootScope.randomEnCours.push(randomItem);                            
                    // envoie la proposition au serveur
                    socket.emit('btnRandom', {randomEnCours: $rootScope.randomEnCours})
                    
                    // countOccurences($rootScope.randomEnCours)
                    // loading(randomItem)
                }else{
                    divResult.innerHTML = listeVide;
                }
            }
            // tous les clients recupere la proposition
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