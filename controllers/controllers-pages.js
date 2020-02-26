var m = angular.module("monApp", []);

m.controller('page1', function($scope, $rootScope){
    var divResult = document.getElementById('divResult');  
    $scope.myTabNote = [];
    $rootScope.randomEnCours = [];
    $rootScope.occurenceTab = [];
    var listeVide = '<p>Liste vide</p>';

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
        $rootScope.occurenceTab = Object.keys(result).map(function(key) {
            return [key, result[key]];
          });
    }      

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
    $scope.btnRandom = function(){   
        if($scope.$$nextSibling.myTabNote && $scope.$$nextSibling.myTabNote.length > 0){
            var randomItem = $scope.$$nextSibling.myTabNote[Math.floor(Math.random()*$scope.$$nextSibling.myTabNote.length)];      
                $rootScope.randomEnCours.push(randomItem);                            
                countOccurences($rootScope.randomEnCours)
                loading(randomItem)
        }else{
            divResult.innerHTML = listeVide;
        }
    }

    // au clique sur la touche "Entrer" on ajoute le mot dans le tableau et dans la div puis on supprime la valeur du champ
    $scope.randomEnter = function(e) {
        if(e.which == 13){
            if($scope.$$nextSibling.myTabNote && $scope.$$nextSibling.myTabNote.length > 0){
                var randomItem = $scope.$$nextSibling.myTabNote[Math.floor(Math.random()*$scope.$$nextSibling.myTabNote.length)];
                    $rootScope.randomEnCours.push(randomItem);                                
                    countOccurences($rootScope.randomEnCours)
                    loading(randomItem)
            }else{
                divResult.innerHTML = listeVide;
            }
        }
    }
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

    // au clique sur le boutton ajouter on ajoute le mot dans le tableau et dans la div puis on supprime la valeur du champ    
    $scope.ajouter = function(){
        // recupere la valeur du champ proposition
        var proposition = document.getElementById('proposition').value;
        // vide le champ proposition
        document.getElementById('proposition').value = '';
        // envoie le champ en base de donnees
        $http({
            url: "/envoieProposition",
            method: 'POST',
            data: {tabValeurs: proposition}
        }).then(function (httpResponse) {            
            // si un message d'erreur est envoyer par le serveur
            if(httpResponse.data.message == 'Erreur'){
                console.log('Echec')
            }
            // sinon la proposition a bien ete enregistrer
            else{
                console.log('Proposition enregistrer')
                $scope.listePropositions('charger');
            }
        });
    }

    // au clique sur la touche "Entrer" on ajoute le mot dans le tableau et dans la div puis on supprime la valeur du champ
    $scope.ajouterEnter = function(e) {
        if(e.which == 13){
            var proposition = document.getElementById('proposition').value;
            // vide le champ proposition
            document.getElementById('proposition').value = '';
            // envoie le champ en base de donnees
            $http({
                url: "/envoieProposition",
                method: 'POST',
                data: {tabValeurs: proposition}
            }).then(function (httpResponse) {    
                console.log(httpResponse.data)        
                // si un message d'erreur est envoyer par le serveur
                if(httpResponse.data.message == 'Erreur'){
                    console.log('Echec')
                }
                // sinon la proposition a bien ete enregistrer
                else{
                    console.log('Proposition enregistrer')
                    $scope.listePropositions('charger');
                }
            });
        
        }
    }

    // supprimer la liste entiere
    $scope.SupprimerTout = function(){
        $scope.myTabNote = []
        // envoie le champ en base de donnees
        $http({
            url: "/supprimerToutesPropositions",
            method: 'POST'
        }).then(function (httpResponse) {            
            // si un message d'erreur est envoyer par le serveur
            if(httpResponse.data.message == 'Erreur'){
                console.log('Echec')
            }
            // sinon la proposition a bien ete enregistrer
            else{
                console.log('Proposition supprimer')
            }
        });
        
        divResult.innerHTML = ''
    }

    // DELETE ONE
    $scope.deleteOne = function(element){
        $http({
            url: '/supprimerUneProposition',
            method: 'POST',
            data: {propositionSupprimer: element}
        }).then(function (httpResponse){
            if(httpResponse.data.message == 'Erreur'){
                console.log('Echec')
            }
            else{
                console.log('Proposition supprimer')
                $scope.listePropositions('charger');
            }
        });
    }

})