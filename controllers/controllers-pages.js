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


m.controller('page2', function($scope, $rootScope){
    var divResult = document.getElementById('divResult');  
    $scope.listeDesRestaurants = document.getElementById('listeDesRestaurants')
    

    $scope.funcStorage = function(restauration){
        // si restauration est egale a 'charger' on affiche la table
        if(restauration == 'charger'){
            // si un enregistrement local a deja ete effectuer
            if(localStorage.notes){
                $scope.myTabNote = localStorage.notes.split(',');
                $scope.myTabNote.pop()                
            }
        }
        else{
            // supprime la valeur du champ
            document.getElementById('restauration').value = '';
            if(localStorage.notes){
                // ajoute la note au tableau local
                localStorage.notes += restauration + ',';
                // separe les notes dans un tableau
                $scope.myTabNote = localStorage.notes.split(',');
                $scope.myTabNote.pop()
                
            }else{
                localStorage.notes = restauration + ',';
                $scope.myTabNote = localStorage.notes.split(',');
                $scope.myTabNote.pop()
                
            }
        }
    }
    $scope.funcStorage('charger');

    // au clique sur le boutton ajouter on ajoute le mot dans le tableau et dans la div puis on supprime la valeur du champ    
    $scope.ajouter = function(){
        var restauration = document.getElementById('restauration').value;
        $scope.funcStorage(restauration);
        $rootScope.occurenceTab.splice(0, $rootScope.occurenceTab.length)
        
    }

    // au clique sur la touche "Entrer" on ajoute le mot dans le tableau et dans la div puis on supprime la valeur du champ
    $scope.ajouterEnter = function(e) {
        if(e.which == 13){
        var restauration = document.getElementById('restauration').value;
        $scope.funcStorage(restauration);  
        $rootScope.occurenceTab.splice(0, $rootScope.occurenceTab.length)
        $rootScope.randomEnCours.splice(0, $rootScope.randomEnCours.length)
        
        
        }
    }

    // supprimer la liste entiere
    $scope.SupprimerTout = function(){
        localStorage.clear();
        $scope.myTabNote.splice(0, $scope.myTabNote.length)
        $rootScope.occurenceTab.splice(0, $rootScope.occurenceTab.length)
        $rootScope.randomEnCours.splice(0, $rootScope.randomEnCours.length)
        divResult.innerHTML = ''
    }

    // DELETE ONE
    $scope.deleteOne = function(element){
        $scope.testok = false;
        $scope.testrecup = '';
        $rootScope.occurenceTab.splice(0, $rootScope.occurenceTab.length)
        $rootScope.randomEnCours.splice(0, $rootScope.randomEnCours.length)
        for(var i=0; i<$scope.myTabNote.length; i++){
            if($scope.myTabNote[i] == element){
                $scope.myTabNote.splice(i, 1)
                $scope.testok = true;
            }
            
        }
        for(var i=0; i<$scope.myTabNote.length; i++){
            if($scope.testok){
                if($scope.myTabNote[i] != ''){
                    $scope.testrecup += $scope.myTabNote[i] + ','
                }
            }
        }
        localStorage.notes = $scope.testrecup;
    }

})