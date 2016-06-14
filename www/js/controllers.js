angular.module('starter.controllers', ['ngStorage'])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout, $sessionStorage, $state, $window) {

      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});

      // Form data for the login modal

        $scope.apilink = "http://eliesmakhlouf.com/API/";
        $scope.userData = {};
        $scope.users = [];
        $scope.coaches = [];


        $scope.doRefresh = function() {
            $state.go($state.current, {}, {reload: true});
        };

        if (angular.isDefined($sessionStorage.currentUser)) {
            $scope.logged = true;
        }
        else {
            $scope.logged = false;
        }
        if (angular.isDefined($sessionStorage.currentUser)) {
            $scope.currentUser = $sessionStorage.currentUser;
        }

        $scope.logout = function () {
            $timeout(function(){
                $sessionStorage.$reset();
                $state.go('app.login');
                $window.location.reload(true);
            }, 200);

        };

    })
    .controller('RegisterController', function($scope, $http, $state, $ionicPopup, $window){

        $scope.register = function() {
            if ($scope.userData.user_pseudo && $scope.userData.user_email && $scope.userData.user_password) {
                if ($scope.userData.user_pseudo && $scope.userData.user_email && $scope.userData.user_password) {
                    $http.post($scope.apilink + "User/UserController.php", {
                            type: "user",
                            action: "register",
                            user: {
                                user_pseudo: $scope.userData.user_pseudo,
                                user_email: $scope.userData.user_email,
                                user_password: $scope.userData.user_password
                            }
                        })
                        .then(function (res) {
                                var response = res.data;
                                if (response.success == true) {
                                    $ionicPopup.alert({
                                        title: "Inscription réussi",
                                        buttons: [
                                            {
                                                text: 'Connectez-vous',
                                                type: 'button-positive',
                                                onTap: function () {
                                                    $state.go('app.login');
                                                    $window.location.reload(true);
                                                }
                                            }
                                        ]
                                    });
                                }else {
                                    $ionicPopup.alert({
                                        title:"Ce compte existe déjà",
                                        button:[
                                            {
                                                text: 'Ok',
                                                type: 'button-positive',
                                                onTap: function(){
                                                    $state.go($state.current);

                                                }
                                            }
                                        ]
                                    });
                                }
                            },
                            function(error) {
                                $scope.userData = {};
                                console.log(error);
                            }
                        );
                }
            }else{
                $ionicPopup.alert({
                    title:"Veuillez remplir tous les champs",
                    button:[
                        {
                            text: 'Ok',
                            type: 'button-positive',
                            onTap: function(){
                                $state.go($state.current);
                            }
                        }
                    ]
                });
            }
        }
    })


    .controller('LoginController', function($scope, $http, $state, $sessionStorage, $window, $ionicPopup, $timeout){

        if (angular.isDefined($sessionStorage.currentUser)) {
            $state.go('app.profil');
        }

        $scope.viewRegister = function() {
            $state.go("app.register");
            $scope.error = "";
        };


        $scope.login = function() {
            if ($scope.userData.user_email && $scope.userData.user_password) {
                $http.post($scope.apilink + "User/UserController.php", {
                        type: "user",
                        action: "login",
                        user: {
                            user_email: $scope.userData.user_email,
                            user_password: $scope.userData.user_password
                        }
                    })
                    .then(function (res) {
                            var response = res.data;

                            if(response.success == true) {
                                $scope.userData = {};
                                $sessionStorage.currentUser = response.user;
                                $timeout(function(){
                                    $state.go('app.recettes');
                                    $window.location.reload(true);
                                    console.log($sessionStorage.currentUser);
                                }, 300);
                            }else {
                                $scope.userData.user_password = "";
                                $ionicPopup.alert({
                                    title:"Identifiants incorrects",
                                    button:[
                                        {
                                            text: 'Ok',
                                            type: 'button-positive',
                                            onTap: function(){
                                                $state.go('app.login');
                                            }
                                        }
                                    ]
                                });
                            }
                        },
                        function () {
                            console.log('ERROR REGISTER');
                            $scope.userData = {};
                        });
            }else{
                $ionicPopup.alert({
                    title:"Veuillez remplir tous les champs",
                    button:[
                        {
                            text: 'Ok',
                            type: 'button-positive',
                            onTap: function(){
                                $state.go($state.current);
                            }
                        }
                    ]
                });
            }
        };
    })


    .controller('RecettesController', function($scope, $state, $window, $http){
        $scope.findRecettes = function() {
            if ($scope.logged == true) {
                $http.post($scope.apilink+"Recette/RecetteController.php", {
                        type : 'recette',
                        action : 'findAll'
                    })

                    .then(function (res){
                            var response = res.data;
                            $scope.recettes = response;
                            if (Object.keys($scope.recettes).length == 0) {
                                $scope.recettesEmpty = true;
                            }
                            else {
                                $scope.recettesEmpty = false;
                            }

                        },
                        function(error){
                            console.warn('ERROR FIND ALL RECETTE');
                            console.log(error);
                        }
                    );
            }
        };
        $scope.findRecettes();
    })

        .controller('ProfilController', function($scope, $http, $state, $sessionStorage, $ionicPopup){




        $scope.updateUser = function (){
            if($scope.userData.user_password && $scope.userData.user_password_confirm){
                if ($scope.userData.user_password == $scope.userData.user_password_confirm) {
                    $scope.error = "";

                    $http.post($scope.apilink+"User/UserController.php",
                        {
                            type : 'user',
                            action : 'update',
                            user: {
                                user_id : $sessionStorage.currentUser.user_id,
                                user_password : $scope.userData.user_password
                            }
                        })

                        .then(function (res){
                                var response = res.data;
                                $ionicPopup.alert({
                                    title: "Mot de passe modifié",
                                    buttons: [
                                        {
                                            text: 'Ok',
                                            type: 'button-positive',
                                            onTap: function () {
                                                $state.go($state.current, {}, {reload: true});
                                                $scope.userData = {};
                                            }
                                        }
                                    ]
                                });
                            },
                            function(error){
                                $scope.userData = {};
                                console.log(error);
                            }
                        );
                }
                else {
                    $ionicPopup.alert({
                        title:"Password doesn't match",
                        button:[
                            {
                                text: 'Ok',
                                type: 'button-positive',
                                onTap: function(){
                                    $state.go($state.current);
                                }
                            }
                        ]
                    });
                    $scope.userData.user_password_confirm = "";
                }
            }
            else {
                $ionicPopup.alert({
                    title:"Veuillez remplir tous les champs",
                    button:[
                        {
                            text: 'Ok',
                            type: 'button-positive',
                            onTap: function(){
                                $state.go($state.current);
                            }
                        }
                    ]
                });
            }
        };

        $scope.deleteUser = function () {
            $ionicPopup.confirm({
                title: 'Supprimer mon compte ?',
                buttons: [
                    {
                        text: 'Non',
                        onTap: function () {
                            $state.go($state.current, {}, {reload: true});
                        }
                    },
                    {
                        text: 'Oui',
                        type: 'button-assertive',
                        onTap: function () {
                            $http.post($scope.apilink + "User/UserController.php", {
                                    type: 'user',
                                    action: 'delete',
                                    user: {
                                        user_id: $sessionStorage.currentUser.user_id,
                                        user_email: $sessionStorage.currentUser.user_email
                                    }
                                })

                                .then(function (res) {
                                        var response = res.data;
                                        $scope.logout();


                                    }, function () {
                                        console.warn('ERROR DELETE PRODUCT');
                                    }
                                );
                        }
                    }
                ]
            });
        }
    });